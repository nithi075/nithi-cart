

export default function About() {
  return (
    <>
      <section className="about-header" id="section-p1">
        <h2>#knowUs</h2>
        <p>More you know about us</p>
      </section>

      <section className="about-head" id="section-p1">
        <img src="about/a6.jpg" alt="" />
        <div>
          <h2>Who We Are?</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, ea! Qui debitis quos minima explicabo eum. Dignissimos maxime debitis expedita quasi nemo natus vel explicabo, quo quis placeat consequatur tempore non repellat. Aut hic id eveniet deleniti, dolorem nulla sunt velit, voluptate nobis animi error neque repellendus commodi minima quo!
          </p>
          <abbr title="">
            Create stunning images with as much or as little control as you like thanks to a choice of basics and Creative modes.
          </abbr>
          <br />
          <br />
          <div className="scrolling-text">
            Create stunning images with as much or as little control as you like thanks to a choice of basics and Creative modes.
          </div>
        </div>
      </section>

      <section className="about-app" id="section-p1">
        <h1>
          Download Our <a href="#">App</a>
        </h1>
        <div className="video">
          <video autoPlay muted loop src="about/about.mp4.mp4" />
        </div>
      </section>

      <section className="features" id="section-p1">
        <div className="fe-box">
          <img src="features/f1.png" alt="Free Shipping" />
          <h6>Free Shipping</h6>
        </div>
        <div className="fe-box">
          <img src="features/f2.png" alt="Online Order" />
          <h6>Online Order</h6>
        </div>
        <div className="fe-box">
          <img src="features/f3.png" alt="Save Money" />
          <h6>Save Money</h6>
        </div>
        <div className="fe-box">
          <img src="features/f4.png" alt="Promotions" />
          <h6>Promotions</h6>
        </div>
        <div className="fe-box">
          <img src="features/f5.png" alt="Happy Sell" />
          <h6>Happy Sell</h6>
        </div>
        <div className="fe-box">
          <img src="features/f6.png" alt="24/7 Support" />
          <h6>24/7 Support</h6>
        </div>
      </section>

      <section className="news" id="section-p1">
        <div className="newstext">
          <h4>Sign Up For Newsletters</h4>
          <p>
            Get E-mail updates about our latest shop and <span>special offers.</span>
          </p>
        </div>
        <div className="form">
          <input type="email" placeholder="Your email address" />
          <button className="butt">Sign up</button>
        </div>
      </section>
    </>
  );
}
