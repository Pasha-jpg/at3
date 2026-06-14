'use client'
/* components/Carousel.js*/
import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
// import CarouselImage from "./CarouselImage"; // <-- COMMENT THIS OUT FOR NOW
import 'bootstrap/dist/css/bootstrap.min.css';

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        {/* <CarouselImage text="First slide" /> */}
        <img
          src="https://picsum.photos/id/1002/800/400?text=First+Slide"
          alt="First slide"
          style={{ width: '100%', height: 'auto' }}
        />
        <Carousel.Caption>
          <h3>Oceania</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        {/* <CarouselImage text="Second slide" /> */}
        <img
          src="https://picsum.photos/id/1015/800/400?text=Second+Slide"
          alt="Second slide"
          style={{ width: '100%', height: 'auto' }}
        />
        <Carousel.Caption>
          <h3>River</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        {/* <CarouselImage text="Third slide" /> */}
        <img
          src="https://picsum.photos/id/1005/800/400?text=Third+Slide"
          alt="Third slide"
          style={{ width: '100%', height: 'auto' }}
        />
        <Carousel.Caption>
          <h3>Desert</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;