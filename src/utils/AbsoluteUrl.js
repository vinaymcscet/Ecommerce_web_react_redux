export const getAbsoluteUrl = (url) => {
if (!url) return '#'; // Fallback if the URL is missing
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};