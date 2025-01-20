import React, { useEffect, useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation, useNavigate } from "react-router-dom";

import ProductSlider from "../../components/ProductSlider/ProductSlider";
import CategorySlider from "../../components/CategorySlider/CategorySlider";
import ProductListCard from "../../components/ProductListCard/ProductListCard";

import { useDispatch, useSelector } from "react-redux";
import { addProductOnWhistList, addToCartData, deleteSingleWhistListData, getAllProducts, getHomeData, getProductOnSubCategory, getSubCategoryData, productDetailData, totalFilterData, viewItemsInCartData } from "../../store/slice/api_integration";
import "./ProductList.css";
import ReactPaginate from "react-paginate";
import { DEFAULT_OPTIONS } from "../../utils/Constants";
import { parsePriceRange, parseRating } from "../../utils/PriceRange";
import { setViewCartItems } from "../../store/slice/cartSlice";
import { toggleModal } from "../../store/slice/modalSlice";

const ProductList = () => {
  const [expandedParent, setExpandedParent] = useState(false);
  // const [expandedChild, setExpandedChild] = useState({});
  // const [activeIndex, setActiveIndex] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [onLoadSubCategory, setOnLoadSubCategory] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { productList, totalFilterList, totalProductListCount = 0, subCategoryList } = useSelector((state) => state.product);
  const [page, setPage] = useState(0);  // Default page 0 (first page)
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [triggerSkuId, setTriggerSkuId] = useState(null);
  
  const searchParams = new URLSearchParams(location.search);
  const subcategory_id = searchParams.get('subcategory_id');
  const { user } = useSelector((state) => state.user);
  
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('category');
    const subcategory_id = searchParams.get('subcategory_id');
    const pageParam = parseInt(searchParams.get('page'), 10) || 1;
    setPage(pageParam - 1); // Set initial page based on URL
    
    const fetchProducts = async () => {
      setLoading(true);  // Show loader
      if (subcategory_id) {
        // const responseObj = { sub_category_id: subcategory_id, offset: ((pageParam - 1) * itemsPerPage) + 1, limit: itemsPerPage };
        const responseObj = { sub_category_id: subcategory_id, offset: ((pageParam - 1)) + 1, limit: itemsPerPage };
        handleClearFilters();
        await dispatch(totalFilterData(responseObj));
        await dispatch(getProductOnSubCategory(responseObj));
      } else {
        await dispatch(getAllProducts());
      }
      setLoading(false);  // Hide loader
    };
    const fetchCategory = () => {
      const responseObj = { category_id: categoryId };
      dispatch(getSubCategoryData(responseObj))
      const filteredSubCategory = subCategoryList?.filter(item => parseInt(item?.id, 10) === parseInt(subcategory_id, 10));
      setOnLoadSubCategory(filteredSubCategory)
    } 
    fetchProducts();
    fetchCategory();
  }, [location.search, itemsPerPage, dispatch]);
  
  const handleParentAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedParent(isExpanded ? panel : false);
  };

  const handleProductClick = (item) => {
    if(user.length === 0) {
      dispatch(toggleModal(true));
    } else {
      const responseObj = { 
        product_id: item.product_id,
      }
      dispatch(productDetailData(responseObj))
      navigate(`/product/${item.product_id}`, { state: { product: item } });
    }
  };

  const handleProcuctImageClick = (item) => {
    const responseObj = { 
      product_id: item.product_id,
    }
    dispatch(productDetailData(responseObj))
    navigate(`/product/${item.product_id}`, { state: { product: item } });
  }

  // Generate dropdown options based on total results
  const itemsPerPageOptions = DEFAULT_OPTIONS
      .filter(option => option <= totalProductListCount);

    const handleItemsPerPageChange = (e) => {
      const newItemsPerPage = parseInt(e.target.value, 10);
      setItemsPerPage(newItemsPerPage);
      setPage(0); // Reset to the first page
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', 1);
      searchParams.set('itemsPerPage', newItemsPerPage);
      navigate(`?${searchParams.toString()}`);
    };

    // Handle page change event (when user clicks next/previous)
    const handlePageChange = (data) => {
      const { selected } = data;
      // setPage(selected);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', selected + 1); // `react-paginate` uses 0-based index, we set to 1-based index in URL
      navigate(`?${searchParams.toString()}`); // Update the URL with the new page
    };

    // Calculate total pages based on total results
    const totalPages = Math.max(Math.ceil(totalProductListCount / itemsPerPage), 1);

    function convertToLowercase(text) {
      return text.toLowerCase();
    }
    // Apply Filter
    const handleFilterChange = async (e, filterLabel) => {
      let filterValue = e.target.value;
      // filterLabel = filterLabel.toLowerCase();
      // const updatedLabel = convertToLowercase(filterLabel);
      const updatedFilters = { ...selectedFilters, [filterLabel]: filterValue };
      
      const filters = {};
      if (updatedFilters.Color) filters.color = updatedFilters.Color;
      if (updatedFilters['Shoe Size']) filters.size = updatedFilters['Shoe Size'];
      if (updatedFilters.Price) filters.price = parsePriceRange(updatedFilters.Price);
      if (updatedFilters.Rating) filters.rating = parseRating(updatedFilters.Rating);

      // Dynamically handle any other filter keys
      Object.keys(updatedFilters).forEach((key) => {
        if (!['Color', 'Shoe Size', 'Price', 'Rating'].includes(key)) {
          filters[key.toLowerCase()] = updatedFilters[key];
        }
      });

      setSelectedFilters(updatedFilters);
      
      const searchParams = new URLSearchParams(location.search);
      const subcategory_id = searchParams.get('subcategory_id');
      const pageParam = parseInt(searchParams.get('page'), 10) || 1;

      const responseObj = {
        sub_category_id: subcategory_id,
        // offset: ((pageParam - 1) * itemsPerPage) + 1, 
        offset: ((pageParam - 1)) + 1, 
        limit: itemsPerPage,
        filters
      }
      setLoading(true);
      await dispatch(totalFilterData(responseObj));
      await dispatch(getProductOnSubCategory(responseObj));
      setLoading(false);
    }
    const handleClearFilters = async () => {
      setLoading(true);
      setSelectedFilters({});  // Reset selected filters
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('Color');
      searchParams.delete('Show Size');
      searchParams.delete('Rrice');
      searchParams.delete('Rating');
      // searchParams.delete("page");
      navigate(`?${searchParams.toString()}`);

      const subcategory_id = searchParams.get('subcategory_id');
      const pageParam = parseInt(searchParams.get('page'), 10) || 1;
      setPage(pageParam - 1);
      // const responseObj = { sub_category_id: subcategory_id, offset: ((pageParam - 1) * itemsPerPage) + 1, limit: itemsPerPage };
      const responseObj = { sub_category_id: subcategory_id, offset: ((pageParam - 1)) + 1, limit: itemsPerPage };
      await dispatch(getProductOnSubCategory(responseObj));
      setLoading(false);
    };
    
    useEffect(() => {
      // if (subCategoryList?.length === 0) {
        dispatch(getHomeData()); // Fetch home data, which includes `subCategoryList`
      // }
    }, [dispatch, subCategoryList])

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
      const subcategory_id = searchParams.get('subcategory_id');
      const pageParam = parseInt(searchParams.get('page'), 10) || 1;
      const responseListObj = { 
        sub_category_id: subcategory_id, 
        // offset: ((pageParam - 1) * itemsPerPage) + 1, 
        offset: ((pageParam - 1)) + 1, 
        limit: itemsPerPage 
      };
      dispatch(getProductOnSubCategory(responseListObj));
      dispatch(viewItemsInCartData());
      dispatch(setViewCartItems(null));
    };

    const handleWishlistToggle = (productData) => {
      if(user.length === 0) {
        dispatch(toggleModal(true));
        // setWishlistLoading(false);
        return;
      }
  
      const responseObj = { sku_id: Number(productData?.sku_id) }
      if(productData?.wishlistStatus?.toLowerCase() === 'no') {
        dispatch(addProductOnWhistList(responseObj)).finally(() => {
          fetchUpdatedProductList();
          // setWishlistLoading(false);
        })
      } else {
          dispatch(deleteSingleWhistListData(responseObj)).finally(() => {
            fetchUpdatedProductList();
            // setWishlistLoading(false);
          })
      }
    }
    
  return (
    <div className="productListing">
      <ProductSlider title={false} tile={7} />
      <div className="listPageCategoryItems">
        <CategorySlider subCategoryId={subcategory_id || onLoadSubCategory} />
      </div>
      <div className="prdWrapper">
      {totalFilterList && <div className="prdLeft">
          <div className="filterHeader">
            <h3>Filter</h3>
            <span onClick={handleClearFilters} className="clearFilterButton">clear Filter</span>
          </div>
          <div className="filterList">
            {totalFilterList && totalFilterList?.map((filter, index) => (
                <Accordion key={index} expanded={expandedParent === `panel-${index}`} onChange={handleParentAccordionChange(`panel-${index}`)}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${index}-content`} id={`panel-${index}-header`}>
                    <p>{filter.label}</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul className="sizeFilter">
                      {filter.values.map((value, valueIndex) => (
                        <li key={valueIndex}>
                          <label className="round">
                            <input 
                                type="radio" 
                                name={filter.label} 
                                value={value} 
                                checked={selectedFilters[filter.label] === value}
                                onChange={(e) => handleFilterChange(e, filter.label)}  />
                            <span>{value}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              ))}
          </div>
        </div>}
        {productList && <div className={totalFilterList ? 'prdRight ' : 'prdRight noFilter'}>
          <div className="productList">
            {loading ? (
              <div className="loadingContainer">
                <CircularProgress /> {/* Show loader */}
              </div>
            ) : (
              productList && productList.length > 0 ? (
                productList.map((item, index) => (
                  <div key={index}>
                    <ProductListCard
                      id={item.id}
                      image={item.imageUrl ? item.imageUrl : "/images/no-product-available.png"}
                      name={item.name || ""}
                      userrating={item.rating || "0.0"}
                      discountPrice={item.discountedPrice || ""}
                      originalPrice={item.price || ""}
                      save={item.save || ""}
                      coupenCode={item.coupen || ""}
                      deliveryTime={item.deliverytime || ""}
                      freeDelivery={item.freedelivery || ""}
                      bestSeller={item.bestseller || ""}
                      time={item.time || ""}
                      discountLabel={item.discountlabel || ""}
                      wishlistStatus={item.wishlistStatus || ''}
                      sku_id={item.sku_id} // Pass SKU ID for Add to Cart
                      // onAddToCart={() => handleAddToCartClick(item.sku_id)}
                      onAddToCart={() => handleProductClick(item)}
                      cartQuantity={Number(item.cartQuantity)}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      onProductClick={() => handleProductClick(item)}
                      onProductImageClick={() => handleProcuctImageClick(item)}
                      handleWishlistToggle={() => handleWishlistToggle(item)}
                    />
                  </div>
                ))
              ) : (
                <div className='noProductBoxes'>
                    <svg width="184" height="152" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg"><title>No data</title><g fill="none" fill-rule="evenodd"><g transform="translate(24 31.67)"><ellipse fill-opacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse><path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2"></path><path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#linearGradient-1)" transform="translate(13.56)"></path><path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7"></path><path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6"></path></g><path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6"></path><g transform="translate(149.65 15.383)" fill="#FFF"><ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse><path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path></g></g></svg>
                    <p className="noProductAvailable">No product available</p>
                </div>
              )
            )}
          </div>
          {productList.length > 0 && <div className='paginationBox'>
              {/* <div className="itemsPerPageDropdown">
                  <label>Items per page: </label>
                  <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                      {itemsPerPageOptions.map(option => (
                          <option key={option} value={option}>
                              {option}
                          </option>
                      ))}
                  </select>
              </div> */}
              {/* Pagination component */}
              <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={(ev) => handlePageChange(ev)}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  forcePage={page}  // Sync current page with URL
                  disabled={totalProductListCount === 0} 
              />
          </div>}
        </div>}
      </div>
    </div>
  );
};

export default ProductList;
