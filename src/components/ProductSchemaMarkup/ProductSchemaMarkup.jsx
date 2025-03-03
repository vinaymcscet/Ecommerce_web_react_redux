import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const ProductSchemaMarkup = ({ product }) => {

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.data.name,
    "image": product.data.images[0], 
    "description": product.data.description.content[0],
    "sku": product.data.variants[0].sku_id,
    "brand": {
      "@type": "Brand",
      "name": product?.data?.additional_info.filter((info) => info?.title.toLowerCase().includes("brand"))[0].value,
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": product.data.variants[0].sku_price.current,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

export default ProductSchemaMarkup;
