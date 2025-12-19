// utils/validateProfile.js
export function validateProfile(data) {
  let error = "";

  if (!data.fullName || data.fullName.trim().length < 3) {
    error = "Full name is required";
  }

  if (!data.emailId || !/^\S+@\S+\.\S+$/.test(data.emailId)) {
    error = "Valid email ID is required";
  }

  if (!data.brandName) {
    error = "Brand name is required";
  }

  if (!data.address) {
    error = "Address is required";
  }

  // Optional GST validation (India)
  if (
    data.GSTNO &&
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      data.GSTNO
    )
  ) {
    error = "Invalid GST number format";
  }

  return {
    error,
    isValid: error === "",
  };
}
