import React, { useEffect, useState } from 'react';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlogs, getAllBlogsCategory, getBlogsByCategory } from '../../store/slice/api_integration';
import { CircularProgress } from '@mui/material';
import { Helmet } from "react-helmet-async";
import './Blog.css';
import BlogCard from '../../components/BlogCard/BlogCard';

const Blog = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const { blogList, blogCategoryList } = useSelector(state => state.user);
    const { error } = useSelector(state => state.modal);
    const [categories, setCategories] = useState([]);
    const [parentCategoryName, setParentCategoryName] = useState("");
    
    console.log("blogCategoryList", blogCategoryList)
    console.log("error", error);
    useEffect(() => {
        setLoading(true);
        setParentCategoryName("");
        dispatch(getAllBlogsCategory())
        dispatch(getAllBlogs()).finally(() => {
            setLoading(false);
        });
    }, [dispatch])

    useEffect(() => {
        if (blogCategoryList?.length) {
            setCategories(blogCategoryList);
        }
    }, [blogCategoryList]);
    
    const handleBlogChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const currentUrl = window.location.href;
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://fikfis.co.uk/blog"
        },
        "headline": "FikFis Blog | Trends, Tips & Shopping Guides",
        "description": "Stay updated with the latest trends, shopping tips, and lifestyle guides on the FikFis Blog. Explore expert insights, fashion updates, and more!",
        "image": "https://fikfis.co.uk/images/icons/LOGO1.png",  
        "author": {
          "@type": "Organization",
          "name": "FikFis LTD"
        },  
        "publisher": {
          "@type": "Organization",
          "name": "",
          "logo": {
            "@type": "ImageObject",
            "url": "2025-03-06"
          }
        },
        "datePublished": ""
    }

    const fetchAllBlogs = () => {
        dispatch(getAllBlogs());
        setParentCategoryName("");
    }

    const getBlogByCategory = (category_id, category_name, subcategory_id) => {
        console.log("category_name", category_name);
        setParentCategoryName(category_name);
        // Move the clicked parent category to the top
        setCategories((prevCategories) => {
            const newCategories = [...prevCategories]; // Create a new array
            const index = newCategories.findIndex(cat => cat.category_id === category_id);
            if (index !== -1) {
                const [selectedCategory] = newCategories.splice(index, 1);
                return [selectedCategory, ...newCategories]; // Return reordered array
            }
            return newCategories;
        });
        
        const payload = { category_id: category_id };
        dispatch(getBlogsByCategory(payload)).finally(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };
  return (
    <div className='Blogs'>
        {/* SEO Meta Tags */}
        <Helmet>
            {blogList && blogList.length > 0 && <title>{blogList[0].blog_title}</title>}
            {blogList && blogList.length > 0 && <meta name="description" content={blogList[0].blog_description.replace(/<\/?[^>]+(>|$)/g, "")} />}
            {blogList && blogList.length > 0 && <meta name="keywords" content={blogList[0].blog_title} />}
            {/* <!-- Open Graph / Facebook --> */}
            {blogList && blogList.length > 0 && <meta property="og:title" content={blogList[0].blog_title} />}
            {blogList && blogList.length > 0 && <meta property="og:description" content={blogList[0].blog_description.replace(/<\/?[^>]+(>|$)/g, "")} />}
            {blogList && blogList.length > 0 && <meta property="og:image" content={blogList[0].blog_image} />}
            {/* <meta property="og:image" content={ '/images/icons/LOGO1.png'} /> */}
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content="article" />
            {/* <!-- Twitter --> */}
            <meta property="twitter:card" content="article" />
            <meta property="twitter:url" content={currentUrl} />
            {blogList && blogList.length > 0 && <meta property="twitter:title" content={blogList[0].blog_title} />}
            {blogList && blogList.length > 0 && <meta property="twitter:description" content={blogList[0].blog_description.replace(/<\/?[^>]+(>|$)/g, "")} />}
            {blogList && blogList.length > 0 && <meta property="twitter:image" content={blogList[0].blog_image} />}
            {/* <meta property="twitter:image" content={ '/images/icons/LOGO1.png'} /> */}
            <script type="application/ld+json">
                {JSON.stringify(schemaMarkup)}
            </script>
        </Helmet>
        {loading ? (
            <div className="loadingContainer">
                <CircularProgress />
            </div>
        ) : (
            <>
                <div className="blogsHeader">
                    <h2> {parentCategoryName ? `Blogs | ${parentCategoryName}` : 'All Blogs'}</h2>
                    {parentCategoryName ? <div onClick={() => fetchAllBlogs()} className='allBlogs'>All Blogs</div> : ""}
                </div>
                <div className="blogsList">
                    <div className="leftBlogContent">
                        <BlogCard card={blogList} />
                    </div>
                    <div className="rightBlogContent">
                        <div className="blogCategory">
                            <h4>Categories</h4>
                            <div className="blogCategoryList">
                                {categories?.map((category) => (
                                    <Accordion 
                                        key={category.category_id}
                                        expanded={expanded === category.category_id}
                                        onChange={handleBlogChange(category.category_id)}
                                    >
                                        <AccordionSummary
                                            expandIcon={expanded === category.category_id ? <RemoveIcon /> : <AddIcon />}
                                            aria-controls={`panel-${category.category_id}-content`}
                                            id={`panel-${category.category_id}-header`}
                                        >
                                            {category.category_name}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ul>
                                                {category.children && category.children.length > 0 ? (
                                                    JSON.parse(category.children).map((sub) => (
                                                        <li key={sub.id}>
                                                            <a 
                                                                onClick={() => getBlogByCategory(category.category_id, category.category_name, sub.id)}
                                                            >
                                                                {sub.category_name}
                                                            </a>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>No subcategory under {category.category_name} is available</li>
                                                )}
                                            </ul>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
  )
}

export default Blog