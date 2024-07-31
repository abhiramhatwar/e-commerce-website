import HomeCover from "../components/HomeCover";
import Slider from "../components/Slider";
import "./Home.css";

function Home() {
  return (
    <div className='bg-image-custom'>
      <HomeCover />
      <Slider />
    </div>
  );
}

export default Home;
