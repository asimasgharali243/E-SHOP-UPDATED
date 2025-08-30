import React, { useState, useRef, useEffect } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadImageMutation,
  useUpgradeSellerMutation,
} from "../redux/api/productsApi/userApi";
import "./Profile.scss";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.authUser.user.userId);

  const {
    data: response,
    isLoading: fetchingProfile,
    error,
    refetch,
  } = useGetProfileQuery(user);

  const userData = response?.user;

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const [uploadImage] = useUploadImageMutation();
  const [upgradeSeller] = useUpgradeSellerMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

  // Populate profile form
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        userName: userData.userName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        dob: userData.dob
          ? new Date(userData.dob).toISOString().split("T")[0]
          : "",
        gender: userData.gender || "",
        address: userData.address || "",
      });
    }
  }, [userData]);

  const showNotification = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData).unwrap();
      showNotification(result.message || "Profile updated successfully!");
      refetch();
    } catch (error) {
      showNotification(
        error.data?.message || "Failed to update profile",
        "error"
      );
    }
  };

  // Password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("New passwords do not match", "error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showNotification("Password must be at least 6 characters", "error");
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showNotification(result.message || "Password changed successfully!");
    } catch (error) {
      showNotification(
        error.data?.message || "Failed to change password",
        "error"
      );
    }
  };

  // Photo upload - FIXED VERSION
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to Base64
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1]; // remove "data:image/...;base64,"

        const result = await uploadImage({
          image: base64String,
          fileName: file.name,
        }).unwrap();
        showNotification(result.message || "Profile photo updated!");
        refetch();
        setUploadingImage(false);
      };
    } catch (error) {
      console.error("Upload error:", error);
      showNotification(
        error.data?.message || "Failed to upload profile photo",
        "error"
      );
      setUploadingImage(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  // Upgrade to seller
  const handleUpgradeToSeller = async () => {
    if (!window.confirm("Are you sure you want to upgrade to seller account?"))
      return;

    try {
      const result = await upgradeSeller().unwrap();
      showNotification(result.message || "Account upgraded to seller!");
      refetch();
    } catch (error) {
      showNotification(
        error.data?.message || "Failed to upgrade account",
        "error"
      );
    }
  };

  // Show error if any
  useEffect(() => {
    if (error) {
      showNotification(
        error.data?.message || "Failed to load profile",
        "error"
      );
    }
  }, [error]);

  if (fetchingProfile) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page container py-4">
      {showAlert && (
        <div
          className={`alert alert-${
            alertType === "error" ? "danger" : "success"
          } alert-dismissible fade show`}
          role="alert"
        >
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}

      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="profile-sidebar card text-center">
            <div className="card-body p-4">
              <div className="profile-avatar-container mb-3 mx-auto position-relative">
                <img
                  src={
                    userData?.profileImage?.url ||
                    "https://via.placeholder.com/150/cccccc/969696?text=Upload+Photo"
                  }
                  alt="Profile"
                  className="profile-avatar rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150/cccccc/969696?text=Upload+Photo";
                  }}
                />
                <button
                  className="btn btn-primary btn-sm avatar-edit-btn position-absolute"
                  onClick={triggerFileInput}
                  disabled={uploadingImage}
                  style={{ bottom: "10px", right: "10px" }}
                >
                  {uploadingImage ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <i className="bi bi-camera"></i>
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
              <h5>
                {userData?.firstName} {userData?.lastName}
              </h5>
              <p className="text-muted">{userData?.email}</p>
              {userData?.role === "customer" && (
                <button
                  className="btn btn-success btn-sm mt-2"
                  onClick={handleUpgradeToSeller}
                >
                  Upgrade to Seller
                </button>
              )}
              {userData?.role === "seller" && (
                <span className="badge bg-info">Seller Account</span>
              )}
            </div>
            <div className="list-group list-group-flush">
              <button
                className={`list-group-item list-group-item-action ${
                  activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <i className="bi bi-person me-2"></i> Profile
              </button>
              <button
                className={`list-group-item list-group-item-action ${
                  activeTab === "security" ? "active" : ""
                }`}
                onClick={() => setActiveTab("security")}
              >
                <i className="bi bi-shield-lock me-2"></i> Security
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          {/* Profile Tab */}
          {activeTab === "profile" && userData && (
            <div className="card p-4 mb-4">
              <h5 className="mb-4">Profile Information</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Username *</label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                    placeholder="Enter your address"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="card p-4 mb-4">
              <h5 className="mb-4">Change Password</h5>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label">Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                    minLength="6"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                    minLength="6"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
