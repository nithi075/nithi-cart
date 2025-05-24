export default function News() {
  return (
    <section className="news " id="section-p1">
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
  );
}