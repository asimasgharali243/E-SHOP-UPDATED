export const validateForm = (formData, fieldsToValidate) => {
  const errors = {};
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  fieldsToValidate.forEach((field) => {
    const value = formData[field]?.trim();

    switch (field) {
      case "firstName":
        if (!value) errors.firstName = "First name is required";
        break;

      case "lastName":
        if (!value) errors.lastName = "Last name is required";
        break;

      case "userName":
        if (!value) errors.userName = "Username is required";
        break;

      case "email":
        if (!value) {
          errors.email = "Email is required";
        } else if (!emailPattern.test(value)) {
          errors.email = "Email is invalid";
        }
        break;

      case "password":
        if (!value) {
          errors.password = "Password is required";
        } else if (value.length < 6) {
          errors.password = "Password must be at least 6 characters";
        }
        break;
        case "conformPassword":
        if (!value) {
          errors.conformPassword = "conformPassword is required";
        } else if (value.length < 6) {
          errors.conformPassword = "Password must be at least 6 characters";
        }
        break;
        case `comparePassword`:
        if (!errors.conformPassword &&formData.password !== formData.conformPassword) {
          errors.conformPassword = "Passwords must be  match";
        }

        break;

      default:
        break;
    }
  });

  return errors;
};
