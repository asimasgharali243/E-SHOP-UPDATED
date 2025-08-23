self.onmessage = function (e) {
  const { formData, fieldsToValidate } = e.data;
  const errors = {};
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  fieldsToValidate.forEach((field) => {
    const value = formData[field]?.trim();

    switch (field) {
      case "firstName":
        if (!value) {
          errors.firstName = "First name required";
        } else if (value.length < 4) {
          errors.firstName = "Min 4 chars";
        }
        break;

      case "lastName":
        if (!value) {
          errors.lastName = "Last name required";
        } else if (value.length < 4) {
          errors.lastName = "Min 4 chars";
        }
        break;

      case "userName":
        if (!value) {
          errors.userName = "Username required";
        } else if (value.length < 8) {
          errors.userName = "Min 8 chars";
        }
        break;

      case "email":
        if (!value) {
          errors.email = "Email required";
        } else if (!emailPattern.test(value)) {
          errors.email = "Invalid email";
        }
        break;

      case "password":
        if (!value) {
          errors.password = "Password required";
        } else if (value.length < 6) {
          errors.password = "Min 6 chars";
        }
        break;

      case "conformPassword":
        if (!value) {
          errors.conformPassword = "Confirm password";
        } else if (formData.password !== formData.conformPassword) {
          errors.conformPassword = "Passwords differ";
        }
        break;

      default:
        break;
    }
  });

  self.postMessage(errors);
};
