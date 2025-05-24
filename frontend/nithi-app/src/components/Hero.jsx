import Arrivals from "./Arrivals";
import Banner from "./Banner";
import Features from "./Features";
import News from "./News";
import Products from "./Products";

export default function Hero(){
   return (
    <>
        <section class="hero" id="section-p1">
            <h4> Trade-in-offer</h4>
            <h2>Super value deals</h2>
            <h1>On all products</h1>
            <h5>Save more with coupons & up to 70% off!</h5>
            <button >Shop now</button>
        </section>
        <Features/>
        <Products/>
        <Banner/>
        <Arrivals/>
        <News/>
    </>
   )
}