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
const cartItemsFile = path.join(authDataDir, 'cart.json');
const ordersFile = path.join(authDataDir, 'orders.json');

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

  const ensureFile = async (filePath, fallback) => {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf8');
    }
  };

  await ensureFile(authUsersFile, { users: [] });
  await ensureFile(cartItemsFile, { items: [] });
  await ensureFile(ordersFile, { items: [] });
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

const readLocalCollection = async (filePath) => {
  await createFileStore();
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed?.items) ? parsed.items : [];
};

const writeLocalCollection = async (filePath, items) => {
  await createFileStore();
  await fs.writeFile(filePath, JSON.stringify({ items }, null, 2), 'utf8');
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

const cartSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    bookId: { type: String, required: true, index: true },
    quantity: { type: Number, default: 1, min: 1 },
    bookSnapshot: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

cartSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const orderBookSchema = new mongoose.Schema(
  {
    id: { type: String },
    bookId: { type: String },
    title: { type: String },
    author: { type: String },
    subject: { type: String },
    branch: { type: String },
    semester: { type: String },
    condition: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    seller: { type: String },
    sellerId: { type: String },
    college: { type: String },
    location: { type: String },
    image: { type: String },
  },
  { _id: false },
);

const orderAddressSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    college: { type: String },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    books: { type: [orderBookSchema], default: [] },
    sellerId: { type: String, default: 'multiple' },
    price: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Completed'],
    },
    deliveryAddress: { type: orderAddressSchema, required: true },
    orderedDate: { type: Date, default: Date.now },
    deliveredDate: { type: Date },
    transactionId: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

const CartModel = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

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

const normalizeSnapshotBook = (book = {}) => ({
  id: String(book.id ?? book.bookId ?? book._id ?? Date.now()),
  title: String(book.title ?? book.name ?? 'Untitled'),
  author: String(book.author ?? 'Unknown'),
  subject: String(book.subject ?? 'General'),
  branch: String(book.branch ?? 'General'),
  semester: String(book.semester ?? '1st'),
  condition: String(book.condition ?? 'Good'),
  price: Number(book.price ?? 0),
  exchangeAvailable: Boolean(book.exchangeAvailable ?? false),
  seller: String(book.seller ?? 'Unknown'),
  college: String(book.college ?? 'Unknown College'),
  location: String(book.location ?? 'Unknown'),
  image: String(book.image ?? fallbackImage),
});

const normalizeOrderAddress = (address = {}) => ({
  name: String(address.name ?? ''),
  phone: String(address.phone ?? ''),
  line1: String(address.line1 ?? ''),
  line2: address.line2 ? String(address.line2) : undefined,
  city: String(address.city ?? ''),
  state: String(address.state ?? ''),
  pincode: String(address.pincode ?? ''),
  college: address.college ? String(address.college) : undefined,
});

const normalizeOrderBook = (book = {}) => ({
  id: String(book.id ?? book.bookId ?? Date.now()),
  bookId: String(book.bookId ?? book.id ?? Date.now()),
  title: String(book.title ?? 'Untitled'),
  author: String(book.author ?? 'Unknown'),
  subject: String(book.subject ?? 'General'),
  branch: String(book.branch ?? 'General'),
  semester: String(book.semester ?? '1st'),
  condition: String(book.condition ?? 'Good'),
  price: Number(book.price ?? 0),
  quantity: Number(book.quantity ?? 1),
  seller: String(book.seller ?? 'Unknown'),
  sellerId: book.sellerId ? String(book.sellerId) : undefined,
  college: String(book.college ?? 'Unknown College'),
  location: String(book.location ?? 'Unknown'),
  image: String(book.image ?? fallbackImage),
});

const paymentMethods = ['Cash on Delivery', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'];
const cancellableStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped'];

const toPublicCartItem = (item) => ({
  id: String(item.id ?? item._id),
  userId: String(item.userId),
  bookId: String(item.bookId),
  quantity: Number(item.quantity ?? 1),
  book: item.bookSnapshot ? normalizeSnapshotBook(item.bookSnapshot) : undefined,
  createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : undefined,
  updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : undefined,
});

const toPublicOrder = (order) => ({
  id: String(order.id ?? order._id),
  userId: String(order.userId),
  books: Array.isArray(order.books) ? order.books.map(normalizeOrderBook) : [],
  sellerId: String(order.sellerId ?? 'multiple'),
  price: Number(order.price ?? 0),
  paymentMethod: String(order.paymentMethod ?? 'UPI'),
  status: String(order.status ?? 'Pending'),
  deliveryAddress: normalizeOrderAddress(order.deliveryAddress ?? {}),
  orderedDate: new Date(order.orderedDate ?? order.createdAt ?? Date.now()).toISOString(),
  deliveredDate: order.deliveredDate ? new Date(order.deliveredDate).toISOString() : null,
  transactionId: String(order.transactionId ?? `TXN-${Date.now()}`),
  createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : undefined,
  updatedAt: order.updatedAt ? new Date(order.updatedAt).toISOString() : undefined,
});

const getCartCollection = async () => {
  if (authMode === 'mongo') {
    return CartModel.find({}).lean();
  }

  return readLocalCollection(cartItemsFile);
};

const getCartItemsForUser = async (userId) => {
  const items = await getCartCollection();
  return items.filter((item) => String(item.userId) === String(userId));
};

const saveCartCollection = async (items) => {
  if (authMode === 'mongo') {
    await CartModel.deleteMany({});
    if (items.length > 0) {
      await CartModel.insertMany(items);
    }
    return;
  }

  await writeLocalCollection(cartItemsFile, items);
};

const getOrderCollection = async () => {
  if (authMode === 'mongo') {
    return OrderModel.find({}).lean();
  }

  return readLocalCollection(ordersFile);
};

const getOrdersForUser = async (userId) => {
  const items = await getOrderCollection();
  return items.filter((item) => String(item.userId) === String(userId));
};

const saveOrderCollection = async (items) => {
  if (authMode === 'mongo') {
    await OrderModel.deleteMany({});
    if (items.length > 0) {
      await OrderModel.insertMany(items);
    }
    return;
  }

  await writeLocalCollection(ordersFile, items);
};

const replaceUserCartItems = async (userId, nextItems) => {
  const allItems = await getCartCollection();
  const remaining = allItems.filter((item) => String(item.userId) !== String(userId));
  await saveCartCollection([...remaining, ...nextItems]);
  return nextItems;
};

const updateUserCartItem = async (userId, cartItemId, updater) => {
  const allItems = await getCartCollection();
  const index = allItems.findIndex((item) => String(item.userId) === String(userId) && String(item.id ?? item._id) === String(cartItemId));
  if (index === -1) {
    return null;
  }

  const nextItem = updater(allItems[index]);
  allItems[index] = nextItem;
  await saveCartCollection(allItems);
  return nextItem;
};

const removeUserCartItem = async (userId, cartItemId) => {
  const allItems = await getCartCollection();
  const nextItems = allItems.filter(
    (item) => !(String(item.userId) === String(userId) && String(item.id ?? item._id) === String(cartItemId)),
  );
  const changed = nextItems.length !== allItems.length;
  if (changed) {
    await saveCartCollection(nextItems);
  }

  return changed;
};

const clearUserCartItems = async (userId) => {
  const allItems = await getCartCollection();
  const nextItems = allItems.filter((item) => String(item.userId) !== String(userId));
  await saveCartCollection(nextItems);
};

const appendOrder = async (order) => {
  const allOrders = await getOrderCollection();
  allOrders.unshift(order);
  await saveOrderCollection(allOrders);
  return order;
};

const updateUserOrder = async (userId, orderId, updater) => {
  const allOrders = await getOrderCollection();
  const index = allOrders.findIndex((item) => String(item.userId) === String(userId) && String(item.id ?? item._id) === String(orderId));
  if (index === -1) {
    return null;
  }

  const nextOrder = updater(allOrders[index]);
  allOrders[index] = nextOrder;
  await saveOrderCollection(allOrders);
  return nextOrder;
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

app.get('/api/cart', requireAuth, async (req, res) => {
  try {
    const items = await getCartItemsForUser(req.authUser.id ?? req.authUser._id);
    res.json(items.map(toPublicCartItem));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/cart/add', requireAuth, async (req, res) => {
  try {
    const bookId = String(req.body?.bookId ?? '').trim();
    const quantity = Math.max(1, Number(req.body?.quantity ?? 1));
    const bookSnapshot = req.body?.bookSnapshot ?? req.body?.book ?? null;

    if (!bookId) {
      res.status(400).json({ message: 'Book ID is required' });
      return;
    }

    const userId = String(req.authUser.id ?? req.authUser._id);
    const existingItem = (await getCartItemsForUser(userId)).find((item) => String(item.bookId) === bookId);
    if (existingItem) {
      res.json(toPublicCartItem(existingItem));
      return;
    }

    const item = {
      id: new mongoose.Types.ObjectId().toString(),
      userId,
      bookId,
      quantity,
      bookSnapshot: bookSnapshot ? normalizeSnapshotBook(bookSnapshot) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (authMode === 'mongo') {
      const created = await CartModel.create(item);
      res.status(201).json(toPublicCartItem(created.toObject()));
      return;
    }

    await replaceUserCartItems(userId, [...(await getCartItemsForUser(userId)), item]);
    res.status(201).json(toPublicCartItem(item));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to add book to cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.put('/api/cart/update', requireAuth, async (req, res) => {
  try {
    const cartItemId = String(req.body?.id ?? '').trim();
    const quantity = Math.max(1, Number(req.body?.quantity ?? 1));

    if (!cartItemId) {
      res.status(400).json({ message: 'Cart item ID is required' });
      return;
    }

    const userId = String(req.authUser.id ?? req.authUser._id);
    const updated = await updateUserCartItem(userId, cartItemId, (item) => ({
      ...item,
      quantity,
      updatedAt: new Date().toISOString(),
    }));

    if (!updated) {
      res.status(404).json({ message: 'Cart item not found' });
      return;
    }

    res.json(toPublicCartItem(updated));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update cart item',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.delete('/api/cart/remove/:id', requireAuth, async (req, res) => {
  try {
    const userId = String(req.authUser.id ?? req.authUser._id);
    const removed = await removeUserCartItem(userId, req.params.id);
    if (!removed) {
      res.status(404).json({ message: 'Cart item not found' });
      return;
    }

    res.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to remove cart item',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.delete('/api/cart/clear', requireAuth, async (req, res) => {
  try {
    const userId = String(req.authUser.id ?? req.authUser._id);
    await clearUserCartItems(userId);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to clear cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const userId = String(req.authUser.id ?? req.authUser._id);
    const orders = await getOrdersForUser(userId);
    res.json(orders.map(toPublicOrder).sort((left, right) => new Date(right.orderedDate).getTime() - new Date(left.orderedDate).getTime()));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load orders',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/orders/:id', requireAuth, async (req, res) => {
  try {
    const userId = String(req.authUser.id ?? req.authUser._id);
    const orders = await getOrdersForUser(userId);
    const order = orders.find((item) => String(item.id ?? item._id) === req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(toPublicOrder(order));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/orders/create', requireAuth, async (req, res) => {
  try {
    const userId = String(req.authUser.id ?? req.authUser._id);
    const rawBooks = Array.isArray(req.body?.books) ? req.body.books : [];
    const books = rawBooks.map(normalizeOrderBook).filter((book) => book.bookId && book.title);
    const computedPrice = books.reduce((total, book) => total + book.price * book.quantity, 0);
    const price = Number(req.body?.price ?? computedPrice);
    const paymentMethod = String(req.body?.paymentMethod ?? 'UPI');
    const deliveryAddress = normalizeOrderAddress(req.body?.deliveryAddress ?? {});
    const sellerId = String(req.body?.sellerId ?? books[0]?.sellerId ?? 'multiple');
    const selectedCartItemIds = Array.isArray(req.body?.selectedCartItemIds) ? req.body.selectedCartItemIds.map(String) : [];

    if (books.length === 0) {
      res.status(400).json({ message: 'At least one book is required to create an order' });
      return;
    }

    if (books.some((book) => !book.title || !book.author || !book.subject || !book.price || book.quantity < 1)) {
      res.status(400).json({ message: 'Order items are invalid' });
      return;
    }

    if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.line1 || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      res.status(400).json({ message: 'Delivery address is incomplete' });
      return;
    }

    if (!paymentMethods.includes(paymentMethod)) {
      res.status(400).json({ message: 'Invalid payment method' });
      return;
    }

    if (Number.isNaN(price) || price < computedPrice) {
      res.status(400).json({ message: 'Invalid order total' });
      return;
    }

    const order = {
      id: new mongoose.Types.ObjectId().toString(),
      userId,
      books,
      sellerId,
      price,
      paymentMethod,
      status: 'Pending',
      deliveryAddress,
      orderedDate: new Date().toISOString(),
      deliveredDate: null,
      transactionId: `TXN-${crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (authMode === 'mongo') {
      const created = await OrderModel.create(order);
      const publicOrder = toPublicOrder(created.toObject());
      const userCart = await getCartItemsForUser(userId);
      if (selectedCartItemIds.length > 0) {
        await replaceUserCartItems(
          userId,
          userCart.filter((item) => !selectedCartItemIds.includes(String(item.id ?? item._id))),
        );
      } else {
        await clearUserCartItems(userId);
      }
      res.status(201).json(publicOrder);
      return;
    }

    await appendOrder(order);
    const userCart = await getCartItemsForUser(userId);
    if (selectedCartItemIds.length > 0) {
      await replaceUserCartItems(
        userId,
        userCart.filter((item) => !selectedCartItemIds.includes(String(item.id ?? item._id))),
      );
    } else {
      await clearUserCartItems(userId);
    }

    res.status(201).json(toPublicOrder(order));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.put('/api/orders/cancel/:id', requireAuth, async (req, res) => {
  try {
    const userId = String(req.authUser.id ?? req.authUser._id);
    const allOrders = await getOrderCollection();
    const existingOrder = allOrders.find(
      (item) => String(item.userId) === String(userId) && String(item.id ?? item._id) === String(req.params.id),
    );

    if (!existingOrder) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (!cancellableStatuses.includes(String(existingOrder.status))) {
      res.status(409).json({ message: 'This order cannot be cancelled anymore' });
      return;
    }

    const updated = await updateUserOrder(userId, req.params.id, (order) => ({
      ...order,
      status: 'Cancelled',
      updatedAt: new Date().toISOString(),
    }));

    if (!updated) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(toPublicOrder(updated));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to cancel order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.put('/api/orders/status/:id', requireAuth, async (req, res) => {
  try {
    const userId = String(req.authUser.id ?? req.authUser._id);
    const status = String(req.body?.status ?? '').trim();
    const allowedStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Completed'];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid order status' });
      return;
    }

    const allOrders = await getOrderCollection();
    const existingOrder = allOrders.find(
      (item) => String(item.userId) === String(userId) && String(item.id ?? item._id) === String(req.params.id),
    );
    if (!existingOrder) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (['Cancelled', 'Completed'].includes(String(existingOrder.status))) {
      res.status(409).json({ message: 'This order can no longer be updated' });
      return;
    }

    const updated = await updateUserOrder(userId, req.params.id, (order) => ({
      ...order,
      status,
      deliveredDate: ['Delivered', 'Completed'].includes(status) ? new Date().toISOString() : order.deliveredDate,
      updatedAt: new Date().toISOString(),
    }));

    if (!updated) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(toPublicOrder(updated));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update order status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
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
