import Product from "./Product";
import { Carousel } from "react-bootstrap";
import "./Slides.css";

function Slides({ slides, display }) {
  return (
    <Carousel variant='dark' indicators={false} className={display}>
      {slides.map((slide, index) => (
        <Carousel.Item key={index}>
          <div className='row row-gap-4 justify-content-center'>
            {slide.map((product) => (
              <Product product={product} key={product.id} />
            ))}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Slides;
