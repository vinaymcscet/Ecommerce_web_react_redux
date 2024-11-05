import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategoryModal } from "../../store/slice/modalSlice";
import ProductCard from "../ProductCard/ProductCard";
import "./CategoryModal.css";

const CategoryModal = () => {
  const dispatch = useDispatch();
  
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
