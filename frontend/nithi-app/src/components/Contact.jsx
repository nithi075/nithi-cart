import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faEnvelope, faPhoneAlt, faClock } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  return (
    <>
      <section className="about-header" id="section-p1">
        <h2>#let's_talk</h2>
        <p>LEAVE A MESSAGE, We love to hear from you</p>
      </section>
      <section className="contact-details" id="section-p1">
        <div className="details">
          <span>GET IN TOUCH</span>
          <h2>Visit one of our agency locations or contact us today</h2>
          <h3>Head Office</h3>
          <div>
            <ul>
              <li>
                <FontAwesomeIcon icon={faMap} />
                <p>S6 Glassford Street Glassgow G1 1UL New York</p>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                <p>contact@example.com</p>
              </li>
              <li>
                <FontAwesomeIcon icon={faPhoneAlt} />
                <p>contact@example.com</p>
              </li>
              <li>
                <FontAwesomeIcon icon={faClock} />
                <p>Monday to Sunday 9.00am to 16pm</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.4949797748993!2d-4.251784684179688!3d55.86423748033377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x488863f1f31c21bf%3A0x429635686cc9d2ed!2sGlassford%20St%2C%20Glasgow%20G1%201UL%2C%20UK!5e0!3m2!1sen!2sin!4v1715591388892!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section className="form-details">
        <form action="">
          <span>LEAVE A MESSAGE</span>
          <h2>We love to hear from you</h2>
          <input type="text" placeholder="Your Name" />
          <input type="text" placeholder="E-mail" />
          <input type="text" placeholder="Subject" />
          <textarea name="" id="" cols="30" rows="8" placeholder="Your Message"></textarea>
          <button className="normal">Submit</button>
        </form>
        <div className="people">
          <div>
            <img src="person/1 (1).png" alt="" />
            <p>
              <span>John Doe</span>
              <br />
              Senior Marketing Manager
              <br />
              Phone: +000 123 000 77 88 <br />
              Email: contact@example.com
            </p>
          </div>
          <div>
            <img src="person/2.png" alt="" />
            <p>
              <span>William Smith</span>
              <br />
              Senior Marketing Manager
              <br />
              Phone: +000 123 000 77 88 <br />
              Email: contact@example.com
            </p>
          </div>
          <div>
            <img src="person/3.png" alt="" />
            <p>
              <span>Emma Stone</span>
              <br />
              Senior Marketing Manager
              <br />
              Phone: +000 123 000 77 88 <br />
              Email: contact@example.com
            </p>
          </div>
        </div>
      </section>

      <section className="news" id="section-p1">
        <div className="newstext">
          <h4>Sign Up For Newsletters</h4>
          <p>
            Get E-mail updates about our latest shop and{' '}
            <span>special offers.</span>
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