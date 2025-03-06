import React, { useEffect, useState } from 'react';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlogs, getAllBlogsCategory } from '../../store/slice/api_integration';
import { CircularProgress } from '@mui/material';
import { Helmet } from "react-helmet-async";
import './Blog.css';
import BlogCard from '../../components/BlogCard/BlogCard';

const Blog = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const { blogList, blogCategoryList } = useSelector(state => state.user);
    
    useEffect(() => {
        setLoading(true);
        dispatch(getAllBlogsCategory());
        dispatch(getAllBlogs()).finally(() => {
            setLoading(false);
        });
    }, [])
    
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
                    <h2>Blogs</h2>
                </div>
                <div className="blogsList">
                    <div className="leftBlogContent">
                        <BlogCard card={blogList} />
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
            </>
        )}
    </div>
  )
}

export default Blog