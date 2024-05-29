import React from "react";
import ReactDOM from "react-dom";

const PopupDom = ({ children }) => {
  const el = document.getElementsByTagName("popupDom");
  return ReactDOM.createPortal(children, el);
};

export default PopupDom;
