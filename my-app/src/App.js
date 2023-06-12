import React, { useEffect, useState } from "react";
import "./App.css";
import ProductForm from "./ProductForm/ProductForm";

function App() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  // This is the fetchProducts function. This is used to fetch the current list of products from your server
  const fetchProducts = () => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error:", error));
  };

  // Call fetchProducts function once when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = (product) => {
    fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchProducts();
      })
      .catch((error) => console.error("Error:", error));
  };

  const startEditing = (product) => {
    setEditProduct(product);
  };

  const updateProduct = (id, updatedProduct) => {
    console.log(id);
    fetch(`http://localhost:5000/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        setEditProduct(null);
        fetchProducts();
        console.log("Product updated", data);
      })
      .catch((error) => console.error("Error:", error));
  };

  const submitProduct = (product) => {
    if (editProduct) {
      updateProduct(editProduct._id, product);
    } else {
      addProduct(product);
    }
  };

  const deleteProduct = (id) => {
    console.log(id);
    fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product deleted", data);
        fetchProducts(); // refresh the list of products
      })
      .catch((error) => console.error("Error:", error));
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "" || product.category === category)
    );
  });

  return (
    <div className="App">
      <div className="search-methods">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Sweater">Sweater</option>
          <option value="T-Shirt">T-Shirt</option>
          <option value="Mask">Mask</option>
          <option value="Awesome">Awesome</option>
          <option value="Jacket">Jacket</option>
          <option value="Hat">Hat</option>
          {/* Add more options for each category you have */}
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
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this product?"
                  )
                ) {
                  deleteProduct(product._id);
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
