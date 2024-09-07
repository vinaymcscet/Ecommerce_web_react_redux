import React from "react";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import CategorySlider from "../../components/CategorySlider/CategorySlider";
import "./ProductList.css";
import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { productList } from "../../utils/ProductData";

const ProductList = (item) => {
  return (
    <div className="productListing">
      <ProductSlider title={false} tile={10} />
      <CategorySlider />
      <div className="prdWrapper">
        <div className="prdLeft"></div>
        <div className="prdRight">
          <div className="productList">
            {productList.map((item, index) => {
              return (
                <div key={index}>
                  <ProductListCard
                    id={item.id}
                    image={item.image ? item.image : ""}
                    name={item.name ? item.name : ""}
                    userrating={item.rating ? item.rating : ""}
                    discountPrice={item.discount ? item.discount : ""}
                    originalPrice={item.original ? item.original : ""}
                    save={item.save ? item.save : ""}
                    coupenCode={item.coupen ? item.coupen : ""}
                    deliveryTime={item.deliverytime ? item.deliverytime : ""}
                    freeDelivery={item.freedelivery ? item.freedelivery : ""}
                    bestSeller={item.bestseller ? item.bestseller : ""}
                    time={item.time ? item.time : ""}
                    discountLabel={item.discountlabel ? item.discountlabel : ""}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
