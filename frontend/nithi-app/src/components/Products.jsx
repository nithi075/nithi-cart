export default function Products() {
  return (
    <section className="products section-p1">
      <h1>AVAILABLE PRODUCTS</h1>
     
      <div className="pro-container">
        <div className="pro">
          <img src="item/1.jpg" alt="Product 2" />
          <div className="des">
            <h2>SHIRTS</h2>
          </div>
        </div>
        <div className="pro">
          <img src="item/2.jpg" alt="Product 3" />
          <div className="des">
            <h2>T-SHIRTS</h2>
          </div>
        </div>
        <div className="pro">
          <img src="item/3.jpg" alt="Product 4" />
          <div className="des">
           <h2>SHORTS</h2>
          </div>
        </div>
        <div className="pro">
          <img src="item/4.jpg" alt="Product 5" />
          <div className="des">
            <h2>PANTS</h2>
          </div>
        </div>
        
      </div>
    </section>
  );
}