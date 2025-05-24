import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'; // You might need this if you prefer the original

export default function Blog() {
  return (
    <>
      <section className="Blog-page">
        <h2>#readmore</h2>
        <p>Read all case studies about our products!</p>
      </section>
      <section id="blog">
        <div className="blog-box">
          <div className="blog-img">
            <img src="blog/b1 (1).jpg" alt="" />
          </div>
          <div className="blog-detail">
            <h4>The Cotton-Jersy Zip-Up Hoodie</h4>
            <p>
              Kickstarter man braid godard coloring book. Reclette waistcoat
              selfies yr wolf chartruse hexagon irony, godard
            </p>
            <a href="">CONTINUE READING</a>
          </div>
          <p className="blog-date">13/</p>
        </div>
        <div className="blog-box">
          <div className="blog-img">
            <img src="blog/b2 (1).jpg" alt="" />
          </div>
          <div className="blog-detail">
            <h4>The Cotton-Jersy Zip-Up Hoodie</h4>
            <p>
              Kickstarter man braid godard coloring book. Reclette waistcoat
              selfies yr wolf chartruse hexagon irony, godard
            </p>
            <a href="">CONTINUE READING</a>
          </div>
          <p className="blog-date">13/</p>
        </div>
        <div className="blog-box">
          <div className="blog-img">
            <img src="blog/b6.jpg" alt="" />
          </div>
          <div className="blog-detail">
            <h4>The Cotton-Jersy Zip-Up Hoodie</h4>
            <p>
              Kickstarter man braid godard coloring book. Reclette waistcoat
              selfies yr wolf chartruse hexagon irony, godard
            </p>
            <a href="">CONTINUE READING</a>
          </div>
          <p className="blog-date">13/</p>
        </div>
        <div className="blog-box">
          <div className="blog-img">
            <img src="blog/b5.jpg" alt="" />
          </div>
          <div className="blog-detail">
            <h4>The Cotton-Jersy Zip-Up Hoodie</h4>
            <p>
              Kickstarter man braid godard coloring book. Reclette waistcoat
              selfies yr wolf chartruse hexagon irony, godard
            </p>
            <a href="">CONTINUE READING</a>
          </div>
          <p className="blog-date">13/</p>
        </div>
        <div className="blog-box">
          <div className="blog-img">
            <img src="blog/b4 (1).jpg" alt="" />
          </div>
          <div className="blog-detail">
            <h4>The Cotton-Jersy Zip-Up Hoodie</h4>
            <p>
              Kickstarter man braid godard coloring book. Reclette waistcoat
              selfies yr wolf chartruse hexagon irony, godard
            </p>
            <a href="">CONTINUE READING</a>
          </div>
          <p className="blog-date">13/</p>
        </div>
      </section>

      <section className="pagination" id="section-p1">
        <a href="#">1</a>
        <a href="#">2</a>
        <a href="#">
          <FontAwesomeIcon icon={faAngleRight} />
        </a>
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