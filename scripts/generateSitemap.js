const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { SitemapStream, streamToPromise } = require("sitemap");

// 🚀 Define your base URL
const BASE_URL = "https://fikfis.co.uk";
const API_BASE_URL = "https://gateway.fikfis.co.uk";

// 🚀 Define static pages
const staticPages = [
  "/",
  "/about",
  "/blog",
  "/terms-condition",
  "/privacy-policy",
  "/disclaimer",
  "/faq",
  "/contact",
  "/productlist",
  "/cart",
  "/userprofile",
  "/search",
];

// 🚀 Fetch dynamic pages from API (like blog & product pages)
const fetchDynamicPages = async () => {
  try {
    const blogResponse = await axios.get(`${API_BASE_URL}/blog/getBlogs`);
    
    const blogUrls = blogResponse.data.map((blog) => `/blog/${blog.blog_id}`);
    const productUrls = productResponse.data.map(
      (product) => `/product/${product.id}`
    );

    return [...blogUrls];
  } catch (error) {
    console.error("Error fetching dynamic URLs:", error);
    return [];
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/homeData`);
    return response.data?.homePage?.categories?.map((cat) => cat.id) || [];
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return [];
  }
};
// 🚀 Fetch Subcategories
const fetchSubcategories = async (categoryIds) => {
    let subcategoryIds = [];
    for (const categoryId of categoryIds) {
        try {
        const response = await axios.get(
            `${API_BASE_URL}/category?category_id=${categoryId}`
        );
        const subcategories = response.data?.subcategories || [];
        subcategoryIds = [...subcategoryIds, ...subcategories.map((sub) => sub.id)];
        } catch (error) {
        console.error(`❌ Error fetching subcategories for ${categoryId}:`, error);
        }
    }
    return subcategoryIds;
};
// 🚀 Fetch Products
const fetchProducts = async (subcategoryIds) => {
    let productIds = [];
    for (const subcategoryId of subcategoryIds) {
        try {
        const response = await axios.post("https://gateway.fikfis.co.uk/product", {
            sub_category_id: subcategoryId,
            offset: 0,
            limit: 50, // Adjust the limit as needed
        });
        productIds = [...productIds, ...response.data.map((prod) => prod.product_id)];
        } catch (error) {
        console.error(`❌ Error fetching products for ${subcategoryId}:`, error);
        }
    }
    return productIds;
};
// 🚀 Fetch Section Details from `homeSection` → `getSection`
const fetchSections = async () => {
    let sectionDetails = [];
    try {
        const response = await axios.get("https://gateway.fikfis.co.uk/homeSection");
        const groupIds = response.data?.data?.map((item) => item.group_id) || [];

        for (const groupId of groupIds) {
        try {
            const sectionResponse = await axios.post("https://gateway.fikfis.co.uk/getSection", {
            group_id: groupId,
            offset: 1,
            limit: 30,
            });
            const sections = sectionResponse.data?.sectionDetail || [];
            sectionDetails = [...sectionDetails, ...sections.map((sec) => sec.id)];
        } catch (error) {
            console.error(`❌ Error fetching sections for group_id ${groupId}:`, error);
        }
        }
    } catch (error) {
        console.error("❌ Error fetching homeSection:", error);
    }
    return sectionDetails;
};

// 🚀 Generate Sitemap
const generateSitemap = async () => {
  const sitemapStream = new SitemapStream({ hostname: BASE_URL });
  const categoryIds = await fetchCategories();
  const subcategoryIds = await fetchSubcategories(categoryIds);
  const productIds = await fetchProducts(subcategoryIds);
  const sectionIds = await fetchSections();

  // Generate URLs for categories, subcategories, and products
  const categoryUrls = categoryIds.map((id) => `/category/${id}`);
  const subcategoryUrls = subcategoryIds.map((id) => `/subcategory/${id}`);
  const productUrls = productIds.map((id) => `/product/${id}`);
  const sectionUrls = sectionIds.map((id) => `/sectionDetail/${id}`);

  const allPages = [...staticPages, ...(await fetchDynamicPages()), ...categoryUrls, ...subcategoryUrls, ...productUrls, ...sectionUrls];

  allPages.forEach((url) => {
    sitemapStream.write({ url, changefreq: "daily", priority: 0.8 });
  });

  sitemapStream.end();

  const sitemapXML = await streamToPromise(sitemapStream).then((data) =>
    data.toString()
  );

  // Write the sitemap file
  fs.writeFileSync(
    path.resolve(__dirname, "../public/sitemap.xml"),
    sitemapXML
  );

  console.log("✅ Sitemap generated successfully!");
};

generateSitemap();
