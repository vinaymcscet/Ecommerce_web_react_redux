import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { slick_product_settings, slick_settings, slides } from "../../utils/ProductData";
import ProductCard from "../ProductCard/ProductCard";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import "./ProductSlider.css";
import { getAllCategoryData, getSubCategoryData } from "../../store/slice/api_integration";
import { toggleCategoryModal } from "../../store/slice/modalSlice";

const ProductSlider = ({ title, tile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen] = useState(true);
  const { homeProductData, subCategoryList } = useSelector(state => state.product);

  const handleViewAllClick = () => {
    dispatch(getAllCategoryData());
    navigate("allcategory");
  };

  const handleProductClick = (item) => {
    const responseObj = { category_id: item.id };
    dispatch(getSubCategoryData(responseObj))
    const subCategoryObj = { 
      isOpen: isOpen, 
      category: subCategoryList, 
      category_name: item.name,
      category_id: item.id,
    };
    dispatch(toggleCategoryModal(subCategoryObj));
    // navigate(`/productlist`, { state: { product } });
  };

  return (
    <div className="catProduct">
        <div className="catProduct"> 
        {title && (
          <div className="productHeader">
            <h3>Shop By Category</h3>
            <Button
              type="button"
              value="VIEW ALL"
              variant="secondary"
              handleClick={handleViewAllClick}
            />
          </div>
        )}
          <Slider {...(tile ? slick_product_settings : slick_settings)}>
            {homeProductData?.categories.map((slide) => (
              <div key={slide.id}>
                <ProductCard
                  imgSrc={slide.category_image || '/images/no-product-available.png'}
                  imgName={slide.name}
                  handleCategory={() => handleProductClick(slide)}
                />
              </div>
            ))}
          </Slider>
        </div>
    </div>
  );
};

export default ProductSlider;
