import React from "react";
import Slider from "react-slick";
import { slick_category_settings } from "../../utils/ProductData";
import CategoryCard from "../CategoryCard/CategoryCard";
import './CategorySlider.css'
import { useSelector } from "react-redux";

const CategorySlider = () => {
  const { categorySlide } = useSelector((state) => state.product);  

    return (
      <div className="catProduct">
        {categorySlide.length > 0 ? (<Slider {...slick_category_settings}>
          {categorySlide[0].map((slide, index) => {
            return (
              <div key={index}>
                <CategoryCard
                  imgSrc={slide.img}
                  imgName={slide.PrdName}
                />
              </div>
            );
          })}
        </Slider>) : ''}
      </div>
    );
  };  

export default CategorySlider