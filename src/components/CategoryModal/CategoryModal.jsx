import React, { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategoryModal } from "../../store/slice/modalSlice";
import ProductCard from "../ProductCard/ProductCard";
import { getProductOnSubCategory, totalFilterData } from "../../store/slice/api_integration";
import "./CategoryModal.css";
import { useNavigate } from "react-router-dom";

const CategoryModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalRef = useRef(null); // Reference for modal content
  const { isCategoryModalOpen, category_name } = useSelector(
    (state) => state.modal
  );
  const { subCategoryList } = useSelector(
    (state) => state.product
  );
  
  const handleClickOutside = (event) => {
    // Close the modal if the click is outside the modal content
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  const closeModal = () => {
    dispatch(toggleCategoryModal(false));
  };
  useEffect(() => {
    // Add event listener to detect clicks outside the modal
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isCategoryModalOpen) return null;

  const handleClick = (item) => {
    const responseObj = {
      sub_category_id: item.id, 
      offset: 1, 
      limit: 10
    }
    dispatch(getProductOnSubCategory(responseObj));
    // const filterResponse = {sub_category_id: item.id}
    navigate(`/productlist?subcategory_id=${item.id}`);
  }

  return (
    <div className="categoryModal">
      <div className="modalBackdrop">
        <div className="modalContent" ref={modalRef}>
          <div className="close" onClick={() => closeModal()}>
            <CloseIcon />
          </div>
          <div className="allCategory">
            <h3>{category_name}</h3>
          </div>
          <div className="categoryList">
            {subCategoryList?.map((slide) => {
              return (
                <div key={slide.id}>
                  <ProductCard
                    imgSrc={slide.category_image || '/images/no-product-available.png'}
                    imgName={slide.name}
                    handleCategory={() => handleClick(slide)}
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

export default CategoryModal;
