export const parsePriceRange = (priceOption) => {
  if (priceOption.startsWith("Under")) {
    const max = parseInt(priceOption.replace(/[^0-9]/g, ""), 10); // Extract numbers only
    return [0, max];
  } else if (priceOption.startsWith("Above")) {
    const min = parseInt(priceOption.replace(/[^0-9]/g, ""), 10); // Extract numbers only
    return [min, Infinity];
  } else {
    // Split on the dash and clean each part individually
    const [min, max] = priceOption.split("-").map(value => parseInt(value.replace(/[^0-9]/g, ""), 10));
    return [min, max];
  }
};

export const parseRating = (ratingOption) => {
  const rating = parseInt(ratingOption.split(" ")[0], 10);
  return rating.toString();
};
