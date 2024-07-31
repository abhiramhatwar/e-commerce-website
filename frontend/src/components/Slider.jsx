import { useEffect, useState } from "react";
import Slides from "./Slides";
import StyledHeading from "./StyledHeading";
import StyledLoading from "./StyledLoading";
import axios from "axios";

function Slider() {
  const [slidesLG, setSlidesLG] = useState([]);
  const [slidesMD, setSlidesMD] = useState([]);
  const [slidesSM, setSlidesSM] = useState([]);
  const [loading, setLoading] = useState(false);

  function slidePagination(items, size) {
    const slides = [];
    for (let i = 0; i < items.length; i += size) {
      slides.push(items.slice(i, i + size));
    }
    return slides;
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/featured`)
      .then((res) => {
        setSlidesLG(slidePagination(res.data.message, 4));
        setSlidesMD(slidePagination(res.data.message, 2));
        setSlidesSM(slidePagination(res.data.message, 1));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className='container pb-5'>
      <StyledHeading heading='Featured Products' />
      {loading ? (
        <div className='text-center'>
          <StyledLoading />
        </div>
      ) : (
        <>
          {/* For large screens (4 per slide) */}
          <Slides slides={slidesLG} display='d-none d-lg-block' />

          {/* For medium screens (2 per slide) */}
          <Slides slides={slidesMD} display='d-none d-md-block d-lg-none' />

          {/* For small screens (1 per slide) */}
          <Slides slides={slidesSM} display='d-md-none' />
        </>
      )}
    </div>
  );
}

export default Slider;
