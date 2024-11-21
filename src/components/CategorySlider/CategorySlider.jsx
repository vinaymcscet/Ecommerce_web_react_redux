import React, { useState } from "react";
import Slider from "react-slick";
import { slick_category_settings } from "../../utils/ProductData";
import CategoryCard from "../CategoryCard/CategoryCard";
import './CategorySlider.css'
import { useDispatch, useSelector } from "react-redux";
import { getSubCategoryData } from "../../store/slice/api_integration";
import { toggleCategoryModal } from "../../store/slice/modalSlice";

const CategorySlider = () => {
  const dispatch = useDispatch();
  const [isOpen] = useState(true);
  const { homeProductData, subCategoryList } = useSelector((state) => state.product); 

  const handleProductClick = (item) => {
    console.log("product", item);
    const responseObj = { category_id: item.id };
    dispatch(getSubCategoryData(responseObj))
    const subCategoryObj = { 
      isOpen: isOpen, 
      category: subCategoryList, 
      category_name: item.name,
    };
    dispatch(toggleCategoryModal(subCategoryObj));
  }; 

    return (
      <div className="catProduct">
        {homeProductData.length > 0 ? (<Slider {...slick_category_settings}>
          {homeProductData[0]?.categories.map((slide, index) => {
            return (
              <div key={index}>
                <CategoryCard
                  imgSrc={slide.category_image || '/images/no-product-available.jpg'}
                  imgName={slide.name}
                  handleCategory={() => handleProductClick(slide)}
                />
              </div>
            );
          })}
        </Slider>) : ''}
      </div>
    );
  };  

export default CategorySlider