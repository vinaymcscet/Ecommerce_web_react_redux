export const FormatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString(); // Format as MM/DD/YYYY or DD/MM/YYYY based on locale
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format as HH:MM
    return `${formattedDate} ${formattedTime}`;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
  
    // Adding suffixes for the day
    const daySuffix =
      day === 1 || day === 21 || day === 31 ? "st" :
      day === 2 || day === 22 ? "nd" :
      day === 3 || day === 23 ? "rd" : "th";
  
    return `${day}${daySuffix} ${month}`;
  };

  export const formatDateTimeProduct = (dateString) => {
    if (!dateString) return "Invalid Date";
  
    // Check if the input is a datetime (contains space)
    const isDateTime = dateString.includes(" ");
  
    let parsedDate;
  
    if (isDateTime) {
      // If datetime, split the date and time, then parse both parts
      const [datePart, timePart] = dateString.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);
  
      // Create a new Date object from the datetime components
      parsedDate = new Date(year, month - 1, day, hour, minute); // Month is 0-indexed
    } else {
      // If only date, parse the date part only
      const [day, month, year] = dateString.split("-").map(Number);
      parsedDate = new Date(year, month - 1, day); // Month is 0-indexed
    }
  
    // Check if the parsed date is valid
    if (isNaN(parsedDate)) return "Invalid Date";
  
    const weekDay = parsedDate.toLocaleString("default", { weekday: "long" });
    const shortMonth = parsedDate.toLocaleString("default", { month: "short" });
    const fullYear = parsedDate.getFullYear();
  
    const date = parsedDate.getDate();
    let hour = parsedDate.getHours();
  
    // Determine AM or PM and adjust hour for 12-hour format
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
    hour = hour.toString().padStart(2, "0");
  
    const minute = parsedDate.getMinutes().toString().padStart(2, "0");
  
    // Adding suffixes for the day
    const daySuffix =
      date === 1 || date === 21 || date === 31
        ? "st"
        : date === 2 || date === 22
        ? "nd"
        : date === 3 || date === 23
        ? "rd"
        : "th";
  
    return {
      formattedDate: `${parsedDate.getDate().toString().padStart(2, "0")}-${(parsedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${parsedDate.getFullYear()}`,
      fullDay: weekDay,
      time: isDateTime ? `${hour}:${minute} ${period}` : null, // Only include time if it's a datetime
      components: {
        day: date,
        month: shortMonth,
        weekDay,
        hour,
        minute,
        period,
      },
    };
  };
  

export const formatClasses = (date) => {
  const currentDate = new Date();
  const targetDate = new Date(date);

  if (targetDate.toDateString() === currentDate.toDateString()) {
    return "order started"; // Same day as current date
  } else if (targetDate < currentDate) {
    return "order started done"; // Date has passed
  } else {
    return "order"; // Future date
  }
};

export const formatDateTimeFormatProduct = (dateString) => {
  if (!dateString) return "Invalid Date";

  // Parse the input date string (YYYY-MM-DD)
  const [year, month, day] = dateString.split("-").map(Number);

  // Create a new Date object from the parsed values
  const parsedDate = new Date(year, month - 1, day); // Month is 0-indexed

  // Check if the parsed date is valid
  if (isNaN(parsedDate)) return "Invalid Date";

  // Format the date to DD-MM-YYYY
  const formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getFullYear()}`;

  return formattedDate;
};

