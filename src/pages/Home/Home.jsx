import React, { useEffect, useMemo, useState } from "react";
import Banner from "../../components/Banner/Banner";
import "./Home.css";
import ProductSlider from "../../components/ProductSlider/ProductSlider";

import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { useDispatch, useSelector } from "react-redux";
import { getHomeData, getHomeSection } from "../../store/slice/api_integration";
import { formatDate } from "../../utils/FormatDateTime";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Home = () => {
  const dispatch = useDispatch();
  const { homeProductData, homeProductSection } = useSelector(state => state.product);
  const [productTile] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    setLoading(true)
    dispatch(getHomeData())
    const responseObj = {
      offset: 1,
      limit: 100
    }
    dispatch(getHomeSection(responseObj)).finally(() => {
      setLoading(false);
    })
  }, [dispatch]);
  
  const handleProductClick = (item) => {
    navigate(`/product/${item.product_id}`, { state: { product: item } });
  };

  const handleSectionPage = (title, group_id = 0) => {
    navigate(`/sectionDetail/${group_id}?title=${encodeURIComponent(title)}`)
  }

  return (
    <div>
      {loading ? (
          <div className="loadingContainer">
              <CircularProgress />
          </div>
      ) : (
        <>
          <Banner />
          <ProductSlider title={productTile} />
          <div className="productHistory">
            <div>
              <div className="browisingHistory">
                <h3>{homeProductData?.offerTitle}</h3>
                <div className="detailSection" 
                  onClick={() => handleSectionPage(homeProductData.offerTitle)}><img src="/images/icons/right_arrow.svg" /></div>
              </div>
            </div>
          </div>
          <div className="productList special">
            {homeProductData?.offers && homeProductData?.offers.map((item, index) => (
              <div key={index} onClick={() => handleProductClick(item)}>
                <ProductListCard
                  id = {item?.categoryId}
                  image={item?.categoryImage}
                  name={item?.categoryName}
                  // discountPrice={"105100"}
                  // originalPrice={"1790.00"}
                  discountLabel={item?.title}
                  time={`valid till ${formatDate(item.validTill)}`}
                  wishlistStatus={item.wishlistStatus ? item.wishlistStatus : 'no'}
                />
              </div>
            ))}
          </div>
          <div className="productHistory">
              {homeProductSection && homeProductSection.length > 0 ? (
                  homeProductSection.map((item, index) => (
                    <div key={index}>
                      <div className="browisingHistory">
                        <h3>{item.title}</h3>
                        <div className="detailSection" onClick={() => handleSectionPage(item.title, item.group_id)}><img src="/images/icons/right_arrow.svg" /></div>
                      </div>
                        <div className="productList">
                        {item?.products.map((product, index) => (
                          <div key={index} onClick={() => handleProductClick(product)}>
                            <ProductListCard
                              id={product?.group_id}
                              image={product.imageUrl ? product.imageUrl : "/images/no-product-available.png"}
                              name={product.name ? product.name : ""}
                              userrating={product.rating ? product.rating : ""}
                              discountPrice={product.discountedPrice ? product.discountedPrice : ""}
                              originalPrice={product.price ? product.price : ""}
                              save={product.offer ? product.offer : ""}
                              coupenCode={product.coupen ? product.coupen : ""}
                              deliveryTime={product.deliverytime ? product.deliverytime : ""}
                              freeDelivery={product.freedelivery ? item.freedelivery : ""}
                              bestSeller={item.bestseller ? product.bestseller : ""}
                              time={product.time ? product.time : ""}
                              discountLabel={product.offer ? product.offer : ""}
                              wishlistStatus={item.wishlistStatus ? item.wishlistStatus : 'no'}
                            />
                          </div>
                        ))}
                        </div>
                    </div>
                  ))
                ) : (
                  <p>No products available</p>
                )}
          </div>
          <div className="groupBanner">
            <img src={homeProductData?.bottomBanner[0]?.banner_image} alt={homeProductData?.bottomBanner[0]?.name} />
          </div>
          {homeProductData?.RecentViewed.length > 0 && <div className="browisingHistory">
            <h3>Inspired by your browsing history</h3>
          </div>}
          {homeProductData?.RecentViewed.length > 0 && <div className="productHistory">
            <div className="productList">
              {homeProductData?.RecentViewed && homeProductData?.RecentViewed.length > 0 ? (
                homeProductData?.RecentViewed.map((item, index) => (
                  <div key={index} onClick={() => handleProductClick(item)}>
                    <ProductListCard
                      id={index}
                      image={item.imageUrl ? item.imageUrl : "/images/no-product-available.png"}
                      name={item.name ? item.name : ""}
                      userrating={item.rating ? item.rating : ""}
                      discountPrice={item.discountedPrice ? item.discountedPrice : ""}
                      originalPrice={item.price ? item.price : ""}
                      save={item.offer ? item.offer : ""}
                      coupenCode={item.coupen ? item.coupen : ""}
                      deliveryTime={item.deliverytime ? item.deliverytime : ""}
                      freeDelivery={item.freedelivery ? item.freedelivery : ""}
                      bestSeller={item.bestseller ? item.bestseller : ""}
                      time={item.time ? item.time : ""}
                      discountLabel={item.offer ? item.offer : ""}
                      wishlistStatus={item.wishlistStatus ? item.wishlistStatus : 'no'}
                    />
                  </div>
                ))
              ) : (
                <p className="noProductAvailable">No product history available</p>
              )}
            </div>
          </div>}
        </>
      )}
    </div>
  );
};

export default Home;
