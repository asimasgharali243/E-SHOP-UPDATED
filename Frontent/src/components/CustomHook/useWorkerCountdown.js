import { useEffect, useRef, useState } from "react";
import CountdownWorker from "../../utils/countdownWorker.js?worker"; // ✅ Vite/Webpack

export const useWorkerCountdown = (targetTime) => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
    totalSeconds: 0,
  });

  const workerRef = useRef(null);

  useEffect(() => {
    if (!targetTime) return;

    const timestamp = typeof targetTime === "string"
      ? new Date(targetTime).getTime()
      : targetTime;
    if (isNaN(timestamp)) {
      console.error("Invalid targetTime passed to countdown:", targetTime);
      return;
    }

    // Clean up old worker
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const worker = new CountdownWorker();
    workerRef.current = worker;

workerRef.current.postMessage({ targetTime: timestamp });    
workerRef.current.onmessage = (e) => {
      const { days, hours, minutes, seconds, expired, totalSeconds } = e.data;
      setTime({ days, hours, minutes, seconds, expired, totalSeconds });
    };

    
    return () => {
      workerRef.current.terminate();
    };
  }, [targetTime]);

  return time;
};
