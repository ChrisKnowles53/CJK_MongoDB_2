import React, { useEffect, useState } from "react";
import "./App.css";
import ProductForm from "./ProductForm/ProductForm";

function App() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

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

  return (
    <div className="App">
      <header className="App-header">
        <ProductForm onFormSubmit={submitProduct} product={editProduct} />
        {products.map((product) => (
          <div key={product._id} className="card">
            <h2>{product.name}</h2>
            <p>£{product.price}</p>
            <p>{product.category}</p>
            <img src={product.image} alt={product.name} />
            <button onClick={() => startEditing(product)}>Edit</button>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
