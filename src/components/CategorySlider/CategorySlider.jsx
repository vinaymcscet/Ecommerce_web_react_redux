import React from "react";
import Slider from "react-slick";
import { categorySlides, slick_category_settings } from "../../utils/ProductData";
import CategoryCard from "../CategoryCard/CategoryCard";
import './CategorySlider.css'

const CategorySlider = () => {
    
    return (
      <div className="catProduct">
        <Slider {...slick_category_settings}>
          {categorySlides.map((slide, index) => {
            return (
              <div key={index}>
                <CategoryCard
                  imgSrc={slide.img}
                  imgName={slide.PrdName}
                />
              </div>
            );
          })}
        </Slider>
      </div>
    );
  };  

export default CategorySlider