export function getDeviceType() {
    const userAgent = navigator.userAgent;
  
    // Detect mobile devices
    if (/Android/i.test(userAgent)) {
      return "Android Mobile";
    } else if (/iPhone/i.test(userAgent)) {
      return "iPhone";
    } else if (/iPad|iPod/i.test(userAgent)) {
      return "iPad";
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent)) {
      return "MacBook";
    } else if (/Windows/i.test(userAgent)) {
      return "Windows Laptop/PC";
    } else if (/Linux/i.test(userAgent)) {
      return "Linux Laptop/PC";
    }
  
    // If no specific device is detected, return 'Unknown Device'
    return "Unknown Device";
  }
