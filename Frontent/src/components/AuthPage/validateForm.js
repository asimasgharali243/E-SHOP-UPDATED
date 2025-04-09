export const validateForm = (formData,isLoginState) => {
    const errors = {};
    const { firstName, lastName, userName, email, password } = formData;
    const emailpattern=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
    if (!isLoginState) {
      if (!firstName.trim()) errors.firstName = "First name is required";
      if (!lastName.trim()) errors.lastName = "Last name is required";
      if (!userName.trim()) errors.userName = "Username is required";
      
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailpattern.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };
  
