import React from "react";
import Banner from "../../components/Banner/Banner";
import { BannerOfferData } from "../../utils/BannerOfferData";
import "./Home.css";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import FourCategoryProduct from "../../components/FourCategoryProduct/FourCategoryProduct";
import {
  description,
  Onedescription,
  productHistory,
} from "../../utils/ProductData";
import OneCategoryProduct from "../../components/OneCategoryProduct/OneCategoryProduct";
import ProductListCard from "../../components/ProductListCard/ProductListCard";

const Home = () => {
  return (
    <div>
      <Banner props={BannerOfferData} />
      <ProductSlider title={true} />
      <div className="fourCategoryProduct">
        <FourCategoryProduct
          header="Appliances for your home Up to 55% off"
          description={description}
        />
        <FourCategoryProduct
          header="Starting $99 | International Brands & more"
          description={description}
        />
        <FourCategoryProduct
          header="Up to 70% off | Bestseller Smart Phone"
          description={description}
        />
        <FourCategoryProduct
          header="Automative essentials | Up to 60% off"
          description={description}
        />
        <OneCategoryProduct
          header="Automative essentials | Up to 60% off"
          description={Onedescription}
        />
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
      </div>
      <div className="productList">
        <ProductListCard
          image={"/images/product/img-13.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-14.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-15.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-16.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <div className="limitedOffer">
          <img src="/images/limitedOffer.png" alt="Limited Offer" />
        </div>
      </div>
      <div className="fourCategoryProduct">
        <OneCategoryProduct
          header="Automative essentials | Up to 60% off"
          description={Onedescription}
        />
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
      </div>
      <div className="productList">
        <div className="limitedOffer">
          <img src="/images/limitedOffer.png" alt="Limited Offer" />
        </div>
        <ProductListCard
          image={"/images/product/img-13.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-14.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-15.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-16.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
      </div>
      <div className="groupBanner">
        <img src="/images/groupBanner.svg" alt="Banner Poster" />
      </div>
      <div className="fourCategoryProduct">
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
        <OneCategoryProduct
          header="Automative essentials | Up to 60% off"
          description={Onedescription}
        />
      </div>
      <div className="browisingHistory">
        <h3>Inspired by your browsing history</h3>
      </div>
      <div className="productList">
        {productHistory.map((item, index) => {
          return (
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
          );
        })}
      </div>
    </div>
  );
};

export default Home;
