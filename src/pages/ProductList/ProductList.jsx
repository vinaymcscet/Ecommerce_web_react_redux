import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";

import ProductSlider from "../../components/ProductSlider/ProductSlider";
import CategorySlider from "../../components/CategorySlider/CategorySlider";
import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { productList } from "../../utils/ProductData";
import {
  colors,
  mainProductFilterList,
  priceOptions,
  ratingOptions,
  sizeOptions,
} from "../../utils/CommonUtils";
import "./ProductList.css";

const ProductList = () => {
  const [expandedParent, setExpandedParent] = useState(false);
  const [expandedChild, setExpandedChild] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);

  const navigate = useNavigate();

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const handleParentAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedParent(isExpanded ? panel : false);
  };

  const handleChildAccordionChange =
    (parentId, subPanel) => (event, isExpanded) => {
      setExpandedChild((prevState) => ({
        ...prevState,
        [parentId]: isExpanded ? subPanel : false,
      }));
    };

  const renderIcon = (isExpanded) => {
    return isExpanded ? <RemoveIcon /> : <AddIcon />;
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item.id}`, { state: { product: item } });
  };

  return (
    <div className="productListing">
      <ProductSlider title={false} tile={10} />
      <CategorySlider />
      <div className="prdWrapper">
        <div className="prdLeft">
          <div className="filterHeader">
            <h3>Filter</h3>
            <span>clear Filter</span>
          </div>
          <div className="filterList">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${"01"}-content`}
                id={`panel-${"01"}-header`}
              >
                Category
              </AccordionSummary>
              <AccordionDetails>
                {mainProductFilterList.map((category) => (
                  <Accordion
                    key={category.id}
                    expanded={expandedParent === `panel-${category.id}`}
                    onChange={handleParentAccordionChange(
                      `panel-${category.id}`
                    )}
                  >
                    <AccordionSummary
                      expandIcon={renderIcon(
                        expandedParent === `panel-${category.id}`
                      )}
                      aria-controls={`panel-${category.id}-content`}
                      id={`panel-${category.id}-header`}
                    >
                      <p>{category.name}</p>
                    </AccordionSummary>
                    <AccordionDetails>
                      {category.subProduct.map((subProduct) => (
                        <Accordion
                          key={subProduct.id}
                          expanded={
                            expandedChild[category.id] ===
                            `subpanel-${subProduct.id}`
                          }
                          onChange={handleChildAccordionChange(
                            category.id,
                            `subpanel-${subProduct.id}`
                          )} // Maintain child accordion state separately
                        >
                          <AccordionSummary
                            expandIcon={renderIcon(
                              expandedChild[category.id] ===
                                `subpanel-${subProduct.id}`
                            )}
                            aria-controls={`subpanel-${subProduct.id}-content`}
                            className="subpanel"
                            id={`subpanel-${subProduct.id}-header`}
                          >
                            <p>{subProduct.name}</p>
                          </AccordionSummary>
                          <AccordionDetails>
                            <ul>
                              {subProduct.innerProduct.map((inner) => (
                                <li key={inner.id}>{inner.name}</li>
                              ))}
                            </ul>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${"02"}-content`}
                id={`panel-${"02"}-header`}
              >
                Size
              </AccordionSummary>
              <AccordionDetails>
                <ul className="sizeFilter">
                  {sizeOptions.map((size) => (
                    <li key={size.id}>
                      <label className="round">
                        <input type="radio" name="size" value={size.label} />
                        <span>{size.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${"03"}-content`}
                id={`panel-${"03"}-header`}
              >
                Price
              </AccordionSummary>
              <AccordionDetails>
                <ul className="sizeFilter price">
                  {priceOptions.map((size) => (
                    <li key={size.id}>
                      <label className="round">
                        <input type="radio" name="size" value={size.label} />
                        <span>{size.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="customPrice">
                  <input type="text" placeholder="$ Min." name="min" />
                  <input type="text" placeholder="$ Max." name="max" />
                  <button type="button">Go</button>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${"04"}-content`}
                id={`panel-${"04"}-header`}
              >
                Customer Rating
              </AccordionSummary>
              <AccordionDetails>
              <ul className="sizeFilter price">
                  {ratingOptions.map((size) => (
                    <li key={size.id}>
                      <label className="round">
                        <input type="radio" name="size" value={size.label} />
                        <span>{size.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${"05"}-content`}
                id={`panel-${"05"}-header`}
              >
                Color
              </AccordionSummary>
              <AccordionDetails>
                <ul className="colorPalette">
                  {colors.map((color, index) => (
                    <li
                      key={index}
                      className={index === activeIndex ? "active" : ""}
                      onClick={() => handleClick(index)}
                    >
                      <img src={color} alt={`color-palette-${index + 1}`} />
                    </li>
                  ))}
                </ul>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
        <div className="prdRight">
          <div className="productList">
            {productList.map((item, index) => {
              return (
                <div key={index} onClick={() => handleProductClick(item)}>
                  <ProductListCard
                    id={item.id}
                    image={item.image ? item.image : ""}
                    name={item.name ? item.name : ""}
                    userrating={item.rating ? item.rating : ""}
                    discountPrice={item.discount ? item.discount : ""}
                    originalPrice={item.original ? item.original : ""}
                    save={item.save ? item.save : ""}
                    coupenCode={item.coupen ? item.coupen : ""}
                    deliveryTime={item.deliverytime ? item.deliverytime : ""}
                    freeDelivery={item.freedelivery ? item.freedelivery : ""}
                    bestSeller={item.bestseller ? item.bestseller : ""}
                    time={item.time ? item.time : ""}
                    discountLabel={item.discountlabel ? item.discountlabel : ""}
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

export default ProductList;
