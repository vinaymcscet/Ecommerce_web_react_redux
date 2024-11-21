import React, { useEffect, useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation, useNavigate } from "react-router-dom";

import ProductSlider from "../../components/ProductSlider/ProductSlider";
import CategorySlider from "../../components/CategorySlider/CategorySlider";
import ProductListCard from "../../components/ProductListCard/ProductListCard";

import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getHomeData, getProductOnSubCategory, productDetailData, totalFilterData } from "../../store/slice/api_integration";
import "./ProductList.css";
import ReactPaginate from "react-paginate";
import { DEFAULT_OPTIONS } from "../../utils/Constants";
import { parsePriceRange, parseRating } from "../../utils/PriceRange";

const ProductList = () => {
  const [expandedParent, setExpandedParent] = useState(false);
  // const [expandedChild, setExpandedChild] = useState({});
  // const [activeIndex, setActiveIndex] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { productList, totalFilterList, totalProductListCount = 0 } = useSelector((state) => state.product);
  const [page, setPage] = useState(0);  // Default page 0 (first page)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  console.log("productList", productList);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subcategory_id = searchParams.get('subcategory_id');
    const pageParam = parseInt(searchParams.get('page'), 10) || 1;
    setPage(pageParam - 1); // Set initial page based on URL
    
    const fetchProducts = async () => {
      setLoading(true);  // Show loader
      if (subcategory_id) {
        const responseObj = { sub_category_id: subcategory_id, offset: ((pageParam - 1) * itemsPerPage) + 1, limit: itemsPerPage };
        handleClearFilters();
        await dispatch(totalFilterData(responseObj));
        await dispatch(getProductOnSubCategory(responseObj));
      } else {
        await dispatch(getAllProducts());
      }
      setLoading(false);  // Hide loader
    };

    fetchProducts();
  }, [location.search, itemsPerPage, dispatch]);

  const handleParentAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedParent(isExpanded ? panel : false);
  };

  const handleProductClick = (item) => {
    console.log("item", item);
    const responseObj = { product_id: item.product_id }
    dispatch(productDetailData(responseObj))
    navigate(`/product/${item.product_id}`, { state: { product: item } });
  };

  // Generate dropdown options based on total results
  const itemsPerPageOptions = DEFAULT_OPTIONS
      .filter(option => option <= totalProductListCount);
    console.log("itemsperpageoption", itemsPerPageOptions);

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
      console.log('Page Changed: ', data);
      const { selected } = data;
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
      console.log("updated filter value", e.target.value, filterLabel);
      let filterValue = e.target.value;
      // filterLabel = filterLabel.toLowerCase();
      // const updatedLabel = convertToLowercase(filterLabel);
      const updatedFilters = { ...selectedFilters, [filterLabel]: filterValue };
      setSelectedFilters(updatedFilters);
      console.log("updatedFilters['Shoe Size']", updatedFilters['Shoe Size']);
      
      const filters = {};
      if (updatedFilters.Color) filters.color = updatedFilters.Color;
      if (updatedFilters['Shoe Size']) filters.size = updatedFilters['Shoe Size'];;
      if (updatedFilters.Price) filters.price = parsePriceRange(updatedFilters.Price);
      if (updatedFilters.Rating) filters.rating = parseRating(updatedFilters.Rating);
      
      const searchParams = new URLSearchParams(location.search);
      const subcategory_id = searchParams.get('subcategory_id');
      const pageParam = parseInt(searchParams.get('page'), 10) || 1;

      const responseObj = {
        sub_category_id: subcategory_id,
        offset: ((pageParam - 1) * itemsPerPage) + 1, 
        limit: itemsPerPage,
        filters
      }
      setLoading(true);
      console.log("Updated response object:", responseObj);
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
      navigate(`?${searchParams.toString()}`);

      const subcategory_id = searchParams.get('subcategory_id');
      const pageParam = parseInt(searchParams.get('page'), 10) || 1;
      setPage(pageParam - 1);
      const responseObj = { sub_category_id: subcategory_id, offset: ((pageParam - 1) * itemsPerPage) + 1, limit: itemsPerPage };
      await dispatch(getProductOnSubCategory(responseObj));
      setLoading(false);
    };
    useEffect(() => {
      dispatch(getHomeData())
    }, [])
  return (
    <div className="productListing">
      <ProductSlider title={false} tile={7} />
      <div className="listPageCategoryItems">
        <CategorySlider />
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
          {productList.length > 0 && <div className='paginationBox'>
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
          <div className="productList">
            {loading ? (
              <div className="loadingContainer">
                <CircularProgress /> {/* Show loader */}
              </div>
            ) : (
              productList && productList.length > 0 ? (
                productList.map((item, index) => (
                  <div key={index} onClick={() => handleProductClick(item)}>
                    <ProductListCard
                      id={item.id}
                      image={item.imageUrl ? item.imageUrl : "/images/no-product-available.jpg"}
                      name={item.name || ""}
                      userrating={item.rating || ""}
                      discountPrice={item.discountedPrice || ""}
                      originalPrice={item.price || ""}
                      save={item.save || ""}
                      coupenCode={item.coupen || ""}
                      deliveryTime={item.deliverytime || ""}
                      freeDelivery={item.freedelivery || ""}
                      bestSeller={item.bestseller || ""}
                      time={item.time || ""}
                      discountLabel={item.discountlabel || ""}
                      wishlistStatus={item.wishlistStatus || 'no'}
                    />
                  </div>
                ))
              ) : (
                <p className="noProductAvailable">No product available</p>
              )
            )}
          </div>
        </div>}
      </div>
    </div>
  );
};

export default ProductList;
