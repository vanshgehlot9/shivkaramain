"use client";
import { useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddArticlePage() {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
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
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Cloudinary upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "IRC298XfqzA3sj4QURybIE9McFc"); // Your actual upload preset
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/daxln79ky/image/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setForm(f => ({ ...f, image: data.secure_url }));
      setImagePreview(data.secure_url);
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!form.image) {
      setError("Please upload an article image before submitting.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "articles"), {
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim())
      });
      setSuccess(true);
      setForm({
        title: "",
        excerpt: "",
        author: "",
        date: "",
        readTime: "",
        category: "",
        image: "",
        tags: ""
      });
      setImagePreview("");
    } catch (err: any) {
      setError(err.message || "Error adding article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">Add New Article</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input-theme" required />
            <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="input-theme" required />
            <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. Aug 17, 2025)" className="input-theme" required />
            <input name="readTime" value={form.readTime} onChange={handleChange} placeholder="Read Time (e.g. 5 min read)" className="input-theme" required />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input-theme" required />
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="input-theme" />
          </div>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="input-theme" required />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-700">Article Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="input-theme" />
              {uploading && <div className="text-indigo-600 mt-2">Uploading...</div>}
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-4 rounded-xl shadow-md w-full max-h-56 object-cover border" />
              )}
            </div>
          </div>
          <button type="submit" disabled={loading || uploading || !form.image} className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300">
            {loading ? "Adding..." : (!form.image ? "Upload Image First" : "Add Article")}
          </button>
          {success && <div className="text-green-600 font-medium text-center">Article added successfully!</div>}
          {error && <div className="text-red-600 font-medium text-center">{error}</div>}
        </form>
      </div>
      <style jsx>{`
        .input-theme {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(59,130,246,0.04);
        }
        .input-theme:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px #6366f1, 0 2px 8px rgba(59,130,246,0.08);
          outline: none;
        }
      `}</style>
    </div>
  );
}
