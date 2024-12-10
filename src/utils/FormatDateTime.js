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
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const weekDay = date.toLocaleString('default', { weekday: 'long' });
  const year = date.getFullYear();
  let hour = date.getHours();
  
  // Determine AM or PM and adjust hour for 12-hour format
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
  hour = hour.toString().padStart(2, '0');

  const minute = date.getMinutes().toString().padStart(2, '0');
  // Adding suffixes for the day
  const daySuffix =
    day === 1 || day === 21 || day === 31 ? "st" :
    day === 2 || day === 22 ? "nd" :
    day === 3 || day === 23 ? "rd" : "th";

  return {
    formattedDate: `${day}${daySuffix} ${month} ${year}`,
    fullDay: weekDay,
    time: `${hour}:${minute} ${period}`,
    components: { day, month, weekDay, hour, minute, period },
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

