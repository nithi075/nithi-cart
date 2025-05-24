import React from 'react';

export default function Footer() {
  return (
    <>
      <footer id="section-p1">
        <div className="col">
          <img src="logo.png" className="logo" alt="Logo" />
          <h4>Contact</h4>
          <p><strong>Address:</strong> 562 Wellington Road Street 32, San Francisco</p>
          <p><strong>Phone:</strong> +01 2222 365 / (+91) 01 2345 6789</p>
          <p><strong>Hours:</strong> 10.00-18.00 Mon-Sat</p>
          <div className="follow">
            <h4>Follow Us</h4>
            <div className="icon">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-pinterest-p"></i>
              <i className="fab fa-youtube"></i>
            </div>
          </div>
        </div>

        <div className="col">
          <h4>About</h4>
          <a href="#">About Us</a>
          <a href="#">Delivery Information</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Condition</a>
          <a href="#">Contact Us</a>
        </div>

        <div className="col">
          <h4>My Account</h4>
          <a href="#">Sign In</a>
          <a href="#">View Cart</a>
          <a href="#">My Wishlist</a>
          <a href="#">Track My Order</a>
          <a href="#">Help</a>
        </div>

        <div className="col install">
          <h4>Install App</h4>
          <p>From App Store Google Play</p>
          <div className="row">
            <img src="footer/app.jpg" alt="App Store" />
            <img src="footer/play.jpg" alt="Google Play" />
          </div>
          <p>Secured Payment Gateways</p>
          <img src="footer/pay.png" alt="Payment Methods" />
        </div>

        <div className="copyright">
          <p>&copy; {new Date().getFullYear()}, Tech2 etc - HTML CSS Ecommerce Template</p>
        </div>
      </footer>
    </>
  );
}