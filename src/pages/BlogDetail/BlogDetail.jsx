import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./BlogDetail.css";
import { BlogCategoryList, BlogsList } from "../../utils/BlogsList";
import Button from "../../components/Button/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// import Button from '@mui/material/Button';

const BlogDetail = () => {
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
  const { id } = useParams();
  const blog = BlogsList.find((blog) => blog.id === parseInt(id));
  if (!blog) return <div>Blog not found</div>;

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
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("Form data:", formData);
    }
  };

  const handleBlogChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="Blogs detail">
      <div className="blogsHeader">
        <h2>Blogs</h2>
        <div className="category">
          <select>
            <option>Select Category</option>
            <option>Category 1</option>
            <option>Category 2</option>
            <option>Category 3</option>
          </select>
        </div>
      </div>
      <div className="blogContent">
        <div className="leftBlogContent">
          <img src={blog.images} alt="Blog Details" />
          <h4>{blog.heading}</h4>
          <p>{blog.description}</p>
          <h6>{blog.detailQuote}</h6>
          <p>{blog.description}</p>
          <div className="blogsection">
            <img src={blog.images} alt="additional-blog-details" />
            <img src={blog.images} alt="additional-blog-details" />
          </div>
          <p>{blog.description}</p>
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
            <div className="commentItem">
              <div className="leftComment">
                <img src="/images/blogs/blog-user.svg" alt="Blog User" />
              </div>
              <div className="rightComment">
                <div className="name">Cooper, Kristin</div>
                <div className="commentDesc">
                  aku kulit kombinasi T-Zone ya.. pakai ini baru 3hari panas
                  bgt, lama² gatel, trs bruntusan. sedih pakai ini baru 3hari
                  panas bgt, lama² gatel, trs bruntusan. sedih
                </div>
              </div>
            </div>
            <div className="commentItem">
              <div className="leftComment">
                <img src="/images/blogs/blog-user.svg" alt="Blog User" />
              </div>
              <div className="rightComment">
                <div className="name">Cooper, Kristin</div>
                <div className="commentDesc">
                  aku kulit kombinasi T-Zone ya.. pakai ini baru 3hari panas
                  bgt, lama² gatel, trs bruntusan. sedih pakai ini baru 3hari
                  panas bgt, lama² gatel, trs bruntusan. sedih
                </div>
              </div>
            </div>
            <div className="commentItem">
              <div className="leftComment">
                <img src="/images/blogs/blog-user.svg" alt="Blog User" />
              </div>
              <div className="rightComment">
                <div className="name">Cooper, Kristin</div>
                <div className="commentDesc">
                  aku kulit kombinasi T-Zone ya.. pakai ini baru 3hari panas
                  bgt, lama² gatel, trs bruntusan. sedih pakai ini baru 3hari
                  panas bgt, lama² gatel, trs bruntusan. sedih
                </div>
              </div>
            </div>
            <div className="commentItem">
              <div className="leftComment">
                <img src="/images/blogs/blog-user.svg" alt="Blog User" />
              </div>
              <div className="rightComment">
                <div className="name">Cooper, Kristin</div>
                <div className="commentDesc">
                  aku kulit kombinasi T-Zone ya.. pakai ini baru 3hari panas
                  bgt, lama² gatel, trs bruntusan. sedih pakai ini baru 3hari
                  panas bgt, lama² gatel, trs bruntusan. sedih
                </div>
              </div>
            </div>
            <div className="commentItem">
              <div className="leftComment">
                <img src="/images/blogs/blog-user.svg" alt="Blog User" />
              </div>
              <div className="rightComment">
                <div className="name">Cooper, Kristin</div>
                <div className="commentDesc">
                  aku kulit kombinasi T-Zone ya.. pakai ini baru 3hari panas
                  bgt, lama² gatel, trs bruntusan. sedih pakai ini baru 3hari
                  panas bgt, lama² gatel, trs bruntusan. sedih
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rightBlogContent">
          <div className="blogCategory">
            <h4>Categories</h4>
            <div className="blogCategoryList">
              {BlogCategoryList.map((category) => (
                <Accordion 
                  key={category.id}
                  expanded={expanded === category.id}
                  onChange={handleBlogChange(category.id)}
                  >
                  <AccordionSummary
                    expandIcon={
                      expanded === category.id ? <RemoveIcon /> : <AddIcon />
                    }
                    aria-controls={`panel-${category.id}-content`}
                    id={`panel-${category.id}-header`}
                  >
                    {category.name}
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {category.subcategory.map((sub) => (
                        <li key={sub.id}>{sub.name}</li>
                      ))}
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
