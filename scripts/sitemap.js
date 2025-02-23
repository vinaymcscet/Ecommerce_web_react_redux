import Generator from "react-router-sitemap-generator";
import RoutePage from "../src/Routes/RoutePage";

const generator = new Generator(
  "https://react-router-sitemap-generator.com",
  RoutePage(),
  {
    lastmod: new Date().toISOString().slice(0, 10),
    changefreq: "monthly",
    priority: 0.8,
  }
);
generator.save("public/sitemap.xml");
