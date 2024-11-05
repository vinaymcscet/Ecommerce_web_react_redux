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