import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogCategoryList, BlogsList } from "../../utils/BlogsList";
import Button from "../../components/Button/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from "react-redux";
import { addBlogReviewData, getAllBlogsCategory, getBlogDetailData } from "../../store/slice/api_integration";
import "./BlogDetail.css";
import { FormatDateTime, formatDateTimeProduct } from "../../utils/FormatDateTime";

// import Button from '@mui/material/Button';

const BlogDetail = () => {
  const dispatch = useDispatch();
  const { blogCategoryList, blogDetail } = useSelector(state => state.user);

  const { id } = useParams();
  // const blog = BlogsList.find((blog) => blog.id === parseInt(id));
  // if (!blog) return <div>Blog not found</div>;
  
  useEffect(() => {
    dispatch(getAllBlogsCategory());
    dispatch(getBlogDetailData(id));
  }, [])

  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    review: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    review: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required.";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
      isValid = false;
    }

    if (!formData.review) {
      newErrors.review = "Review is required.";
      isValid = false;
    } else if (formData.review.length < 10) {
      newErrors.review = "Review must be at least 10 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const responseObj = {
        blog_id: id,
        full_name: formData.fullName, 
        review_text: formData.review,
        reviewer_email: formData.email
      }
      dispatch(addBlogReviewData(responseObj)).finally(() => {
        dispatch(getBlogDetailData(id));
      })
      setFormData({
        fullName: "",
        email: "",
        review: "",
      })
    }
  };

  const handleBlogChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  return (
    <div className="Blogs detail">
      <div className="blogsHeader">
        <h2>Blogs</h2>
      </div>
      <div className="blogContent">
        <div className="leftBlogContent">
        {blogDetail && blogDetail[0] ? (
          <>
            <img src={blogDetail[0].blog_image} alt={blogDetail[0].blog_title} />
            <h4>{blogDetail[0].blog_title}</h4>
            <p>{blogDetail[0].blog_description}</p>
            <h6>{blogDetail[0].slug}</h6>
            <p>Category: <span>{blogDetail[0].parent_category_name}</span></p>
            <p>Sub-category: <span>{blogDetail[0].category_name}</span></p>
            <div className="date">{formatDateTimeProduct(blogDetail[0].blog_created_at).formattedDate} {formatDateTimeProduct(blogDetail[0].blog_created_at).time}</div>
          
            <div className="blogReviewForm">
              <h4>Write Your Review</h4>
              <div className="reviewForm">
                <form onSubmit={handleSubmit}>
                  <div className="box">
                    <div className="form-control">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                      {errors.fullName && (
                        <p className="error">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="form-control">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="box full">
                    <div className="form-control">
                      <textarea
                        cols="10"
                        name="review"
                        placeholder="Write Your Review"
                        value={formData.review}
                        onChange={handleChange}
                      ></textarea>
                      {errors.review && <p className="error">{errors.review}</p>}
                    </div>
                  </div>
                  <Button
                    type={"submit"}
                    value={"submit"}
                    varient="explore review"
                    space="sp-10"
                  />
                </form>
              </div>
            </div>
            <div className="commentLists">
            {blogDetail[0]?.reviews &&
                JSON.parse(blogDetail[0]?.reviews).map((sub) => (
                <div className="commentItem">
                  <div className="leftComment">
                    <img src={sub.reviewer_image} alt={sub.full_name} />
                  </div>
                  <div className="rightComment">
                    <div className="name">{sub.full_name}</div>
                    <div className="name">{sub.reviewer_email}</div>
                    <div className="commentDesc">{sub.review_text}</div>
                    <div className="commentDesc">{FormatDateTime(sub.created_at)}</div>
                  </div>
                </div>
            ))}
          </div>
          </>
        ) : (
          <p>Loading blog details...</p>
        )}
        </div>
        <div className="rightBlogContent">
          <div className="blogCategory">
            <h4>Categories</h4>
            <div className="blogCategoryList">
              {blogCategoryList?.map((category) => (
                <Accordion 
                  key={category.id}
                  expanded={expanded === category.category_id}
                  onChange={handleBlogChange(category.category_id)}
                  >
                  <AccordionSummary
                    expandIcon={
                      expanded === category.category_id ? <RemoveIcon /> : <AddIcon />
                    }
                    aria-controls={`panel-${category.category_id}-content`}
                    id={`panel-${category.category_id}-header`}
                  >
                    {category.category_name}
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                    {category?.children &&
                        JSON.parse(category?.children).map((sub) => (
                        <li key={sub.category_id}>{sub.category_name}</li>
                    ))}
                    {!category?.children && 
                      <li>{`No subcategory under ${category?.category_name} is available`}</li>
                    }
                    </ul>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
