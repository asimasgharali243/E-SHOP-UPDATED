import React, { useState, useRef } from "react";
import "./Profile.scss";

const Profile = () => {
  // User data state - all fields start empty
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "https://via.placeholder.com/150/cccccc/969696?text=Upload+Photo",
  });

  // Form data state - all fields start empty
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Addresses state
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Home",
      address: "123 Main St, Anytown, USA 12345",
      isDefault: true,
    },
    {
      id: 2,
      name: "Work",
      address: "456 Office Blvd, Business Park, USA 67890",
      isDefault: false,
    },
  ]);

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "Visa",
      last4: "4235",
      expiry: "12/24",
      isDefault: true,
    },
    {
      id: 2,
      type: "MasterCard",
      last4: "6789",
      expiry: "08/25",
      isDefault: false,
    },
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState("profile");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    address: "",
    isDefault: false,
  });
  const [paymentForm, setPaymentForm] = useState({
    type: "Visa",
    last4: "",
    expiry: "",
    isDefault: false,
  });

  // File input reference for photo upload
  const fileInputRef = useRef(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle address form changes
  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle payment form changes
  const handlePaymentFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentForm({
      ...paymentForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ ...formData, avatar: userData.avatar });
    showNotification("Profile updated successfully!", "success");
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData({
          ...userData,
          avatar: event.target.result,
        });
        showNotification("Profile photo updated successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Show notification
  const showNotification = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Address functions
  const handleAddAddress = () => {
    setAddressForm({ name: "", address: "", isDefault: false });
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setAddressForm({ ...address });
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addressForm, id: editingAddress.id }
            : addr
        )
      );
      showNotification("Address updated successfully!", "success");
    } else {
      // Add new address
      const newAddress = {
        ...addressForm,
        id: Math.max(...addresses.map((a) => a.id), 0) + 1,
      };
      setAddresses([...addresses, newAddress]);
      showNotification("Address added successfully!", "success");
    }

    if (addressForm.isDefault) {
      // Set as default address
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault:
            addr.id === (editingAddress ? editingAddress.id : newAddress.id),
        }))
      );
    }

    setShowAddressModal(false);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    showNotification("Address deleted successfully!", "success");
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    showNotification("Default address updated!", "success");
  };

  // Payment functions
  const handleAddPayment = () => {
    setPaymentForm({ type: "Visa", last4: "", expiry: "", isDefault: false });
    setEditingPayment(null);
    setShowPaymentModal(true);
  };

  const handleEditPayment = (payment) => {
    setPaymentForm({ ...payment });
    setEditingPayment(payment);
    setShowPaymentModal(true);
  };

  const handleSavePayment = () => {
    if (editingPayment) {
      // Update existing payment
      setPaymentMethods(
        paymentMethods.map((payment) =>
          payment.id === editingPayment.id
            ? { ...paymentForm, id: editingPayment.id }
            : payment
        )
      );
      showNotification("Payment method updated successfully!", "success");
    } else {
      // Add new payment
      const newPayment = {
        ...paymentForm,
        id: Math.max(...paymentMethods.map((p) => p.id), 0) + 1,
      };
      setPaymentMethods([...paymentMethods, newPayment]);
      showNotification("Payment method added successfully!", "success");
    }

    if (paymentForm.isDefault) {
      // Set as default payment
      setPaymentMethods(
        paymentMethods.map((payment) => ({
          ...payment,
          isDefault:
            payment.id === (editingPayment ? editingPayment.id : newPayment.id),
        }))
      );
    }

    setShowPaymentModal(false);
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(paymentMethods.filter((payment) => payment.id !== id));
    showNotification("Payment method deleted successfully!", "success");
  };

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(
      paymentMethods.map((payment) => ({
        ...payment,
        isDefault: payment.id === id,
      }))
    );
    showNotification("Default payment method updated!", "success");
  };

  return (
    <div className="profile-page">
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <h1 className="page-title mb-4">Profile Management</h1>
          </div>
        </div>

        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-lg-3 mb-4">
            <div className="profile-sidebar card">
              <div className="card-body text-center p-4">
                <div className="profile-avatar-container mb-3 mx-auto">
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="profile-avatar rounded-circle"
                  />
                  <button
                    className="btn btn-primary btn-sm avatar-edit-btn"
                    onClick={triggerFileInput}
                  >
                    <i className="bi bi-camera"></i>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
                <h5 className="mb-1">{userData.name || "Your Name"}</h5>
                <p className="text-muted mb-3">
                  {userData.email || "your.email@example.com"}
                </p>
              </div>

              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${
                    activeTab === "profile" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <i className="bi bi-person me-2"></i>
                  Profile Information
                </button>
                <button
                  className={`list-group-item list-group-item-action ${
                    activeTab === "orders" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <i className="bi bi-bag me-2"></i>
                  Order History
                </button>
                <button
                  className={`list-group-item list-group-item-action ${
                    activeTab === "addresses" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  Addresses
                </button>
                {/* <button
                  className={`list-group-item list-group-item-action ${
                    activeTab === "payment" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("payment")}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Payment Methods
                </button> */}
                <button
                  className={`list-group-item list-group-item-action ${
                    activeTab === "security" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Security
                </button>
                <button className="list-group-item list-group-item-action text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="profile-content card">
              <div className="card-body p-4">
                {/* Alert Notification */}
                {showAlert && (
                  <div
                    className={`alert alert-${alertType} alert-dismissible fade show`}
                  >
                    {alertMessage}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAlert(false)}
                    ></button>
                  </div>
                )}

                {/* Profile Information Tab */}
                {activeTab === "profile" && (
                  <div className="tab-content">
                    <h3 className="mb-4">Profile Information</h3>
                    <div className="row">
                      <div className="col-md-4 text-center mb-4">
                        <div className="profile-avatar-container mx-auto mb-3">
                          <img
                            src={userData.avatar}
                            alt="Profile"
                            className="profile-avatar-lg rounded-circle"
                          />
                          <button
                            className="btn btn-primary avatar-edit-btn-lg"
                            onClick={triggerFileInput}
                          >
                            <i className="bi bi-camera"></i>
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            accept="image/*"
                            style={{ display: "none" }}
                          />
                        </div>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={triggerFileInput}
                        >
                          Change Photo
                        </button>
                      </div>
                      <div className="col-md-8">
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Full Name</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">
                                Email Address
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="tel"
                              className="form-control"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary">
                              Save Changes
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                setFormData({ name: "", email: "", phone: "" })
                              }
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order History Tab */}
                {activeTab === "orders" && (
                  <div className="tab-content">
                    <h3 className="mb-4">Order History</h3>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>ORD-12345</td>
                            <td>Oct 15, 2023</td>
                            <td>3</td>
                            <td>$125.99</td>
                            <td>
                              <span className="badge bg-success">
                                Delivered
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-eye"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>ORD-12346</td>
                            <td>Oct 10, 2023</td>
                            <td>2</td>
                            <td>$78.50</td>
                            <td>
                              <span className="badge bg-primary">Shipped</span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-eye"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>ORD-12347</td>
                            <td>Oct 5, 2023</td>
                            <td>1</td>
                            <td>$45.25</td>
                            <td>
                              <span className="badge bg-warning">
                                Processing
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-eye"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === "addresses" && (
                  <div className="tab-content">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="mb-0">My Addresses</h3>
                      <button
                        className="btn btn-primary"
                        onClick={handleAddAddress}
                      >
                        <i className="bi bi-plus me-1"></i> Add New Address
                      </button>
                    </div>
                    <div className="row">
                      {addresses.map((address) => (
                        <div className="col-md-6 mb-3" key={address.id}>
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="card-title">{address.name}</h5>
                                {address.isDefault && (
                                  <span className="badge bg-primary">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="card-text">{address.address}</p>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEditAddress(address)}
                                >
                                  <i className="bi bi-pen"></i> Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleDeleteAddress(address.id)
                                  }
                                >
                                  <i className="bi bi-trash"></i> Delete
                                </button>
                                {!address.isDefault && (
                                  <button
                                    className="btn btn-sm btn-outline-secondary ms-auto"
                                    onClick={() =>
                                      handleSetDefaultAddress(address.id)
                                    }
                                  >
                                    Set as Default
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Methods Tab */}
                {/* {activeTab === "payment" && (
                  <div className="tab-content">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="mb-0">Payment Methods</h3>
                      <button
                        className="btn btn-primary"
                        onClick={handleAddPayment}
                      >
                        <i className="bi bi-plus me-1"></i> Add Payment Method
                      </button>
                    </div>
                    <div className="row">
                      {paymentMethods.map((payment) => (
                        <div className="col-md-6 mb-3" key={payment.id}>
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="card-title">
                                  {payment.type} •••• {payment.last4}
                                </h5>
                                {payment.isDefault && (
                                  <span className="badge bg-primary">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="card-text">
                                Expires {payment.expiry}
                              </p>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEditPayment(payment)}
                                >
                                  <i className="bi bi-pen"></i> Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleDeletePayment(payment.id)
                                  }
                                >
                                  <i className="bi bi-trash"></i> Delete
                                </button>
                                {!payment.isDefault && (
                                  <button
                                    className="btn btn-sm btn-outline-secondary ms-auto"
                                    onClick={() =>
                                      handleSetDefaultPayment(payment.id)
                                    }
                                  >
                                    Set as Default
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="tab-content">
                    <h3 className="mb-4">Security Settings</h3>
                    <div className="card mb-4">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Change Password</h5>
                        <form>
                          <div className="mb-3">
                            <label className="form-label">
                              Current Password
                            </label>
                            <div className="input-group">
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Enter current password"
                              />
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <div className="input-group">
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Enter new password"
                              />
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="form-label">
                              Confirm New Password
                            </label>
                            <div className="input-group">
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm new password"
                              />
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            Update Password
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddressModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Address Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressFormChange}
                    placeholder="Home, Work, etc."
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Full Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={addressForm.address}
                    onChange={handleAddressFormChange}
                    rows="3"
                    placeholder="Enter your full address"
                  ></textarea>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressFormChange}
                    id="defaultAddress"
                  />
                  <label className="form-check-label" htmlFor="defaultAddress">
                    Set as default address
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveAddress}
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPayment
                    ? "Edit Payment Method"
                    : "Add Payment Method"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Card Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={paymentForm.type}
                    onChange={handlePaymentFormChange}
                  >
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">MasterCard</option>
                    <option value="American Express">American Express</option>
                    <option value="Discover">Discover</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Last 4 Digits</label>
                  <input
                    type="text"
                    className="form-control"
                    name="last4"
                    value={paymentForm.last4}
                    onChange={handlePaymentFormChange}
                    placeholder="1234"
                    maxLength="4"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    className="form-control"
                    name="expiry"
                    value={paymentForm.expiry}
                    onChange={handlePaymentFormChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isDefault"
                    checked={paymentForm.isDefault}
                    onChange={handlePaymentFormChange}
                    id="defaultPayment"
                  />
                  <label className="form-check-label" htmlFor="defaultPayment">
                    Set as default payment method
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSavePayment}
                >
                  {editingPayment ? "Update Payment" : "Add Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
