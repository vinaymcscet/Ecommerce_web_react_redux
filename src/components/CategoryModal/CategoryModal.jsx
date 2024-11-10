import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategoryModal } from "../../store/slice/modalSlice";
import ProductCard from "../ProductCard/ProductCard";
import { getProductOnSubCategory } from "../../store/slice/api_integration";
import "./CategoryModal.css";
import { useNavigate } from "react-router-dom";

const CategoryModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCategoryModalOpen, category_name } = useSelector(
    (state) => state.modal
  );
  const { subCategoryList } = useSelector(
    (state) => state.product
  );

  if (!isCategoryModalOpen) return null;

  const closeModal = () => {
    dispatch(toggleCategoryModal(false));
  };
  const handleClick = (item) => {
    const responseObj = {sub_category_id: item.id}
    dispatch(getProductOnSubCategory(responseObj));
    navigate(`/productlist?subcategory_id=${item.id}`);
  }
  return (
    <div className="categoryModal">
      <div className="modalBackdrop">
        <div className="modalContent">
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
                    imgSrc={slide.category_image || '/images/no-product-available.jpg'}
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
