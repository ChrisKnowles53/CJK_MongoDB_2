import { Button } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../Contexts/user.context";
import React, { useEffect, useState } from "react";
import "../App.css";
import ProductForm from "../ProductForm/ProductForm";

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Home() {
  const { logOutUser } = useContext(UserContext);

  // This function is called when the user clicks the "Logout" button.
  const logOut = async () => {
    try {
      // Calling the logOutUser function from the user context.
      const loggedOut = await logOutUser();
      // Now we will refresh the page, and the user will be logged out and
      // redirected to the login page because of the <PrivateRoute /> component.
      if (loggedOut) {
        window.location.reload(true);
      }
    } catch (error) {
      alert(error);
    }
  };

  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  // This is the fetchProducts function. This is used to fetch the current list of products from your server
  const fetchProducts = () => {
    fetch(`${REACT_APP_SERVER_URL}`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error:", error));
  };

  // Call fetchProducts function once when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = (product) => {
    // The fetch function is used to send a request to a server. It returns a Promise that resolves to the Response to that request, whether it is successful or not.
    // The first argument to fetch is the URL to which the request is being sent. In this case, the request is being sent to 'http://localhost:5000/products'.
    fetch(`${REACT_APP_SERVER_URL}`, {
      // The method property of the options object being passed to fetch is set to 'POST'. This indicates that a POST request is being sent.
      method: "POST",

      // The headers property of the options object is used to specify HTTP headers that will be included with the request. In this case, a Content-Type header is being set.
      headers: {
        // The Content-Type header is set to 'application/json', indicating that the body of the request will contain JSON data.
        "Content-Type": "application/json",
      },

      // The body property of the options object is used to specify the body of the request. In this case, the 'product' parameter of the function is being stringified into JSON and used as the body.
      body: JSON.stringify(product),
    })
      // Another callback is registered with then. This callback will be passed the result of the previous callback (i.e., the parsed JSON from the response).
      // It simply logs the data to the console and then calls the 'fetchProducts' function (not defined in the provided code).
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchProducts();
      })

      // The catch method is used to register a callback that will be executed if the Promise is rejected.
      // This callback simply logs an error message to the console.
      .catch((error) => console.error("Error:", error));
  };

  const startEditing = (product) => {
    setEditProduct(product);
  };

  const updateProduct = (id, updatedProduct) => {
    console.log(id);
    fetch(`${REACT_APP_SERVER_URL}/${id}`, {
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
    fetch(`${REACT_APP_SERVER_URL}/${id}`, {
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
    <>
      <div className="App">
        <div className="search-methods">
          <Button
            className="logout-button"
            variant="contained"
            onClick={logOut}
            sx={{
              // backgroundColor: '#5aaaa6',
              border: "1px solid #47474782",
              borderRadius: "25px",
              display: "flex",
              justifyContent: "center",
              padding: "0.5em 3em 0.5em 3em",
              color: "white",
              marginTop: "1vw",
              width: "4vw",
              textTransform: "capitalize",
              // textTransformFont: 'josefin sans',
              textTransformWeight: "bold",
              textTransformSize: "15px",
              maxWidth: "60px",
              maxHeight: "30px",
              fontWeight: "bold",
              boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.75)",
              marginLeft: "10px",
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
    </>
  );
}

