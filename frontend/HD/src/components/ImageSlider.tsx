import Slider from "react-slick";
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageSlider.css";
import RightArrow from "./icons/RightArrow";
import LeftArrow from "./icons/LeftArrow";


// Define the props type for the arrow components
interface ArrowProps {
  onClick?: () => void;
}

const NextArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <div className="nextArrow" onClick={onClick}>
      <RightArrow />
    </div>
  );
};

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <div className="prevArrow" onClick={onClick}>
      <LeftArrow />{" "}
    </div>
  );
};

// Define the card type
interface Card {
  id: number;
  text: string;
}

// Define the props type for ImageSlider
interface ImageSliderProps {
  cards: Card[];
  slidesToShow?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  cards,
  slidesToShow = 5,
}) => {
  const [imageIndex, setImageIndex] = useState<number>(0);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    dots: false,
    speed: 300,
    slidesToShow: slidesToShow,
    centerPadding: "0",
    swipeToSlide: true,
    focusOnSelect: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_current: number, next: number) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1490,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const templateCards = cards.map((card, idx) => {
    if (card !== null) {
      return (
        <div
          className={idx === imageIndex ? "activeSlide" : "slide"}
          key={card.id}
        >
          <div className="slideWrapper">
            <div className="card-content">
              <div className="content-container">{card.text}</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  });

  return <Slider {...settings}>{templateCards}</Slider>;
};

export default ImageSlider;
