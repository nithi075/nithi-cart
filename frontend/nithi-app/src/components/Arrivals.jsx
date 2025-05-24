import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { useNavigate } from 'react-router-dom';

config.autoAddCss = false;

export default function Arrivals() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/api/v1/products'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.products) {
          // Assuming your API returns products with importDate
          const productsWithExtras = data.products.map(p => ({
            ...p,
            importDate: p.importDate || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Use existing or generate a fallback date
            rating: p.rating !== undefined ? p.rating : Math.floor(Math.random() * 5), // Use existing or generate a fallback rating
          }));
          setProducts(productsWithExtras);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sort products by importDate in descending order (newest first)
  const newArrivals = [...products].sort((a, b) => new Date(b.importDate) - new Date(a.importDate));

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <div>Loading new arrivals...</div>;
  }

  if (error) {
    return <div>Error loading new arrivals: {error}</div>;
  }

  return (
    <section className="products" id="section-p1">
      <h2>New Arrivals</h2>
      <p>Summer Collection New Modern Design</p>
      <div className="pro-container">
        {newArrivals.map((product) => (
          <div
            className="pro"
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={`/${product.images?.[0]?.url || 'products/placeholder.jpg'}`} alt={product.name} />
            <div className="des">
              <span>adidas</span>
              <h5>{product.name}</h5>
              <div className="star">
                {Array.from({ length: product.rating || 0 }).map((_, index) => (
                  <FontAwesomeIcon icon={faStar} key={index} />
                ))}
              </div>
              <h4>${product.price}</h4>
            </div>
            <a href={`/product/${product._id}`} className="cart-icon">
              <FontAwesomeIcon icon={faShoppingCart} className="cart" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}