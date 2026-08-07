import { motion } from 'framer-motion';
import { ImagePlus, Upload, WandSparkles } from 'lucide-react';
import { useState, type DragEvent, type FormEvent, type InputHTMLAttributes } from 'react';
import type { Book } from '../types';
import { LoadingButton } from '../components/ui/LoadingButton';
import { useToast } from '../contexts/ToastContext';

interface SellBookPageProps {
  onSubmit: (book: Book) => Promise<void>;
}

export const SellBookPage = ({ onSubmit }: SellBookPageProps) => {
  const [preview, setPreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleImage = (file?: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      image:
        preview ||
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
      description: String(formData.get('description') || 'Great academic resource'),
      category: String(formData.get('branch') || 'Engineering'),
    };

    setIsSubmitting(true);
    try {
      await onSubmit(newBook);
      showToast({
        title: 'Book Uploaded',
        description: `${newBook.title} has been added to your listings.`,
        variant: 'success',
      });
      event.currentTarget.reset();
      setPreview('');
    } catch (error) {
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unable to upload book',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleImage(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-border bg-white p-4 shadow-soft sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Sell your book</p>
            <h1 className="mt-1 text-3xl font-semibold text-text">List a new book</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-subtext">
              Fill out the details below and add a cover image to publish a clean, student-friendly listing.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <WandSparkles size={20} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed p-6 text-center transition ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border bg-bg'
            }`}
          >
            <div className="rounded-full bg-white p-4 text-primary shadow-sm">
              <ImagePlus size={28} />
            </div>
            <span className="mt-4 text-lg font-semibold text-text">Upload book cover</span>
            <span className="mt-2 text-sm leading-6 text-subtext">
              Drag and drop an image here, or click to select a PNG or JPG file.
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => handleImage(event.target.files?.[0])}
            />
            {preview ? (
              <img
                src={preview}
                alt="Book cover preview"
                className="mt-5 h-40 w-40 rounded-3xl object-cover shadow-lg"
              />
            ) : null}
          </label>

          <div className="space-y-4">
            <FormField name="title" placeholder="Book Name" required />
            <FormField name="author" placeholder="Author" required />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField name="subject" placeholder="Subject" required />
              <FormField name="branch" placeholder="Branch" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField name="semester" placeholder="Semester" required />
              <select
                name="condition"
                defaultValue="Good"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <textarea
              name="description"
              className="min-h-[120px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
              placeholder="Description"
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField name="price" type="number" placeholder="Selling Price" required />
              <FormField name="location" placeholder="Location" required />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-subtext">
              <input name="exchangeAvailable" type="checkbox" className="h-4 w-4 rounded border-border text-primary" />
              Exchange option available
            </label>

            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              className="w-full bg-primary px-4 py-3 font-semibold text-white hover:shadow-lg sm:w-auto"
            >
              <Upload size={16} />
              Submit Listing
            </LoadingButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

function FormField({ className, ...props }: FormFieldProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary ${className ?? ''}`}
    />
  );
}
