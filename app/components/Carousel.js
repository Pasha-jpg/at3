'use client'
/* components/Carousel.js*/
import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <Image
          src="https://picsum.photos/id/1002/800/400"
          alt="Oceania landscape"
          width={800}
          height={400}
          loading="eager"
          style={{ width: '100%', height: 'auto' }}
        />
        <Carousel.Caption>
          <h3>Oceania</h3>
          <p>Beautiful landscapes of Oceania with crystal clear waters.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <Image
          src="https://picsum.photos/id/1015/800/400"
          alt="Mountain river"
          width={800}
          height={400}
          loading="eager"
          style={{ width: '100%', height: 'auto' }}
        />
        <Carousel.Caption>
          <h3>River</h3>
          <p>Flowing rivers through majestic mountain valleys.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <Image
          src="https://picsum.photos/id/1005/800/400"
          alt="Desert landscape"
          width={800}
          height={400}
          loading="eager"
          style={{ width: '100%', height: 'auto' }}
        />
        <Carousel.Caption>
          <h3>Desert</h3>
          <p>Vast desert expanses with stunning natural beauty.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;