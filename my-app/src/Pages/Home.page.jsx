import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useUser } from "../Contexts/user.context";
import "../App.css";
import ProductForm from "../ProductForm/ProductForm";

const API_BASE = import.meta.env.VITE_SERVER_URL; // e.g. http://localhost:5001/products
const API_ORIGIN = window.location.origin; // http://localhost:3000 in dev, GitHub Pages in prod

export default function Home() {
  const { setUser } = useUser();

  const logOut = async () => {
    try {
      // Clear any stored auth (adjust to your app’s needs)
      localStorage.removeItem("token");
      setUser(null);
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };

  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const normalizeImages = (items) =>
    items.map((p) => {
      const raw = p?.image ?? "";
      const rel = raw.startsWith("/") ? raw.slice(1) : raw; // drop leading slash -> "images/foo.jpg"

      if (import.meta.env.DEV) {
        // dev: Vite serves from / (localhost:3000)
        return { ...p, image: `/${rel}` };
      }

      // prod: prefix with base (e.g., "/CJK_MongoDB_2/")
      const base = import.meta.env.BASE_URL || "/";
      return { ...p, image: `${base}${rel}` };
    });

  const fetchProducts = async () => {
    try {
      const url = API_BASE;
      console.log("fetchProducts: called with", url);

      const res = await fetch(url, { headers: { Accept: "application/json" } });
      console.log("fetchProducts: status", res.status);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Bad response ${res.status}: ${text.slice(0, 200)}`);
      }

      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      const normalized = normalizeImages(items);

      console.log(
        "products:",
        normalized.map((p) => p.image)
      );
      setProducts(normalized);
    } catch (err) {
      console.error("fetchProducts error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = (product) => {
    fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then(() => fetchProducts())
      .catch((err) => console.error("Error:", err));
  };

  const startEditing = (product) => setEditProduct(product);

  const updateProduct = (id, updatedProduct) => {
    fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => res.json())
      .then(() => {
        setEditProduct(null);
        fetchProducts();
      })
      .catch((err) => console.error("Error:", err));
  };

  const submitProduct = (product) => {
    if (editProduct) {
      updateProduct(editProduct._id, product);
    } else {
      addProduct(product);
    }
  };

  const deleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    fetch(`${API_BASE}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchProducts())
      .catch((err) => console.error("Error:", err));
  };

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "" || p.category === category)
    );
  });

  return (
    <>
      <div className="App">
        <div className="search-methods">
          <Button
            className="logout-button"
            variant="contained"
            onClick={logOut}
            sx={{
              border: "1px solid #47474782",
              borderRadius: "25px",
              display: "flex",
              justifyContent: "center",
              p: "0.5em 3em",
              color: "white",
              mt: "1vw",
              width: "4vw",
              textTransform: "none",
              maxWidth: "60px",
              maxHeight: "30px",
              fontWeight: "bold",
              boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.75)",
              ml: "10px",
            }}
          >
            Logout
          </Button>

          <input
            className="search-bar"
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="Hoodie">Hoodie</option>
            <option value="Sweater">Sweater</option>
            <option value="T-Shirt">T-Shirt</option>
            <option value="Mask">Mask</option>
            <option value="Awesome">Awesome</option>
            <option value="Jacket">Jacket</option>
            <option value="Hat">Hat</option>
          </select>
        </div>

        <div className="card-display">
          <ProductForm onFormSubmit={submitProduct} product={editProduct} />

          {filteredProducts.map((product) => (
            <div key={product._id} className="card">
              <h2>{product.name}</h2>
              <p>£{product.price}</p>
              <p>{product.category}</p>
              <img src={product.image} alt={product.name} />
              <button onClick={() => startEditing(product)}>Edit</button>
              <button onClick={() => deleteProduct(product._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
