import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CategorySlider from "../../components/CategorySlider/CategorySlider";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import ImageGallery from "react-image-gallery";
import StarRating from "../../components/StarRating/StarRating";
import "./ProductDetail.css";
import LinearProgressWithLabel from "../../components/LinearProgressWithLabel/LinearProgressWithLabel";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [progress, setProgress] = React.useState(0);

  const location = useLocation();
  const { product } = location.state;

  const tabRefs = [useRef(null), useRef(null), useRef(null)];

  const images = product.small.map((item) => ({
    original: item.image,
    thumbnail: item.image,
  }));

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1); // Reset to 1 if invalid input
    }
  };

  const handleSizeChange = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const scrollToTab = () => {
      if (window.innerWidth <= 768) {
        // Mobile screen width threshold
        tabRefs[activeTab].current.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToTab();
  }, [activeTab]);

  function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  useEffect(() => {
    console.log(product);
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="prdDetail">
      <ProductSlider title={false} tile={10} />
      <CategorySlider />
      <div className="productDetailInfo">
        <div className="leftDetailInfo">
          <ImageGallery items={images} />
        </div>
        <div className="rightDetailInfo">
          <div className="leftBar">
            <div className="bestOption">
              <div className="ribbon">#Best Seller</div>
              <div className="whislistBox">
                <img src="/images/product/whislist.svg" />
              </div>
            </div>
            <h1>{product.name}</h1>
            <div className="ratingBox">
              <span>{product.rating}</span>
              {product.rating && <StarRating userrating={product.rating} />}
              <div className="reviews">
                {product.review ? product.review : 0} reviews
              </div>
            </div>
            <div className="priceSection">
              <div className="priceList">
                <p className="discount">$ {product.discount}</p>
                <p className="original">$ {product.original}</p>
              </div>
              {product.discountLabel && (
                <p className="discount">$ {product.discountLabel}</p>
              )}
            </div>
            <div className="cartSection">
              <div className="cartInputBox">
                <div className="increase" onClick={handleIncrease}>
                  +
                </div>
                <input
                  type="number"
                  name="cart"
                  value={quantity}
                  onChange={handleChange}
                  min="1"
                />
                <div className="decrease" onClick={handleDecrease}>
                  -
                </div>
              </div>
              <button type="button" className="addToCart">
                Add to cart
              </button>
            </div>
            <div className="productColor">
              Color: <span>Black</span>
            </div>
            <div className="ProductColorBoxes">
              {product.small &&
                product.small.map((item) => (
                  <img key={item.id} src={item.image} alt="Product Color" />
                ))}
            </div>
            <p className="sizeTest">Size</p>
            <div className="sizeChart">
              <ul className="sizeList">
                {product.sizeList.map((size, index) => (
                  <li
                    key={index}
                    className={index === activeIndex ? "active" : ""}
                    onClick={() => handleSizeChange(index)}
                  >
                    {size.name}
                  </li>
                ))}
              </ul>
              <div className="sizeChart">
                <p>Size Chart</p>
                <img src="/images/product/ruler.svg" alt="ruler" />
              </div>
            </div>
            <div className="gaurnteeMessage">
              <ul>
                {product.gaurnteeMessage.map((item, index) => (
                  <li key={index}>
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="detailBtn">
              <button type="button">Buy Now</button>
            </div>
          </div>
          <div className="rightBar">
            <div className="estimatedDelivery">
              <h4>Estimated Delivery</h4>
              <p>{product.deliverytime}</p>
              <span>{product.freedelivery}</span>
            </div>
            <div className="commitment">
              <h4>FikFis Commitments</h4>
              <ul>
                {product.commitment.map((data, index) => (
                  <li key={index}>{data.name}</li>
                ))}
              </ul>
            </div>
            <div className="availableOffers">
              <h4>Available Offers</h4>
              <ul>
                {product.availableOffers.map((data, index) => (
                  <li key={index}>{data.name}</li>
                ))}
              </ul>
            </div>
            <div className="stockItemLeft">
              Hurry! Only {product.stocksLeft} Items Left In Stock
            </div>
          </div>
        </div>
      </div>
      <div className="productDetailReview">
        <div className="tabs-container">
          <div className="tabs-buttons">
            <button
              className={activeTab === 0 ? "active" : ""}
              onClick={() => setActiveTab(0)}
            >
              Product Description
            </button>
            <button
              className={activeTab === 1 ? "active" : ""}
              onClick={() => setActiveTab(1)}
            >
              Additional Information
            </button>
            <button
              className={activeTab === 2 ? "active" : ""}
              onClick={() => setActiveTab(2)}
            >
              FikFis Verified Reviews
            </button>
          </div>

          <div className="tabs-content">
            <div
              className="tab-content productDescription"
              ref={tabRefs[0]}
              style={{ display: activeTab === 0 ? "block" : "none" }}
            >
              <p>{product.prdDetailDescription}</p>
            </div>
            <div
              className="tab-content"
              ref={tabRefs[1]}
              style={{ display: activeTab === 1 ? "block" : "none" }}
            >
              <div className="additionalInfo">
                <div className="technical info">
                  <h5>Technical Details</h5>
                  <table>
                    <tbody>
                      {Object.entries(product.technical_details).map(
                        ([key, value], index) => (
                          <tr key={index}>
                            <td>
                              {capitalizeFirstLetter(key.replace(/_/g, " "))}
                            </td>
                            <td>{value}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="additional info">
                  <h5>Additional Information</h5>
                  <table>
                    <tbody>
                      {Object.entries(product.additional_info).map(
                        ([key, value], index) => (
                          <tr key={index}>
                            <td>
                              {capitalizeFirstLetter(key.replace(/_/g, " "))}
                            </td>
                            <td>{value}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div
              className="tab-content"
              ref={tabRefs[2]}
              style={{ display: activeTab === 2 ? "block" : "none" }}
            >
              <div className="reviewSection">
                <div className="leftReviewPart">
                  <h4>Customer reviews</h4>
                  {product.rating && <StarRating userrating={product.rating} />}
                  <div className="detailLinearRivewProgress">
                    {product.detail_rating.map((item, index) => (
                      <div className="reviewProgress" key={index}>
                        <span>{item.name}</span>
                        <div className="progressBar">
                          <LinearProgressWithLabel
                            value={parseFloat(item.rate)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ratingCalculateInfo">
                    <h4>How are ratings calculated?</h4>
                    <p>
                      To calculate the overall star rating and percentage
                      breakdown by star, we don’t use a simple average. Instead,
                      our system considers things like how recent a review is
                      and if the reviewer bought the item on Amazon. It also
                      analyses reviews to verify trustworthiness.
                    </p>
                  </div>
                </div>
                <div className="rightCommentPart">
                  <div className="reviewCommentHeader">
                    <h4>Customer say</h4>
                    <div class="commentSelect">
                      <select>
                        <option>Most Recent</option>
                        <option>Category 1</option>
                        <option>Category 2</option>
                        <option>Category 3</option>
                      </select>
                    </div>
                  </div>
                  <div className="productReviewList">
                      {product.customer_review.map((item, index) => (
                          <div className="reviewComments" key={index}>
                            <div className="userImage">
                              <img src={item.profile_image} alt={item.rate_name} />
                            </div>
                            <div className="reviewRightomments">
                              <div className="userName">{item.name}</div>
                              <div className="ratingBox">
                                  {item.rating && <StarRating userrating={item.rating} />}
                                  <div className="rateusername">{item.rate_name}</div>
                              </div>
                              {item.description && <p>{item.description}</p>}
                              <div className="reviewed_image">
                              {item.product_review_image && (item.product_review_image.map((review_image, index) => (
                                  <img  key={index} src={review_image} alt={'Product Image'} />
                              )))}
                                </div>
                            </div>
                          </div>
                      ))}
                      <button type="button" className="all_reviews">See all reviews</button>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
