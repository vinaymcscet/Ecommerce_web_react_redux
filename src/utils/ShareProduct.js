export const ShareProduct = async (productId) => {
    const productURL = `${window.location.origin}/product/${productId}`;
    
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Check out this product!",
            url: productURL,
          });
        } catch (error) {
          console.error("Error sharing product:", error);
        }
      } else {
        navigator.clipboard.writeText(productURL);
        alert("Link copied to clipboard!");
      }
  };
  