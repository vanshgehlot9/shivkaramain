"use client";
import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddArticlePage() {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",

    content: "",
    author: "",
    date: "",
    readTime: "",
    category: "",
    image: "",
    tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await addDoc(collection(db, "articles"), {
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim())
      });
      setSuccess(true);
      setForm({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        date: "",
        readTime: "",
        category: "",
        image: "",
        tags: ""
      });
    } catch (err: any) {
      setError(err.message || "Error adding article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Add New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border px-3 py-2 rounded" required />
        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border px-3 py-2 rounded h-20" required />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Full Article Content" className="w-full border px-3 py-2 rounded h-40" required />
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full border px-3 py-2 rounded" required />
        <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. Aug 17, 2025)" className="w-full border px-3 py-2 rounded" required />
        <input name="readTime" value={form.readTime} onChange={handleChange} placeholder="Read Time (e.g. 5 min read)" className="w-full border px-3 py-2 rounded" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full border px-3 py-2 rounded" required />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL or Path" className="w-full border px-3 py-2 rounded" required />
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border px-3 py-2 rounded" />
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 transition">
          {loading ? "Adding..." : "Add Article"}
        </button>
        {success && <div className="text-green-600 font-medium">Article added successfully!</div>}
        {error && <div className="text-red-600 font-medium">{error}</div>}
      </form>
    </div>
  );
}
