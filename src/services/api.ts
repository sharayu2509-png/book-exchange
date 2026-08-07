export const fetchBooks = async () => {
  const response = await fetch('http://localhost:5000/api/books');
  if (!response.ok) throw new Error('Failed to fetch books');
  return response.json();
};
