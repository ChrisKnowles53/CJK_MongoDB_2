import { useState, useEffect } from "react";
import "./ProductForm.css";

function ProductForm({ onFormSubmit, product }) {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImage, setProductImage] = useState("");

  // Update form fields when currentProduct changes
  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProductPrice(product.price);
      setProductCategory(product.category);
      setProductImage(product.image);
    }
  }, [product]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const product = {
      name: productName,
      price: productPrice,
      category: productCategory,
      image: productImage,
    };

    onFormSubmit(product);

    setProductName("");
    setProductPrice("");
    setProductCategory("");
    setProductImage("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProductImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        />
      </label>
      <label>
        Image:
        <input type="file" onChange={handleImageUpload} />
      </label>
      <input type="submit" value={product ? "Update Product" : "Add Product"} />
    </form>
  );
}

export default ProductForm;
