import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategoryModal } from "../../store/slice/modalSlice";
import "./Category.css";
import { addToCartData, getAllCategoryData, getAllListProductAPI, getAllRecentViewData, getSubCategoryData, productDetailData, viewItemsInCartData } from "../../store/slice/api_integration";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_OPTIONS } from "../../utils/Constants";
import { CircularProgress } from "@mui/material";
import { setViewCartItems } from "../../store/slice/cartSlice";

const Category = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [page, setPage] = useState(0);  // Default page 0 (first page)
  const [itemsPerPage,setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [triggerSkuId, setTriggerSkuId] = useState(null);

  const { allCategoryList, subCategoryList, recentView, totalRecentView = 0 } = useSelector(
    (state) => state.product
  );
  
  const handleCategory = (item) => {
    const responseObj = { category_id: item.id };
    dispatch(getSubCategoryData(responseObj))
    const subCategoryObj = { 
      isOpen: isOpen, 
      category: subCategoryList, 
      category_name: item.name,
    };
    dispatch(toggleCategoryModal(subCategoryObj));
  };
 
  useEffect(() => {
    setLoading(true)
    dispatch(getAllCategoryData()).finally(() => {
      setLoading(false)
    })
    // dispatch(getAllRecentViewData(0, itemsPerPage));
  }, [dispatch]);


  useEffect(() => {
    // Read query and page number from the URL search params
    const searchParams = new URLSearchParams(location.search);
    const pageParam = parseInt(searchParams.get('page'), 10) || 1; // Default to page 1 if not provided
    const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || itemsPerPage;

    // Update local page state to match the page in the URL
    setPage(pageParam - 1); // `react-paginate` uses 0-based indexing
    setItemsPerPage(itemsPerPageParam);

    // If there is a query, fetch data from API
        const offset = ((pageParam - 1) * itemsPerPage) + 1; // Calculate the correct offset
        const limit = itemsPerPageParam;
        const responseObj = {
            offset,
            limit,
        }
        dispatch(getAllRecentViewData(responseObj)); // Dispatch API call
}, [location.search, itemsPerPage, dispatch]);  // Trigger this effect when the URL's query or page changes

// Handle page change event (when user clicks next/previous)
const handlePageChange = (data) => {
  const { selected } = data;
  const searchParams = new URLSearchParams(location.search);
  searchParams.set("page", selected + 1); // Convert to 1-based indexing
  navigate(`?${searchParams.toString()}`);
  };

  // Handle dropdown change for itemsPerPage
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setPage(0); // Reset to the first page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", 1);
    searchParams.set("itemsPerPage", newItemsPerPage);
    navigate(`?${searchParams.toString()}`);
  };

  // Calculate total pages based on total results
  const itemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= totalRecentView);
  
  const handleProductClick = (item) => {
    const responseObj = { 
      product_id: item.product_id,
    }
    dispatch(productDetailData(responseObj))
    navigate(`/product/${item.product_id}`, { state: { product: item } });
  };
  const handleAddToCartClick = (sku_id) => {
      setTriggerSkuId(sku_id);
      const responseObj = {
        sku_id,
        type: "increase",
      };
      dispatch(addToCartData(responseObj)).finally(() => {
        fetchUpdatedProductList();
      })
  };
  const handleIncrement = (sku_id) => {
    const responseObj = { sku_id, type: "increase" };
    dispatch(addToCartData(responseObj)).finally(() => {
      fetchUpdatedProductList();
    });
  };

  const handleDecrement = (sku_id) => {
    const responseObj = { sku_id, type: "decrease" };
    dispatch(addToCartData(responseObj)).finally(() => {
      fetchUpdatedProductList();
    });
  };

  const fetchUpdatedProductList = () => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = parseInt(searchParams.get('page'), 10) || 1; // Default to page 1 if not provided
    const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || itemsPerPage;

    // Update local page state to match the page in the URL
    setPage(pageParam - 1); // `react-paginate` uses 0-based indexing
    setItemsPerPage(itemsPerPageParam);

    // If there is a query, fetch data from API
        const offset = ((pageParam - 1) * itemsPerPage) + 1; // Calculate the correct offset
        const limit = itemsPerPageParam;
        const responseObj = {
            offset,
            limit,
        }
        dispatch(getAllRecentViewData(responseObj));
    dispatch(viewItemsInCartData());
    dispatch(setViewCartItems(null));
  };

  return (
    <>
      {loading ? (
        <div className="loadingContainer">
            <CircularProgress />
        </div>
        ) : (
        <div className="allCategory">
          {allCategoryList[0] && allCategoryList[0].length > 0 ? (
            <>
              <h3>Main Category</h3>
              <div className="categoryList">
                {allCategoryList[0].map((slide, index) => (
                  <div key={index}>
                    <ProductCard
                      id = {slide?.id}
                      imgSrc={slide?.category_image || '/images/no-product-available.png'}
                      imgName={slide?.name}
                      handleCategory={() => handleCategory(slide)}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="notAvailable">No Category available</p>
          )}
          <div className="productHistory">
            <div className="productHeader">
              {recentView && recentView.length > 0 && <h3>Frequently bought</h3>}
              {recentView?.length > 0 && <div className='paginationBox'>
                  <div className="itemsPerPageDropdown">
                      <label>Items per page: </label>
                      <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                          {itemsPerPageOptions.map(option => (
                              <option key={option} value={option}>
                                  {option}
                              </option>
                          ))}
                      </select>
                  </div>
                  {/* Pagination component */}
                  <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      pageCount={Math.max(Math.ceil(totalRecentView / itemsPerPage), 1)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={(ev) => handlePageChange(ev)}
                      containerClassName={"pagination"}
                      activeClassName={"active"}
                      forcePage={page}  // Sync current page with URL
                      disabled={totalRecentView === 0} 
                  />
                </div>
              }
            </div>
            <div className="productList">
              {recentView && recentView.length > 0 && (
                recentView.map((item, index) => (
                  <div key={index}>
                    <ProductListCard
                      id={item.id}
                      image={item.imageUrl ? item.imageUrl : "/images/no-product-available.png"}
                      name={item.name || ""}
                      userrating={item.rating || "0.0"}
                      discountPrice={item.discountedPrice || ""}
                      originalPrice={item.price || ""}
                      save={item.offer || ""}
                      coupenCode={item.coupen || ""}
                      deliveryTime={item.deliverytime || ""}
                      freeDelivery={item.freedelivery || ""}
                      bestSeller={item.bestseller || ""}
                      time={item.time || ""}
                      discountLabel={item.discountlabel || ""}
                      wishlistStatus={item.wishlistStatus || 'no'}
                      sku_id={item.sku_id} // Pass SKU ID for Add to Cart
                      // onAddToCart={() => handleAddToCartClick(item.sku_id)}
                      onAddToCart={() => handleProductClick(item)}
                      cartQuantity={Number(item.cartQuantity)}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      onProductClick={() => handleProductClick(item)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="productHistory">
            <div className="productHeader">
              {recentView && recentView.length > 0 && <h3>Inspired by your browsing history</h3>}
              {recentView?.length > 0 && <div className='paginationBox'>
                  <div className="itemsPerPageDropdown">
                      <label>Items per page: </label>
                      <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                          {itemsPerPageOptions.map(option => (
                              <option key={option} value={option}>
                                  {option}
                              </option>
                          ))}
                      </select>
                  </div>
                  {/* Pagination component */}
                  <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      pageCount={Math.max(Math.ceil(totalRecentView / itemsPerPage), 1)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={(ev) => handleItemsPerPageChange(ev)}
                      containerClassName={"pagination"}
                      activeClassName={"active"}
                      forcePage={page}  // Sync current page with URL
                      disabled={totalRecentView === 0} 
                  />
                </div>
              }
            </div>
            <div className="productList">
              {recentView && recentView.length > 0 && (
                recentView.map((item, index) => (
                  <div key={index}>
                    <ProductListCard
                      id={item.id}
                      image={item.imageUrl ? item.imageUrl : "/images/no-product-available.png"}
                      name={item.name || ""}
                      userrating={item.rating || "0.0"}
                      discountPrice={item.discountedPrice || ""}
                      originalPrice={item.price || ""}
                      save={item.offer || ""}
                      coupenCode={item.coupen || ""}
                      deliveryTime={item.deliverytime || ""}
                      freeDelivery={item.freedelivery || ""}
                      bestSeller={item.bestseller || ""}
                      time={item.time || ""}
                      discountLabel={item.discountlabel || ""}
                      wishlistStatus={item.wishlistStatus || 'no'}
                      sku_id={item.sku_id} // Pass SKU ID for Add to Cart
                      // onAddToCart={() => handleAddToCartClick(item.sku_id)}
                      onAddToCart={() => handleProductClick(item)}
                      cartQuantity={Number(item.cartQuantity)}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      onProductClick={() => handleProductClick(item)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Category;
