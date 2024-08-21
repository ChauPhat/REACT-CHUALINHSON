import React from "react";
import Slider from "react-slick";
import "./CategoryCarousel.css"; // Import CSS tùy chỉnh

const categories = [
  { name: "John Doe", role: "Developer", image: "https://via.placeholder.com/150" },
  { name: "Jane Smith", role: "Designer", image: "https://via.placeholder.com/150" },
  { name: "Alice Johnson", role: "Manager", image: "https://via.placeholder.com/150" },
  { name: "Mike Brown", role: "Analyst", image: "https://via.placeholder.com/150" },
  { name: "Emily White", role: "HR", image: "https://via.placeholder.com/150" },
  { name: "David Wilson", role: "CEO", image: "https://via.placeholder.com/150" },
];

const CategoryCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
    arrows: true, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="category-carousel">
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            <div className="profile-card">
              <img src={category.image} alt={category.name} className="profile-image" />
              <div className="profile-info">
                <h3>{category.name}</h3>
                <p>{category.role}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategoryCarousel;
