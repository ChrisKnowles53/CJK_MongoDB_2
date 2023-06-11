import { useState } from 'react';
import './ProductForm.css';

function ProductForm({ onSubmit }) {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const product = {
      name: productName,
      price: productPrice,
      category: productCategory,
      image: productImage,
    };

    onSubmit(product);  

    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductImage('');
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
        <input type="text" value={productName} onChange={e => setProductName(e.target.value)} />
      </label>
      <label>
        Price:
        <input type="number" value={productPrice} onChange={e => setProductPrice(e.target.value)} />
      </label>
      <label>
        Category:
        <input type="text" value={productCategory} onChange={e => setProductCategory(e.target.value)} />
      </label>
      <label>
        Image:
        <input type="file" onChange={handleImageUpload} />
      </label>
      <input type="submit" value="Add Product" />
    </form>
  );
}

export default ProductForm;
