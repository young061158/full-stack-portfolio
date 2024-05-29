import React, { useState } from "react";
import { Icon } from "@iconify/react";
import DaumPostcode from "react-daum-postcode";

const UserAddress = (props) => {
  const [address, setAddress] = useState("");

  const onCompletePost = (data) => {
    setAddress(data.address);
    props.onAddressSelect(data.address);
    const addressInput = document.getElementById("useraddress");
    if (addressInput !== null) {
      addressInput.value = data.address;
    }
    props.onClose();
  };

  return (
    <>
      <DaumPostcode onComplete={onCompletePost}></DaumPostcode>
      <a
        className="closeBtn"
        onClick={() => {
          props.onClose();
        }}
      >
        <Icon icon="iconoir:cancel" width="50" />
      </a>
    </>
  );
};

export default UserAddress;
