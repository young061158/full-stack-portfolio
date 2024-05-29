import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Payments = () => {
  const { id } = useParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/payment/paymentData/${id}`
        );
        setPaymentInfo(response.data);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    const fetchToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/auth/token"
        );
        setToken(response.data.token); // Assume the token is returned here
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchPaymentData();
    fetchToken();
  }, [id]);

  const handlePayment = async () => {
    if (!paymentInfo || !token) {
      alert("결제 정보 또는 인증 토큰을 불러오는 데 실패하였습니다.");
      return;
    }

    const paymentData = {
      ...paymentInfo,
      merchant_uid: uuidv4(),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/payment/prepare",
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        console.log(
          "Payment prepared successfully, proceeding to payment gateway."
        );
        performPayment(paymentData);
      } else {
        console.error("Failed to prepare payment:", response.data.message);
      }
    } catch (error) {
      console.error("Error during payment preparation:", error);
    }
  };

  const performPayment = (paymentData) => {
    window.IMP.request_pay(
      {
        ...paymentData,
      },
      async (rsp) => {
        if (rsp.success) {
          console.log("결제성공");
          // Optionally, send payment success information back to server
        } else {
          console.log("결제 실패", rsp.error_msg);
        }
      }
    );
  };

  return (
    <div className="div-wrapper">
      <button onClick={handlePayment} disabled={!paymentInfo || !token}>
        결제하기
      </button>
    </div>
  );
};

export default Payments;
