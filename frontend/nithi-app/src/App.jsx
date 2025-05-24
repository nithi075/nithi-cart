// App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

// Import all your components
import Header from './components/Header.jsx';
import Hero from './components/hero.jsx';
import Footer from './components/Footer.jsx';
import Shop from './components/Shop.jsx';
import Blog from './components/Blog.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Cart from './components/Cart.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import OrderSuccess from './components/OrderSuccess.jsx';


// Helper function to safely get the product ID string
// (Good to keep this centralized if multiple components use it)
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

function App() {
    // Initialize cart as an empty array
    const [cart, setCart] = useState([]);

    // Centralized function to add a product to the cart
    const addProductToCart = (productToAdd, quantity = 1) => {
        const productToAddId = getProductId(productToAdd);
        if (!productToAddId) {
            console.error("Attempted to add a product without a valid ID:", productToAdd);
            return;
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => {
                const itemProductId = getProductId(item.product);
                return itemProductId === productToAddId;
            });

            if (existingItem) {
                // If product already in cart, update its quantity
                return prevCart.map(item =>
                    getProductId(item.product) === productToAddId
                        ? { ...item, qty: item.qty + quantity }
                        : item
                );
            } else {
                // If new product, add it to cart
                return [...prevCart, { product: productToAdd, qty: quantity }];
            }
        });
    };

    // Calculate total items in cart for the header badge (sum of quantities)
    // If you specifically want the count of unique items (i.e., cart.length),
    // then use: const cartItemCount = cart.length;
    const cartItemCount = cart.reduce((totalQty, item) => totalQty + item.qty, 0);


    // Add console logs to observe App's state for debugging
    console.log("App.jsx State - Current Cart:", cart);
    console.log("App.jsx State - Cart Item Count (badge value - sum of quantities):", cartItemCount);

    return (
        <>
            {/* ToastContainer should be placed outside of <Routes> */}
             <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            /> {/* You can configure props here */}

            {/* Pass cartItemCount to Header for the badge */}
            <Header cartItemCount={cartItemCount} />

            <Routes>
                {/* <ToastContainer theme='dark'/> <-- REMOVED FROM HERE */}
                <Route path="/" element={<Hero />} />
                {/* Pass addProductToCart to Shop so it can pass it to ProductCard */}
                <Route
                    path="/shop"
                    element={<Shop addProductToCart={addProductToCart} />}
                />
                <Route path="/blog" element={<Blog />} />
                <Route path="/About" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                {/* Cart component needs cart and setCart for displaying and managing items */}
                <Route
                    path="/cart"
                    element={<Cart cart={cart} setCart={setCart} />}
                />
                <Route path="/search" element={<Shop />} /> {/* Search likely uses Shop */}
                {/* ProductDetail needs cart and setCart so its internal 'addToCart' can update the main state */}
                <Route
                    path="/product/:id"
                    element={<ProductDetail cart={cart} setCart={setCart} />}
                />
                  <Route path="/order-success" element={<OrderSuccess />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;