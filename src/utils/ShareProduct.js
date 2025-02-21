export const ShareProduct = async (productId) => {
  const productURL = `${window.location.origin}/product/${productId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this product!",
        url: productURL,
      });
    } catch (error) {
      // console.error("Error sharing product:", error);
    }
  } else {
    navigator.clipboard.writeText(productURL);
    alert("Link copied to clipboard!");
  }
};

export const ShareBlogs = async (blogId) => {
  const blogURL = `${window.location.origin}/blog/${blogId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this blog!",
        url: blogURL,
      });
    } catch (error) {
      // console.error("Error sharing blog:", error);
    }
  } else {
    navigator.clipboard.writeText(blogURL);
    alert("Link copied to clipboard!");
  }
}
