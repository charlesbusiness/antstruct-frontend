import Hero from "./components/Hero";
import Reviews from "./components/Reviews";
import Properties from "./components/Properties";
import MoreDetail from "./components/MoreDetail";
import Featured from "./components/Featured";
import Footer from "./components/Footer";


export default function Home() {
  return (
    <div className="Home">
      <Hero />
      <Reviews />
      <Properties />
      <MoreDetail />
      <Featured />
      <Footer />
    </div>
  );
}

