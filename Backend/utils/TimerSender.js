export const TimerSender = (date) => {
  const now = new Date();
  const targetDate = new Date(date);

  // Calculate the difference in milliseconds
  const diffInMs = targetDate - now;

  // Get remaining minutes and seconds from the difference
  const seconds = Math.floor((diffInMs / 1000) % 60);
  const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);

  // Format minutes and seconds as two digits
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return formattedTime;
};










// export const TimerSender = (date) => {
//     const now = new Date();
//     const targetDate = new Date(date);
//     const seconds =targetDate.getSeconds() - now.getSeconds();
//     const minutes=targetDate.getMinutes() - now.getMinutes();
//     // const seconds = Math.floor((targetDate - now) / 1000);
//     // const minutes= Math.floor(seconds / 60);
//     // const hours = Math.floor(minutes / 60);
//     // const days = Math.floor(hours / 24);
//     // const months = Math.floor(days / 30);
//     // const years = Math.floor(months / 12);
//     return `${minutes}:${seconds}`
//     //{ seconds,minutes, hours, days, months, years };
//   };
