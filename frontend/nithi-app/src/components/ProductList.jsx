import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) { // Renamed to ProductCard and receives a single 'product'
  const navigate = useNavigate();

  const handleProductClick = () => {
    
    navigate(`/product/${product._id}`);

  };

  return (
    <div className="pro" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
    {product.images && product.images.length > 0 && product.images[0].url ? (
        <img src={product.images[0].url} alt={product.name} />
      ) : (
        <img src="path/to/default-image.jpg" alt="Default Product" />
        // Or you could render nothing or a placeholder if no image is available
      )}      <div className="des">
        <span>adidas</span> {/* Consider making this dynamic if available */}
        <h5>{product.name}</h5>
        <div className="star">
          <FontAwesomeIcon icon={faCertificate} />
          <FontAwesomeIcon icon={faCertificate} />
          <FontAwesomeIcon icon={faCertificate} />
          <FontAwesomeIcon icon={faCertificate} />
          <FontAwesomeIcon icon={faCertificate} />
        </div>
        <h4>${product.price}</h4>
      </div>
      <a href="#">
        <FontAwesomeIcon icon={faBriefcase} className="cart" />
      </a>

    </div>
    
  );
}