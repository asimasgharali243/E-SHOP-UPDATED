let interval = null;

onmessage = (e) => {
  const { targetTime } = e.data;

  clearInterval(interval);

  const updateCountdown = () => {
    const now = Date.now();
    const diff = Math.max(targetTime - now, 0);
    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    const expired = totalSeconds <= 0;
    postMessage({ days, hours, minutes, seconds, expired, totalSeconds });

    if (expired) clearInterval(interval);
  };

  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
};
