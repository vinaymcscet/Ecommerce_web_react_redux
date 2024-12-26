import React, { useEffect, useState } from 'react';
import './SectionDetail.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartData, getAllOffersData, getProductSection, productDetailData, viewItemsInCartData } from '../../store/slice/api_integration';
import ProductListCard from '../../components/ProductListCard/ProductListCard';
import { CircularProgress } from '@mui/material';
import ReactPaginate from 'react-paginate';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import { formatDate } from '../../utils/FormatDateTime';
import { setViewCartItems } from '../../store/slice/cartSlice';

const SectionDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Always define useLocation inside the functional component
    const [loading, setLoading] = useState(false);
    const { productSectionData, productSectionCount = 0, allOffersList } = useSelector(state => state.product);
    const { id } = useParams();
    const [triggerSkuId, setTriggerSkuId] = useState(null);

    const queryParams = new URLSearchParams(location.search); // Initialize queryParams here
    const title = queryParams.get("title");

    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);

    useEffect(() => {
        const pageParam = parseInt(queryParams.get("sectionPage"), 10) || 1;
        const itemsPerPageParam = parseInt(queryParams.get("sectionItemsPerPage"), 10) || itemsPerPage;

        setPage(pageParam - 1); // Adjust for 0-based indexing
        setItemsPerPage(itemsPerPageParam);

        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;

        const fetchData = async () => {
            setLoading(true);
            if (Number(id) === 0) {
                const responseObj = { offset, limit };
                await dispatch(getAllOffersData(responseObj));
            } else {
                const responseObj = { group_id: id, offset, limit };
                await dispatch(getProductSection(responseObj));
            }
            setLoading(false);
        };
    
        fetchData();
    }, [location.search, dispatch, id]);

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        queryParams.set("sectionPage", 1); // Reset to page 1
        queryParams.set("sectionItemsPerPage", newItemsPerPage);
        navigate(`?${queryParams.toString()}`);
    };

    const handlePageChange = (data) => {
        const { selected } = data;
        queryParams.set("sectionPage", selected + 1); // Convert to 1-based indexing
        navigate(`?${queryParams.toString()}`);
    };

    const handleProductClick = (product) => {
        const responseObj = { product_id: product.product_id };
        dispatch(productDetailData(responseObj));
        navigate(`/product/${product.product_id}`, { state: { product } });
    };

    const sectionItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= productSectionCount);

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
        const pageParam = parseInt(queryParams.get("sectionPage"), 10) || 1;
        const itemsPerPageParam = parseInt(queryParams.get("sectionItemsPerPage"), 10) || itemsPerPage;
        setPage(pageParam - 1); // Adjust for 0-based indexing
        setItemsPerPage(itemsPerPageParam);

        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;
        const responseObj = { group_id: id, offset, limit };
        dispatch(getProductSection(responseObj));
        dispatch(viewItemsInCartData());
        dispatch(setViewCartItems(null));
    };
    return (
        <div className="sectionDetail">
            {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : Number(id) === 0 && allOffersList && allOffersList.length > 0 ? (
                <div className="productHistory">
                    <div className="browisingHistory">
                        <h3>{title}</h3>
                        <div className="paginationBox">
                            <div className="itemsPerPageDropdown">
                                <label>Items per page: </label>
                                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                    {sectionItemsPerPageOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                pageCount={Math.max(Math.ceil(productSectionCount / itemsPerPage), 1)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageChange}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                forcePage={page}
                                disabled={productSectionCount === 0}
                            />
                        </div>
                    </div>
                    <div className="productList">
                        {allOffersList.map((item, index) => (
                            <div key={index}>
                                <ProductListCard
                                    id={item?.categoryId}
                                    image={item?.categoryImage || "/images/no-product-available.png"}
                                    name={item?.categoryName}
                                    discountLabel={item?.title}
                                    time={`valid till ${formatDate(item.validTill)}`}
                                    wishlistStatus={item.wishlistStatus || 'no'}
                                    offer={"true"}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : productSectionData && productSectionData.length > 0 && (
                <div className="productHistory">
                    <div className="browisingHistory">
                        <h3>{title}</h3>
                        <div className="paginationBox">
                            <div className="itemsPerPageDropdown">
                                <label>Items per page: </label>
                                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                    {sectionItemsPerPageOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                pageCount={Math.max(Math.ceil(productSectionCount / itemsPerPage), 1)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageChange}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                forcePage={page}
                                disabled={productSectionCount === 0}
                            />
                        </div>
                    </div>
                    <div className="productList">
                        {productSectionData.map((product, index) => (
                            <div key={index}>
                                <ProductListCard
                                    id={product?.group_id}
                                    image={product.imageUrl || "/images/no-product-available.png"}
                                    name={product.name || ""}
                                    userrating={product.rating || "0.0"}
                                    discountPrice={product.discountedPrice || ""}
                                    originalPrice={product.price || ""}
                                    save={product.offer || ""}
                                    coupenCode={product.coupen || ""}
                                    deliveryTime={product.deliverytime || ""}
                                    freeDelivery={product.freedelivery || ""}
                                    bestSeller={product.bestseller || ""}
                                    time={product.time || ""}
                                    discountLabel={product.offer || ""}
                                    wishlistStatus={product.wishlistStatus || 'no'}
                                    sku_id={product.sku_id} // Pass SKU ID for Add to Cart
                                    // onAddToCart={() => handleAddToCartClick(product.sku_id)}
                                    onAddToCart={() => handleProductClick(product)}
                                    cartQuantity={Number(product.cartQuantity)}
                                    onIncrement={handleIncrement}
                                    onDecrement={handleDecrement}
                                    onProductClick={() => handleProductClick(product)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
    
};

export default SectionDetail;
