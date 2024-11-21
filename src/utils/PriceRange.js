export const parsePriceRange = (priceOption) => {
  if (priceOption.startsWith("Under")) {
    const max = parseInt(priceOption.split(" ")[1], 10);
    return [[0, max]];
  } else if (priceOption.startsWith("Above")) {
    const min = parseInt(priceOption.split(" ")[1], 10);
    return [[min, Infinity]];
  } else {
    const [min, max] = priceOption.split("-").map(Number);
    return [[min, max]];
  }
};

export const parseRating = (ratingOption) => {
  const rating = parseInt(ratingOption.split(" ")[0], 10);
  return rating.toString();
};
