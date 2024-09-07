import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { slick_product_settings, slick_settings, slides } from "../../utils/ProductData";
import ProductCard from "../ProductCard/ProductCard";
import Button from "../Button/Button";
import "./ProductSlider.css";

const ProductSlider = ({ title, tile }) => {
  const navigate = useNavigate();

  const handleViewAllClick = () => {
    navigate("allcategory");
  };

  const handleProductClick = (product) => {
    console.log("product", product);
    navigate(`/productlist`, { state: { product } });
  };

  return (
    <div className="catProduct">
      {title && (
        <div className="productHeader">
          <h3>Shop By Category</h3>
          <Button
            type="button"
            value="VIEW ALL"
            varient="secondary"
            handleClick={handleViewAllClick}
          />
        </div>
      )}
      {tile && <Slider {...slick_product_settings}>
        {slides.map((slide, index) => {
          return (
            <div key={index}>
              <ProductCard
                imgSrc={slide.img}
                imgName={slide.PrdName}
                handleCategory={() => handleProductClick(slide)}
              />
            </div>
          );
        })}
      </Slider>}
      {!tile && <Slider {...slick_settings}>
        {slides.map((slide, index) => {
          return (
            <div key={index}>
              <ProductCard
                imgSrc={slide.img}
                imgName={slide.PrdName}
                handleCategory={() => handleProductClick(slide)}
              />
            </div>
          );
        })}
      </Slider>}
    </div>
  );
};

export default ProductSlider;
