import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';

const ImageSlider = () => {
  const images = [
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
    'https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg?cs=srgb&dl=pexels-karl-solano-2883049.jpg&fm=jpg',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dmlydHVhbCUyMG9mZmljZXxlbnwwfHwwfHw%3D&w=1000&q=80',
    'https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG9mZmljZSUyMGJ1aWxkaW5nfGVufDB8fDB8fHww&w=1000&q=80'
  ];

  const [, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [images.length]);

  return (
    <Carousel>
      {images.map((image, index) => (
        <Carousel.Item key={index} >
          <img className="d-block w-100" src={image} alt={`Slide ${index + 1}`} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ImageSlider;