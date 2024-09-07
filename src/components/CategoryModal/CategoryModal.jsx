import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategoryModal } from "../../store/slice/modalSlice";
import ProductCard from "../ProductCard/ProductCard";
import "./CategoryModal.css";

const CategoryModal = () => {
  const dispatch = useDispatch();
  const { isCategoryModalOpen, selectedCategory } = useSelector(
    (state) => state.modal
  );
  if (!isCategoryModalOpen) return null;
  console.log(selectedCategory);

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
            <h3>{selectedCategory.PrdName}</h3>
          </div>
          <div className="categoryList">
            {selectedCategory.subcategory.map((slide, index) => {
              return (
                <div key={index}>
                  <ProductCard
                    imgSrc={slide.img}
                    imgName={slide.PrdName}
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
