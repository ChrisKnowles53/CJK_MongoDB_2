import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Use React's useState hook to create a state variable 'products' and a function to update it 'setProducts'.
  // Initialize 'products' state as an empty array.
  const [products, setProducts] = useState([]);

  // Use React's useEffect hook to perform side effects in your function components.
  // Here it's used to fetch data from your API when the component mounts.
  // The empty array [] at the end means this effect runs once when the component mounts, and not on subsequent updates.
  useEffect(() => {
    // Fetch data from the /products endpoint on your server
    fetch("http://localhost:5000/products")
      // When the response is received, parse it as JSON
      .then((response) => response.json())
      // After parsing the response, call setProducts with the received data to update your state
      .then((data) => setProducts(data))
      // If an error occurs during any of the above steps, log it to the console
      .catch((error) => console.error("Error:", error));
  }, []); // The empty array means this effect will only run once when the component mounts

  function addProduct() {
    const product = {
      name: "New Product",
      price: 100,
      category: "New Category",
      image: "https://picsum.photos/200",
      // Add other fields here
    };

    fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={addProduct}>Add Product</button>
        {products.map((product) => (
          <div key={product._id} className="card">
            <h2>{product.name}</h2>
            <p>£{product.price}</p>
            <p>{product.category}</p>
            <img src={product.image} alt={product.name} />
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
