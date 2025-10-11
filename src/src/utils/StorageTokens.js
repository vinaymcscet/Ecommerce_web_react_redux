export const saveTokensToLocalStorage = (tokens) => {
  const tokenObject = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    email: tokens.email,
    username: tokens.username,
    phone: tokens.phone,
    fullname: tokens.fullname,
    profile_pic: tokens.profile_pic,

  };
  localStorage.setItem("authTokens", JSON.stringify(tokenObject));
};

export const getTokensFromLocalStorage = () => {
  const storedTokens = localStorage.getItem("authTokens");
  return storedTokens ? JSON.parse(storedTokens) : null;
};

export const removeTokensFromLocalStorage = () => {
  localStorage.removeItem("authTokens");
};
