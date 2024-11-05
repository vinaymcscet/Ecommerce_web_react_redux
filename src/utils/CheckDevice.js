export function getDeviceType() {
    const userAgent = navigator.userAgent;
  
    // Detect mobile devices
    if (/Android/i.test(userAgent)) {
      return "web";
    } else if (/iPhone/i.test(userAgent)) {
      return "web";
    } else if (/iPad|iPod/i.test(userAgent)) {
      return "web";
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent)) {
      return "web";
    } else if (/Windows/i.test(userAgent)) {
      return "web";
    } else if (/Linux/i.test(userAgent)) {
      return "web";
    }
  
    // If no specific device is detected, return 'Unknown Device'
    return "web";
  }
