import { useEffect, useState } from "react";


export const useCountdownTimer = (timer) => {

  const [countDown, setCountDown] = useState(0);

  useEffect(() => {
    // Reset the countdown when the timer value changes
    if (!timer) return 0;

    const targetTime = new Date(timer).getTime(); // Convert timer to a valid time
    setCountDown(Math.max(targetTime - Date.now(), 0));

    const interval = setInterval(() => {
      setCountDown((prevTime) => {
        const updatedTime = Math.max(prevTime - 1000, 0);
        if (updatedTime === 0) {
          clearInterval(interval);
        }
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount or timer change
  }, [timer]); // Depend on timer changes from Redux
  return formatTime(countDown);
};

const formatTime = (countDown) => {
  if (countDown <= 0 || isNaN(countDown)) return 0;
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  //  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {days,hours,minutes,seconds}
};
