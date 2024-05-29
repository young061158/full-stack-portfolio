import axios from "axios";

export const preparePayments = {
  method: "post",
  url: "https://api.iamport.kr/payments/prepare",
  headers: { "Content-Type": "application/json" },
  data: { merchant_uid: "merchant_1714610240046", amount: 1000 },
};

try {
  const { data } = await axios.request(preparePayments);
  console.log(data);
} catch (error) {
  console.error(error);
}

export const completePayment = async (paymentData) => {
  try {
    const response = await fetch("http://localhost:8080/api/payment/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error completing payment:", error);
    throw new Error("Failed to complete payment");
  }
};
