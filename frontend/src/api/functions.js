import axios from "axios";
import { HOST } from "./endpoints";
import toastr from "toastr";
export const singleCall = (url, data, success, fail) => {
  axios
    .post(HOST + url, data)
    .then((response) => {
      if (response.data.success) {
        toastr.success(response.data.message);
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
