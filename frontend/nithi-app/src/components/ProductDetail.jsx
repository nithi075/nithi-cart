// ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import News from './News';

const getProductId = (productData) => {
    if (!productData || !productData._id) {
        return null;
    }
    if (typeof productData._id === 'object' && productData._id.$oid) {
        return productData._id.$oid;
    }
    if (typeof productData._id === 'string') {
        return productData._id;
    }
    return null;
};

export default function ProductDetail({ cart, setCart }) {
    const { id } = useParams();
    const [qty, setQty] = useState(1);
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [mainImg, setMainImg] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingAll, setLoadingAll] = useState(true);
    const [errorAll, setErrorAll] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [currentSizeStock, setCurrentSizeStock] = useState(0);

    // Add a state to force re-fetch when needed, e.g., after an order
    const [refreshProductData, setRefreshProductData] = useState(0); // Increment this to force re-fetch

    function addToCart() {
        if (!product) {
            console.warn("addToCart: No product data to add to cart. Product is null.");
            toast.error("Product data not loaded. Please try again.");
            return;
        }
        if (qty < 1) {
            console.warn("addToCart: Quantity must be at least 1.");
            toast.warn("Quantity must be at least 1.");
            return;
        }
        if (!selectedSize) {
            toast.warn("Please select a size.");
            return;
        }

        const selectedSizeObject = product.sizes.find(s => s.size === selectedSize);

        if (!selectedSizeObject || selectedSizeObject.stock === 0) {
            toast.error(`The selected size (${selectedSize}) is currently out of stock.`);
            return;
        }

        if (qty > selectedSizeObject.stock) {
            toast.warn(`Cannot add ${qty} of size ${selectedSize}. Only ${selectedSizeObject.stock} available.`);
            setQty(selectedSizeObject.stock);
            return;
        }

        const currentProductId = getProductId(product);
        if (!currentProductId) {
            console.error("addToCart: Could not determine valid product ID for current product:", product);
            toast.error("Could not add to cart due to product ID error.");
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find(item => {
                const itemProductId = getProductId(item.product);
                return itemProductId === currentProductId && item.size === selectedSize;
            });

            if (existingItem) {
                if (existingItem.qty + qty > selectedSizeObject.stock) {
                    toast.warn(`Adding ${qty} more would exceed stock for size ${selectedSize}. You already have ${existingItem.qty} in cart. Max available: ${selectedSizeObject.stock}`);
                    return prevCart;
                }
                const updatedCart = prevCart.map(item =>
                    (getProductId(item.product) === currentProductId && item.size === selectedSize)
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
                toast.success(`Updated quantity for ${product.name} (Size: ${selectedSize}) in cart!`);
                return updatedCart;
            } else {
                const newCart = [...prevCart, { product, qty, size: selectedSize }];
                toast.success(`${product.name} (Size: ${selectedSize}, Qty: ${qty}) added to cart!`);
                return newCart;
            }
        });
    }

    useEffect(() => {
        const fetchProductDetails = async (productId) => {
            console.log(`ProductDetail: Fetching product details for ID: ${productId}`); // LOG
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8000/api/v1/product/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success && data.product) {
                    setProduct(data.product);
                    setMainImg(data.product.images && data.product.images.length > 0 ? `/${data.product.images[0].url}` : '/products/f1.jpg');
                    console.log("ProductDetail: Successfully fetched product:", data.product); // LOG

                    if (data.product.sizes && data.product.sizes.length > 0) {
                        const firstAvailableSize = data.product.sizes.find(s => s.stock > 0);
                        if (firstAvailableSize) {
                            setSelectedSize(firstAvailableSize.size);
                            setCurrentSizeStock(firstAvailableSize.stock);
                            console.log(`ProductDetail: Initial selected size: ${firstAvailableSize.size}, stock: ${firstAvailableSize.stock}`); // LOG
                        } else {
                            setSelectedSize('');
                            setCurrentSizeStock(0);
                            console.log("ProductDetail: All sizes are out of stock for this product."); // LOG
                        }
                    } else {
                        setSelectedSize('');
                        setCurrentSizeStock(0);
                        console.log("ProductDetail: No size information for this product."); // LOG
                    }
                    setQty(1);
                } else {
                    setError('Product not found');
                    setProduct(null);
                    setSelectedSize('');
                    setCurrentSizeStock(0);
                    console.error("ProductDetail: Product not found:", data.message); // LOG
                }
            } catch (err) {
                setError('Failed to fetch product details');
                console.error('ProductDetail: Error fetching product details:', err); // LOG
                setProduct(null);
                setSelectedSize('');
                setCurrentSizeStock(0);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails(id);
        }
    }, [id, refreshProductData]); // Add refreshProductData as a dependency

    useEffect(() => {
        if (product && selectedSize) {
            const sizeObj = product.sizes.find(s => s.size === selectedSize);
            const newStock = sizeObj ? sizeObj.stock : 0;
            setCurrentSizeStock(newStock);
            console.log(`ProductDetail: Selected size changed to ${selectedSize}, updated stock to ${newStock}`); // LOG

            // Adjust quantity based on new stock
            setQty(prevQty => {
                if (newStock === 0) return 0;
                if (prevQty === 0) return 1; // If previously 0, set to 1 if stock is available
                return Math.min(prevQty, newStock); // Don't exceed new stock
            });
        } else {
            setCurrentSizeStock(0);
            setQty(0);
        }
    }, [selectedSize, product]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            console.log("ProductDetail: Fetching all products for 'You might also like'."); // LOG
            setLoadingAll(true);
            setErrorAll(null);
            try {
                const response = await fetch('http://localhost:8000/api/v1/products');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success && data.products) {
                    setAllProducts(data.products);
                    console.log("ProductDetail: Successfully fetched all products."); // LOG
                }
            } catch (err) {
                setErrorAll('Failed to load all products');
                console.error('ProductDetail: Error fetching all products:', err); // LOG
            } finally {
                setLoadingAll(false);
            }
        };

        fetchAllProducts();
    }, []);

    const handleSmallImgClick = (newSrc) => {
        setMainImg(newSrc);
    };

    if (loading) {
        return <div>Loading product details...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!product) {
        return <div>Product not found.</div>;
    }

    const smallImages = product.images ? product.images.map(img => img.url).filter(Boolean) : [];
    const currentProductIdForFilter = getProductId(product);
    const otherProducts = allProducts.filter(p => getProductId(p) !== currentProductIdForFilter);
    const getRandomSubset = (arr, count) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    const featuredProductsToDisplay = getRandomSubset(otherProducts, 4);

    return (
        <div className="product-detail-page">
            <section className="pro-detail" id="section-p1">
                <div className="single-pro-image">
                    <div className="image-wrapper">
                        <img src={mainImg} alt={product.name} id="MainImg"
                        width="100%" />
                    </div>
                    
                </div>

                <div className="single-pro-details">
                    <h6>Home / {product.category || 'T-Shirt'}</h6>
                    <h4>{product.name}</h4>
                    <h2>${product.price}</h2>
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        disabled={!product.sizes || product.sizes.length === 0}
                    >
                        {(!selectedSize || !product.sizes || product.sizes.length === 0) && (
                            <option value="">Select Size</option>
                        )}
                        {product.sizes && product.sizes.map((sizeOption) => (
                            <option
                                key={sizeOption.size}
                                value={sizeOption.size}
                                disabled={sizeOption.stock === 0}
                            >
                                {sizeOption.size} {sizeOption.stock === 0 ? '(Out of Stock)' : `(${sizeOption.stock} in stock)`}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        min="1"
                        max={currentSizeStock}
                        disabled={currentSizeStock === 0 || !selectedSize || qty === 0}
                    />
                    <button className="normal" onClick={addToCart}
                        disabled={currentSizeStock === 0 || !selectedSize || qty === 0}>Add to Cart</button>
                    <h4>Product Details</h4>
                    <span>{product.description}</span>
                </div>
            </section>

            {loadingAll && <div>Loading related products...</div>}
            {errorAll && <div>Error loading related products: {errorAll}</div>}

            {!loadingAll && !errorAll && featuredProductsToDisplay.length > 0 && (
                <section className="related-products" id="section-p1">
                    <h2>You might also like</h2>
                    <div className="pro-container">
                        {featuredProductsToDisplay.map(relatedProduct => (
                            <Link to={`/product/${getProductId(relatedProduct)}`} key={getProductId(relatedProduct)} className="pro-link-wrapper">
                                <div className="pro">
                                    <div className="image-wrapper">
                                        <img src={relatedProduct.images && relatedProduct.images.length > 0 ? `/${relatedProduct.images[0].url}` : 'img/products/f1.jpg'} alt={relatedProduct.name} />
                                    </div>
                                    <div className="des">
                                        <span>{relatedProduct.brand || 'Brand'}</span>
                                        <h5>{relatedProduct.name}</h5>
                                        <div className="star">
                                            {Array.from({ length: Number(relatedProduct.rating) || 0 }).map((_, index) => (
                                                <FontAwesomeIcon icon={faStar} key={index} />
                                            ))}
                                        </div>
                                        <h4>${(parseFloat(relatedProduct.price) || 0).toFixed(2)}</h4>
                                    </div>
                                    <FontAwesomeIcon icon={faShoppingCart} className="cart" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
            <News/>
        </div>
    );
}
