// import Generator from "react-router-sitemap-generator";
// import RoutePage from "../Routes/RoutePage";

// const generator = new Generator(
//   "https://fikfis.co.uk/",
//   RoutePage(),
//   {
//     lastmod: new Date().toISOString().slice(0, 10),
//     changefreq: "monthly",
//     priority: 0.8,
//   }
// );
// generator.save("public/sitemap.xml");
const sitemap = require('sitemap');
const path = require("path");
const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require('fs');
const hostName = 'https://fikfis.co.uk/';

const urls = [
  { url: '/', changefreq: 'daily', priority: 1 },
  { url: '/sectionDetail/:id', changefreq: 'monthly', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/blog', changefreq: 'monthly', priority: 0.8 },
  { url: '/blog/:id', changefreq: 'monthly', priority: 0.8 },
  { url: '/terms-condition', changefreq: 'monthly', priority: 0.8 },
  { url: '/privacy-policy', changefreq: 'monthly', priority: 0.8 },
  { url: '/disclaimer', changefreq: 'monthly', priority: 0.8 },
  { url: '/refund-policy', changefreq: 'monthly', priority: 0.8 },
  { url: '/return-and-refund', changefreq: 'monthly', priority: 0.8 },
  { url: '/cookies-policy', changefreq: 'monthly', priority: 0.8 },
  { url: '/shipping-and-delivery', changefreq: 'monthly', priority: 0.8 },
  { url: '/order-cancellation', changefreq: 'monthly', priority: 0.8 },
  { url: '/allcategory', changefreq: 'monthly', priority: 0.8 },
  { url: '/faq', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/productlist', changefreq: 'monthly', priority: 0.8 },
  { url: '/product/:id', changefreq: 'monthly', priority: 0.8 },
  { url: '/cart', changefreq: 'monthly', priority: 0.8 },
  { url: 'delete-account', changefreq: 'monthly', priority: 0.8 },
  { url: '/userprofile', changefreq: 'monthly', priority: 0.8 },
  { url: '/search', changefreq: 'monthly', priority: 0.8 },
  { url: '*', changefreq: 'monthly', priority: 0.8 },
];

const generateSitemap = async () => {
  const stream = new SitemapStream({ hostname: hostName });
  urls.forEach((url) => stream.write(url));
  stream.end();
  const data = await streamToPromise(stream).then((sm) =>
    sm.toString()
  );

  const publicPath = path.resolve(__dirname, "../../public");
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  const sitemapPath = path.join(publicPath, "sitemap.xml");
  fs.writeFileSync(sitemapPath, data);
  console.log("Sitemap generated!");
};

generateSitemap();
