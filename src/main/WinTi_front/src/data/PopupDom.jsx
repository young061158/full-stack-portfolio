import ReactDOM from "react-dom";
import React from "react";

const PopupDom = ({ children }) => {
  const el = document.getElementsByTagName("popupDom");
  return ReactDOM.createPortal(children, el);
};

export default PopupDom;
