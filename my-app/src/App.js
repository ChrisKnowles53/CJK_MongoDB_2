import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./Contexts/user.context";
import Home from "./Pages/Home.page";
import Login from "./Pages/Login.Page";
import PrivateRoute from "./Pages/PrivateRoute.page";
import Signup from "./Pages/Signup.page";

function App() {
  return (
    <BrowserRouter>
      {/* We are wrapping our whole app with UserProvider so that */}
      {/* our user is accessible through out the app from any page*/}
      <UserProvider>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          {/* We are protecting our Home Page from unauthenticated */}
          {/* users by wrapping it with PrivateRoute here. */}
          <Route element={<PrivateRoute />}>
            <Route exact path="/" element={<Home />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

// This is how it used to be before i added the user context and login page.

// import React, { useEffect, useState } from "react";
// import "./App.css";
// import ProductForm from "./ProductForm/ProductForm";

// function App() {
//   const [products, setProducts] = useState([]);
//   const [editProduct, setEditProduct] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("");

//   // This is the fetchProducts function. This is used to fetch the current list of products from your server
//   const fetchProducts = () => {
//     fetch("http://localhost:5000/products")
//       .then((response) => response.json())
//       .then((data) => setProducts(data))
//       .catch((error) => console.error("Error:", error));
//   };

//   // Call fetchProducts function once when the component mounts
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const addProduct = (product) => {
//     // The fetch function is used to send a request to a server. It returns a Promise that resolves to the Response to that request, whether it is successful or not.
//     // The first argument to fetch is the URL to which the request is being sent. In this case, the request is being sent to 'http://localhost:5000/products'.
//     fetch("http://localhost:5000/products", {
//       // The method property of the options object being passed to fetch is set to 'POST'. This indicates that a POST request is being sent.
//       method: "POST",

//       // The headers property of the options object is used to specify HTTP headers that will be included with the request. In this case, a Content-Type header is being set.
//       headers: {
//         // The Content-Type header is set to 'application/json', indicating that the body of the request will contain JSON data.
//         "Content-Type": "application/json",
//       },

//       // The body property of the options object is used to specify the body of the request. In this case, the 'product' parameter of the function is being stringified into JSON and used as the body.
//       body: JSON.stringify(product),
//     })
//       // Another callback is registered with then. This callback will be passed the result of the previous callback (i.e., the parsed JSON from the response).
//       // It simply logs the data to the console and then calls the 'fetchProducts' function (not defined in the provided code).
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         fetchProducts();
//       })

//       // The catch method is used to register a callback that will be executed if the Promise is rejected.
//       // This callback simply logs an error message to the console.
//       .catch((error) => console.error("Error:", error));
//   };

//   const startEditing = (product) => {
//     setEditProduct(product);
//   };

//   const updateProduct = (id, updatedProduct) => {
//     console.log(id);
//     fetch(`http://localhost:5000/products/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedProduct),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setEditProduct(null);
//         fetchProducts();
//         console.log("Product updated", data);
//       })
//       .catch((error) => console.error("Error:", error));
//   };

//   const submitProduct = (product) => {
//     if (editProduct) {
//       updateProduct(editProduct._id, product);
//     } else {
//       addProduct(product);
//     }
//   };

//   const deleteProduct = (id) => {
//     console.log(id);
//     fetch(`http://localhost:5000/products/${id}`, {
//       method: "DELETE",
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Product deleted", data);
//         fetchProducts(); // refresh the list of products
//       })
//       .catch((error) => console.error("Error:", error));
//   };

//   const filteredProducts = products.filter((product) => {
//     return (
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (category === "" || product.category === category)
//     );
//   });

//   return (
//     <div className="App">
//       <div className="search-methods">
//         <input
//           type="text"
//           placeholder="Search products"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select value={category} onChange={(e) => setCategory(e.target.value)}>
//           <option value="">All categories</option>
//           <option value="Hoodie">Hoodie</option>
//           <option value="Sweater">Sweater</option>
//           <option value="T-Shirt">T-Shirt</option>
//           <option value="Mask">Mask</option>
//           <option value="Awesome">Awesome</option>
//           <option value="Jacket">Jacket</option>
//           <option value="Hat">Hat</option>
//           {/* Add more options for each category you have */}
//         </select>
//       </div>
//       <div className="card-display">
//         <ProductForm onFormSubmit={submitProduct} product={editProduct} />
//         {filteredProducts.map((product) => (
//           <div key={product._id} className="card">
//             <h2>{product.name}</h2>
//             <p>£{product.price}</p>
//             <p>{product.category}</p>
//             <img src={product.image} alt={product.name} />
//             <button onClick={() => startEditing(product)}>Edit</button>
//             <button
//               onClick={() => {
//                 if (
//                   window.confirm(
//                     "Are you sure you want to delete this product?"
//                   )
//                 ) {
//                   deleteProduct(product._id);
//                 }
//               }}
//             >
//               Delete
//             </button>
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// }

// export default App;
