import React, { useEffect, useState } from "react";
import Header from "./Header"; // Assuming Header is in the same directory or adjust path
import ProductCard from "../components/ProductList"; // Adjusted path based on your ProductCard.jsx location
import { useSearchParams, Link } from "react-router-dom"; // Import Link for "browse entire collection"

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null);   // Add error state
    const [searchParams] = useSearchParams(); // Destructure searchParams directly

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); // Start loading
            setError(null);   // Clear any previous errors

            try {
                // The URLSearchParams object directly converts to a query string when concatenated
                // e.g., if searchParams has { keyword: "shirt" }, this becomes "?keyword=shirt"
                const url = `http://localhost:8000/api/v1/products?${searchParams.toString()}`;
                
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok && data.success) {
                    setProducts(data.products);
                } else {
                    // Set error message if API call fails or returns success: false
                    setError(data.message || 'Failed to fetch products.');
                    setProducts([]); // Clear products on error
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError('Network error: Could not connect to the server.');
                setProducts([]); // Clear products on network error
            } finally {
                setLoading(false); // End loading regardless of success or failure
            }
        };

        fetchProducts();
    }, [searchParams]); // Depend on searchParams to re-fetch when query changes

    // --- Conditional Rendering Logic ---
    if (loading) {
        return (
            <section id="shop-products" className="section-p1">
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#333' }}>Loading products...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="shop-products" className="section-p1">
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'red' }}>Error: {error}</p>
                </div>
            </section>
        );
    }

    // THIS IS THE CORE CHANGE: Check if products array is empty after loading
    if (products.length === 0) {
        const keyword = searchParams.get('keyword'); // Get the keyword from searchParams
        return (
            <>
                <section id="page-header"> {/* Keep your header section */}
                    <h2>#stayhome</h2>
                    <p>Save more with coupons & up to 70% off!</p>
                </section>
                <section className="products" id="section-p1">
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#333' }}>
                            No products found
                            {keyword && ( // Display keyword only if it exists
                                <> for "<span style={{ color: '#088178' }}>{keyword}</span>"</>
                            )}
                            .
                        </p>
                        <p style={{ fontSize: '1em', color: '#666', marginTop: '10px' }}>
                            Please try a different search term or browse our <Link to="/shop" style={{ color: '#088178', textDecoration: 'underline' }}>entire collection</Link>.
                        </p>
                    </div>
                </section>
                <hr />
            </>
        );
    }

    // If products are found, render them
    return (
        <>
            <section id="page-header">
                <h2>#stayhome</h2>
                <p>Save more with coupons & up to 70% off!</p>
            </section>
            <section className="products" id="section-p1">
                <div className="pro-container">
                    {products.map(product => (
                        // Ensure product._id and product.images[0].url are correctly accessed
                        // The database output shows product._id as { "$oid": "..." }
                        <ProductCard key={product._id.$oid} product={product} />
                    ))}
                </div>
            </section>
            <hr />
        </>
    );
}