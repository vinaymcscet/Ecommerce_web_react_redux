import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CategorySlider from "../../components/CategorySlider/CategorySlider";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import ImageGallery from "react-image-gallery";
import "./ProductDetail.css";
import StarRating from "../../components/StarRating/StarRating";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const { product } = location.state;
  console.log(product);

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
              <div class="ribbon">#Best Seller</div>
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
              <div class="priceList">
                <p class="discount">$ {product.discount}</p>
                <p class="original">$ {product.original}</p>
              </div>
              {product.discountLabel && (
                <p class="discount">$ {product.discountLabel}</p>
              )}
            </div>
            <div className="cartSection">
              <div className="cartInputBox">
                <div class="increase" onClick={handleIncrease}>+</div>
                <input
                  type="number"
                  name="cart"
                  value={quantity}
                  onChange={handleChange}
                  min="1"
                />
                <div class="decrease" onClick={handleDecrease}>-</div>
              </div>
              <button type="button" className="addToCart">
                Add to cart
              </button>
            </div>
            <div className="productColor">Color: <span>Black</span></div>
            <div className="ProductColorBoxes">
                {product.small && product.small.map((item) => (
                    <img key={item.id} src={item.image} alt="Product Color" />
                ))}
            </div>
            <p className="sizeTest">Size</p>
            <div className="sizeChart">
                <ul className="sizeList">
                    <li>S</li>
                    <li>M</li>
                    <li>L</li>
                    <li>XL</li>
                    <li>XXL</li>
                </ul>
                <div className="sizeChart">
                    <p>Size Chart</p>
                    <img src="/images/product/ruler.svg" alt="ruler" />
                </div>
            </div>
          </div>
          <div className="rightBar"></div>
        </div>
      </div>
      {/* <h1>{product.name}</h1>
        <img src={product.image} alt={product.name} />
        <ImageGallery items={images} />; */}
    </div>
  );
};

export default ProductDetail;
