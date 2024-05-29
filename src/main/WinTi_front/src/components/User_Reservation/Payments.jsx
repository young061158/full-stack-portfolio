import React from "react";
import { useEffect, useState } from "react";
import nav from "../../assets/img/payment/nav.png";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ca } from "date-fns/locale";
import ProgressBar from "../../pages/payment/ProgressBar";
const Payments = ({
  onBack,
  onNext,
  showDetails,
  paymentsId,
  user,
  ticketPrice,
  totalDiscount,
  couponDiscount,
}) => {
  const paymentId = paymentsId.paymentId;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [token, setToken] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    amount: 0,
    merchantUid: "",
    paymentId: "",
    buyer_name: user?.username || "",

    card_name: "",
    card_number: "",
  });
  const merchantUid = paymentInfo.merchantUid;
  const navigate = useNavigate();

  const paymentData = {
    name: paymentInfo.name,
    merchantUid: merchantUid,
    paymentId: paymentInfo.paymentId,
    buyer_name: paymentInfo.buyerName,
    buyer_tel: paymentInfo.buyerTel,
    card_name: paymentInfo.cardName,
    card_number: paymentInfo.cardNumber,
  };
  const handleNextStep = () => {
    if (!isAgreed) {
      alert("결제 방식을 선택해 주세요 ");
      return;
    }
    handleOnClick();
  };
  const handlePreStep = () => {
    onBack();
  };

  const handleOnClick = () => {
    fetchRequestPayDetails();

    handlePayment(paymentInfo);

    performPayment(paymentInfo);
  };

  const fetchRequestPayDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/get-token");
      if (response.status === 200) {
        setToken(response.data.response.access_token);
        console.log("Token set: ", response.data.response.access_token);
      } else {
        console.log("토큰 발급 요청에 실패하였습니다.");
      }
    } catch (error) {
      console.error("토큰발급 요청중 에러가 발생하였습니다.", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/payment/paymentData/${paymentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setPaymentInfo(response.data);
          console.log("Response Data:", response.data);
        } else {
          console.log("No data found for this ID");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [paymentId, token]);

  const handlePayment = async () => {
    console.log(paymentData);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/payment/prepare/${paymentId}`,
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            merchantUid: merchantUid,
            amount: paymentData.amount,
          }),
        }
      );
      console.log("Response received:", response);
      if (response.data && response.data.success) {
        console.log(
          "Payment prepared successfully, proceeding to payment gateway."
        );
        setPaymentInfo(response.data);
        console.log(
          "Sending payment request with merchantUid:",
          paymentInfo.merchantUid
        );
      } else {
        console.error("Failed to prepare payment:", response.data.message);
      }
    } catch (error) {
      console.error("Error during payment preparation:", error);
      console.log(
        "Error details:",
        error.response
          ? error.response.data
          : "No additional error info available."
      );
    }
    console.log(paymentInfo);
  };

  const performPayment = () => {
    const IMP = window.IMP;
    IMP.init("imp15175683");
    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        name: paymentInfo.name,
        amount: paymentInfo.amount,
        buyer_name: paymentInfo.buyerName,
        merchantUid: paymentInfo.merchantUid,
        buyer_email: paymentInfo.buyerEmail || "",
      },
      (rsp) => {
        if (rsp.success) {
          console.log("결제성공", rsp);

          const updatedPaymentInfo = {
            ...paymentInfo,
            card_name: rsp.card_name,
            card_number: rsp.card_number,
          };
          setPaymentInfo(updatedPaymentInfo);
          console.log("Sending update data:", updatedPaymentInfo); // 데이터가 올바르게 추출되었는지 로그로 확인
          handleInfopost(updatedPaymentInfo);
          navigate(onNext(), { state: { paymentInfo: updatedPaymentInfo } });
        } else {
          console.log("결제 실패", rsp.error_msg);
        }
      }
    );
  };
  const handleInfopost = async (updatedPaymentInfo) => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/payment/update",
        updatedPaymentInfo,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (paymentInfo.card_number) {
      // `impUid`가 업데이트된 후에만 함수 실행
      handleInfopost();
      navigate(onNext(), { state: { paymentInfo } });
    }
  }, [paymentInfo]);

  useEffect(() => {
    const loadScript = (src, callback) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      script.onload = callback;
      document.head.appendChild(script);
    };

    loadScript("https://code.jquery.com/jquery-1.12.4.min.js", () => {
      loadScript("https://cdn.iamport.kr/js/iamport.payment-1.2.0.js", () => {
        // 가맹점 식별코드 확인 필요
      });
    });

    return () => {
      document
        .querySelectorAll('script[src^="https://"]')
        .forEach((script) => script.remove());
    };
  }, []);
  const handleAgreementChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  return (
    <div className="payments_container_woo">
      <div className="payments_main">
        <div className="left">
          <div className="payments_main_woo">
            <h5>결제방식</h5>
            <div className="payment_left_panel">
              <input
                type="radio"
                id="cardPay"
                name="cardPay"
                value="1"
                checked={isAgreed}
                onChange={handleAgreementChange}
              />
              <span>카드 결제</span>
            </div>
          </div>

          <div className="payment_left2_panel_woo">
            <h5>결제정보</h5>
            <div className="payment_left2_panel">
              <form>
                <div className="form-group">
                  <label>입금액</label>
                  <label>{paymentInfo.amount}원</label>
                </div>
                <div className="lien"></div>
                <div className="form-group">
                  <label>예금주명</label>
                  <label>(주) WINTI</label>
                </div>
                <div className="lien"></div>
                <div className="form-group">
                  <label>상품명</label>
                  <label>{paymentInfo.name}</label>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="center_lien"></div>

        <div className="payment_right_panel_woo">
          <h5>예매정보</h5>
          <div className="payment_right_panel">
            <div>
              <strong>좌석:</strong> {paymentInfo.selectedSeats}
            </div>
            <div className="lien"></div>
            <div>
              <strong>일시:</strong> {paymentInfo.selectedDate}
            </div>
            <div className="lien"></div>
            <div>
              <strong>티켓가격:</strong>
              {totalDiscount}원
            </div>
            <div className="lien"></div>
            <div>
              <strong>할인금액:</strong>
              {ticketPrice}원
            </div>
            <div className="lien"></div>
            <div>
              <strong>쿠폰할인금액:</strong>
              {couponDiscount}원
            </div>
            <div className="lien"></div>
            <div>
              <strong>총 금액:</strong>
              {paymentInfo.amount}원
            </div>
          </div>
        </div>
      </div>

      <div className="next-button">
        <button className="modal_button" onClick={handlePreStep}>
          이전단계
        </button>
        <button
          className="modal_button"
          onClick={handleNextStep}
          showDetails={showDetails}
          paymentsId={paymentsId}
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

export default Payments;
