import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = Number(process.env.PORT || 5000);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const preferredTableName = process.env.SUPABASE_TABLE_NAME?.trim();
const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'book-exchange-dev-secret';
const mongoUri = process.env.MONGODB_URI?.trim();
const fallbackImage =
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80';

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

const tableCandidates = Array.from(new Set([preferredTableName, 'projects', 'books'].filter(Boolean)));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authDataDir = path.join(__dirname, '.data');
const authUsersFile = path.join(authDataDir, 'users.json');

const base64Url = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

const signToken = (payload, expiresInSeconds = 60 * 60 * 24 * 7) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };
  const encodedHeader = base64Url(header);
  const encodedPayload = base64Url(body);
  const signature = crypto
    .createHmac('sha256', jwtSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const verifyToken = (token) => {
  if (!token) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac('sha256', jwtSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
};

const isMissingTableError = (error) => {
  const message = `${error?.message ?? ''}`.toLowerCase();
  return error?.code === '42P01' || message.includes('does not exist');
};

const normalizeBook = (row, fallbackId) => ({
  id: row.id ?? row.book_id ?? fallbackId,
  title: row.title ?? row.name ?? row.book_title ?? 'Untitled',
  author: row.author ?? row.writer ?? row.seller_name ?? 'Unknown',
  subject: row.subject ?? row.category ?? 'General',
  branch: row.branch ?? row.department ?? row.stream ?? row.category ?? 'General',
  semester: row.semester ?? row.sem ?? row.term ?? '1st',
  condition: row.condition ?? row.state ?? 'Good',
  price: Number(row.price ?? row.amount ?? row.cost ?? 0),
  exchangeAvailable: Boolean(row.exchangeAvailable ?? row.exchange_available ?? row.exchange ?? false),
  seller: row.seller ?? row.owner ?? row.contact_name ?? row.author ?? 'Unknown',
  college: row.college ?? row.institution ?? row.school ?? 'Unknown College',
  location: row.location ?? row.city ?? row.campus ?? 'Unknown',
  image: row.image ?? row.image_url ?? row.cover_url ?? fallbackImage,
  description: row.description ?? row.summary ?? row.details ?? '',
  category: row.category ?? row.branch ?? 'General',
});

const normalizeOutgoingBook = (book) => ({
  title: String(book?.title ?? 'Untitled'),
  author: String(book?.author ?? 'Unknown'),
  subject: String(book?.subject ?? 'General'),
  branch: String(book?.branch ?? 'General'),
  semester: String(book?.semester ?? '1st'),
  condition: String(book?.condition ?? 'Good'),
  price: Number(book?.price ?? 0),
  exchangeAvailable: Boolean(book?.exchangeAvailable),
  seller: String(book?.seller ?? 'Unknown'),
  college: String(book?.college ?? 'Unknown College'),
  location: String(book?.location ?? 'Unknown'),
  image: String(book?.image ?? fallbackImage),
  description: String(book?.description ?? ''),
  category: String(book?.category ?? book?.branch ?? 'General'),
});

const publicUser = (user) => ({
  id: String(user.id ?? user._id),
  name: user.name,
  email: user.email,
  college: user.college,
  branch: user.branch,
  semester: user.semester,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
});

const createFileStore = async () => {
  await fs.mkdir(authDataDir, { recursive: true });

  try {
    await fs.access(authUsersFile);
  } catch {
    await fs.writeFile(authUsersFile, JSON.stringify({ users: [] }, null, 2), 'utf8');
  }
};

const readLocalUsers = async () => {
  await createFileStore();
  const raw = await fs.readFile(authUsersFile, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed?.users) ? parsed.users : [];
};

const writeLocalUsers = async (users) => {
  await createFileStore();
  await fs.writeFile(authUsersFile, JSON.stringify({ users }, null, 2), 'utf8');
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    college: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    phone: { type: String, required: true },
    avatarUrl: { type: String },
    passwordHash: { type: String, required: true },
    provider: { type: String, default: 'local' },
  },
  { timestamps: true },
);

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

let authMode = 'file';

const connectAuthDatabase = async () => {
  if (!mongoUri) {
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    authMode = 'mongo';
    console.log('Auth storage connected to MongoDB');
  } catch (error) {
    authMode = 'file';
    console.warn('MongoDB connection failed, using file-backed auth store instead');
    console.warn(error instanceof Error ? error.message : error);
  }
};

const getUserRecordByEmail = async (email) => {
  if (!email) {
    return null;
  }

  if (authMode === 'mongo') {
    return UserModel.findOne({ email: email.toLowerCase().trim() }).lean();
  }

  const users = await readLocalUsers();
  return users.find((user) => user.email === email.toLowerCase().trim()) ?? null;
};

const getUserRecordById = async (id) => {
  if (!id) {
    return null;
  }

  if (authMode === 'mongo') {
    return UserModel.findById(id).lean();
  }

  const users = await readLocalUsers();
  return users.find((user) => String(user.id) === String(id)) ?? null;
};

const createUserRecord = async (payload) => {
  const id = new mongoose.Types.ObjectId().toString();
  const record = {
    id,
    name: payload.name,
    email: payload.email.toLowerCase().trim(),
    college: payload.college,
    branch: payload.branch,
    semester: payload.semester,
    phone: payload.phone,
    avatarUrl: payload.avatarUrl || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(payload.name)}`,
    passwordHash: payload.passwordHash,
    provider: payload.provider ?? 'local',
  };

  if (authMode === 'mongo') {
    const created = await UserModel.create(record);
    return created.toObject();
  }

  const users = await readLocalUsers();
  users.push(record);
  await writeLocalUsers(users);
  return record;
};

const updateUserRecord = async (id, nextValues) => {
  if (authMode === 'mongo') {
    const updated = await UserModel.findByIdAndUpdate(id, nextValues, { new: true }).lean();
    return updated;
  }

  const users = await readLocalUsers();
  const index = users.findIndex((user) => String(user.id) === String(id));
  if (index === -1) {
    return null;
  }

  users[index] = { ...users[index], ...nextValues };
  await writeLocalUsers(users);
  return users[index];
};

const buildAuthSession = (user) => ({
  user: publicUser(user),
  token: signToken({
    sub: String(user.id ?? user._id),
    email: user.email,
    name: user.name,
    provider: user.provider ?? 'local',
  }),
});

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice('Bearer '.length)
    : null;

  const payload = verifyToken(token);
  if (!payload?.sub) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const user = await getUserRecordById(payload.sub);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  req.authUser = user;
  next();
};

const fetchBooksFromSupabase = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured in .env');
  }

  for (const tableName of tableCandidates) {
    const { data, error } = await supabase.from(tableName).select('*');

    if (error) {
      if (isMissingTableError(error)) {
        continue;
      }
      throw error;
    }

    return (data ?? []).map((row, index) => normalizeBook(row, index + 1));
  }

  return [];
};

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Book Exchange API is running',
    supabase: Boolean(supabase),
    authMode,
  });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const name = String(req.body?.name ?? '').trim();
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const college = String(req.body?.college ?? '').trim();
    const branch = String(req.body?.branch ?? '').trim();
    const semester = String(req.body?.semester ?? '').trim();
    const phone = String(req.body?.phone ?? '').trim();
    const password = String(req.body?.password ?? '');

    if (!name || !email || !college || !branch || !semester || !phone || !password) {
      res.status(400).json({ message: 'All registration fields are required' });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400).json({ message: 'Enter a valid email address' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters' });
      return;
    }

    const existingUser = await getUserRecordByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: 'An account with this email already exists' });
      return;
    }

    const createdUser = await createUserRecord({
      name,
      email,
      college,
      branch,
      semester,
      phone,
      passwordHash: await bcrypt.hash(password, 10),
      provider: 'local',
    });

    res.status(201).json(buildAuthSession(createdUser));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create account',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await getUserRecordByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash || '');
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json(buildAuthSession(user));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to sign in',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  res.json({ user: publicUser(req.authUser) });
});

app.post('/api/auth/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const name = String(req.body?.name ?? 'Google Student').trim();
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const college = String(req.body?.college ?? 'Campus College').trim();
    const branch = String(req.body?.branch ?? 'Computer Science').trim();
    const semester = String(req.body?.semester ?? '4th').trim();
    const phone = String(req.body?.phone ?? '9999999999').trim();
    const avatarUrl = String(req.body?.avatarUrl ?? '').trim();

    if (!email) {
      res.status(400).json({ message: 'Google account email is required' });
      return;
    }

    const existingUser = await getUserRecordByEmail(email);
    let user = existingUser;

    if (!user) {
      user = await createUserRecord({
        name,
        email,
        college,
        branch,
        semester,
        phone,
        avatarUrl,
        passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
        provider: 'google',
      });
    } else if (!existingUser.avatarUrl && avatarUrl) {
      user = (await updateUserRecord(existingUser.id ?? existingUser._id, { avatarUrl })) ?? existingUser;
    }

    res.json(buildAuthSession(user));
  } catch (error) {
    res.status(500).json({
      message: 'Google sign-in failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/books', async (_req, res) => {
  try {
    const books = await fetchBooksFromSupabase();
    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch books from Supabase',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/books', async (req, res) => {
  if (!supabase) {
    res.status(500).json({
      message: 'Supabase is not configured in .env',
    });
    return;
  }

  const payload = normalizeOutgoingBook(req.body);

  for (const tableName of tableCandidates) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        continue;
      }

      res.status(400).json({
        message: 'Failed to save book to Supabase',
        error: error.message,
      });
      return;
    }

    res.status(201).json(normalizeBook(data, data?.id ?? Date.now()));
    return;
  }

  res.status(500).json({
    message: 'Could not find a Supabase table to save the book',
  });
});

const startServer = async () => {
  await connectAuthDatabase();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
