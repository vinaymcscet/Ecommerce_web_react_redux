import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { slick_category_settings } from "../../utils/ProductData";
import CategoryCard from "../CategoryCard/CategoryCard";
import './CategorySlider.css'
import { useDispatch, useSelector } from "react-redux";
import { getProductOnSubCategory, getSubCategoryData } from "../../store/slice/api_integration";
import { useLocation, useNavigate } from "react-router-dom";

const CategorySlider = ({ subCategoryId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { subCategoryList } = useSelector((state) => state.product); 

  const handleProductClick = (item) => {
    const responseObj = {
      sub_category_id: item.id, 
      offset: 1, 
      limit: 10
    }
    dispatch(getProductOnSubCategory(responseObj));
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("subcategory_id", item.id);
    navigate(`?${searchParams.toString()}`);
  };

  const activeCategoryId = subCategoryId;

    return (
      <div className="catProduct">
        {subCategoryList ? (<Slider {...slick_category_settings}>
          {subCategoryList?.map((slide, index) => {
            return (
              <div key={index}>
                <CategoryCard
                  imgSrc={slide.category_image || '/images/no-product-available.png'}
                  imgName={slide.name}
                  handleCategory={() => handleProductClick(slide)}
                  activeCategory={parseInt(slide?.id, 10) === parseInt(activeCategoryId, 10)}
                />
              </div>
            );
          })}
        </Slider>) : ''}
      </div>
    );
  };  

export default CategorySlider