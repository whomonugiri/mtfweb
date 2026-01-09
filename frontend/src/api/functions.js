import axios from "axios";
import { HOST } from "./endpoints";
import toastr from "toastr";

export const singleCall = (url, data, success, fail) => {
  const token = localStorage.getItem("token");
  const deviceId = localStorage.getItem("deviceId");

  if (token && deviceId) {
    if (data instanceof FormData) {
      data.append("token", token);
      data.append("deviceId", deviceId);
    } else {
      data.token = token;
      data.deviceId = deviceId;
    }
  }
  axios
    .post(HOST + url, data)
    .then((response) => {
      if (response.data.success) {
        if (response?.data?.message) toastr.success(response.data.message);
        success(response?.data);
      } else {
        toastr.error("something is wrong, please try again later");
        fail();
      }
    })
    .catch((error) => {
      const message = error.response
        ? error.response.data.message
        : error.message;
      toastr.error(message);
      fail();
    });
};

export const getCall = (url, success, fail) => {
  const token = localStorage.getItem("token");
  const deviceId = localStorage.getItem("deviceId");

  let fullUrl = HOST + url;

  // Append token and deviceId as query params for GET requests
  const separator = fullUrl.includes("?") ? "&" : "?";
  if (token && deviceId) {
    fullUrl += `${separator}token=${token}&deviceId=${deviceId}`;
  }

  axios
    .get(fullUrl)
    .then((response) => {
      if (response.data.success) {
        success(response?.data);
      } else {
        toastr.error("something is wrong, please try again later");
        fail();
      }
    })
    .catch((error) => {
      const message = error.response
        ? error.response.data.message
        : error.message;
      toastr.error(message);
      fail();
    });
};
