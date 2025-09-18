import { useState } from "react";
import { useCategories } from "../context/CategoriesContext";

export default function SellProduct() {
  const { categories, addCategory } = useCategories();
  const [form, setForm] = useState({
    name: "",
    desc: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [customCategory, setCustomCategory] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value === "create") {
      setIsCreating(true);
      setForm({ ...form, category: "" });
    } else {
      setIsCreating(false);
      setForm({ ...form, category: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalCategory = form.category;

    if (isCreating && customCategory) {
      finalCategory = customCategory;
      addCategory(customCategory);
    }

    alert(`✅ Product Added in "${finalCategory}"`);

    // reset
    setForm({ name: "", desc: "", price: "", category: "" });
    setImage(null);
    setCustomCategory("");
    setIsCreating(false);
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Sell Your Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />
        <textarea
          name="desc"
          placeholder="Product Description"
          value={form.desc}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />

        {/* Category Dropdown + Create New */}
        {!isCreating ? (
          <select
            name="category"
            className="p-3 border rounded-lg"
            value={form.category}
            onChange={handleCategorySelect}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
            <option value="create">➕ Create New Category</option>
          </select>
        ) : (
          <input
            type="text"
            placeholder="Enter New Category"
            className="p-3 border rounded-lg"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
          />
        )}

        <input
          type="file"
          className="p-2 border rounded-lg"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="bg-[var(--artisan-dark)] text-white py-3 rounded-lg hover:bg-[var(--artisan-brown)] transition"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
}
