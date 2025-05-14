self.onmessage = (e) => {
  const { otp } = e.data;
  const isValid = /^[0-9]{6}$/.test(otp);
  postMessage({ isValid });
};