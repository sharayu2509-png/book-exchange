import { motion } from 'framer-motion';
import { Upload, PlusCircle, ImagePlus } from 'lucide-react';
import { useState } from 'react';
import type { Book } from '../types';

interface SellBookPageProps {
  onSubmit: (book: Book) => void;
}

export const SellBookPage = ({ onSubmit }: SellBookPageProps) => {
  const [preview, setPreview] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newBook: Book = {
      id: Date.now(),
      title: String(formData.get('title') || 'Untitled'),
      author: String(formData.get('author') || 'Unknown'),
      subject: String(formData.get('subject') || 'General'),
      branch: String(formData.get('branch') || 'General'),
      semester: String(formData.get('semester') || '1st'),
      condition: (formData.get('condition') as Book['condition']) || 'Good',
      price: Number(formData.get('price') || 0),
      exchangeAvailable: Boolean(formData.get('exchangeAvailable')),
      seller: 'You',
      college: 'Your College',
      location: String(formData.get('location') || 'City'),
      image: preview || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
      description: String(formData.get('description') || 'Great academic resource'),
      category: String(formData.get('branch') || 'Engineering'),
    };
    onSubmit(newBook);
    event.currentTarget.reset();
    setPreview('');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-border bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Sell your book</p>
            <h1 className="text-2xl font-semibold">List a new book</h1>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary"><PlusCircle size={20} /></div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
          <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-bg p-6 text-center">
            <ImagePlus size={28} className="text-primary" />
            <span className="mt-2 font-semibold">Upload Book Cover</span>
            <span className="mt-1 text-sm text-subtext">PNG or JPG up to 5MB</span>
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPreview(url);
              }
            }} />
            {preview && <img src={preview} alt="preview" className="mt-4 h-24 w-24 rounded-2xl object-cover" />}
          </label>

          <div className="space-y-4">
            <input name="title" className="w-full rounded-2xl border border-border px-4 py-3" placeholder="Book Name" required />
            <input name="author" className="w-full rounded-2xl border border-border px-4 py-3" placeholder="Author" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="subject" className="w-full rounded-2xl border border-border px-4 py-3" placeholder="Subject" required />
              <input name="branch" className="w-full rounded-2xl border border-border px-4 py-3" placeholder="Branch" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="semester" className="w-full rounded-2xl border border-border px-4 py-3" placeholder="Semester" required />
              <select name="condition" className="w-full rounded-2xl border border-border px-4 py-3" defaultValue="Good">
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
            <textarea name="description" className="min-h-[100px] w-full rounded-2xl border border-border px-4 py-3" placeholder="Description" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="price" type="number" className="w-full rounded-2xl border border-border px-4 py-3" placeholder="Selling Price" required />
              <input name="location" className="w-full rounded-2xl border border-border px-4 py-3" placeholder="Location" required />
            </div>
            <label className="flex items-center gap-2 text-sm text-subtext"><input name="exchangeAvailable" type="checkbox" /> Exchange option available</label>
            <button type="submit" className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white"><Upload size={16} /> Submit Listing</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
