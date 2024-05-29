import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import { useState } from "react";
const ConfirmPayment = ({
  onBack,
  onNext,
  paymentsId,
  showDetails,
  ticketPrice,
  totalDiscount,
  couponDiscount,
  confirmInfo,
}) => {
  // const { reservationShowId } = useParams();
  const navigate = useNavigate();
  const paymentId = paymentsId.paymentId;
  const handleNextStep = () => {
    onNext();
    navigate(`/My_page/User_Reservation/${paymentId}`);
  };
  const [confirmPayInfo, setConfirmPayInfo] = useState({});
  const [token, setToken] = useState("");
  const location = useLocation();
  const { paymentInfo } = location.state;

  useEffect(() => {
    console.log("Location state paymentInfo:", paymentInfo);
  }, [location.state]);

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
          setConfirmPayInfo(response.data);
          console.log("Response Data:", response.data);
        } else {
          console.log("No data found for this ID");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    console.log(paymentInfo);
  }, [paymentId, token]);

  return (
    <div className="confirmPayment_container">
      <h6>고객님의 결제가 정상적으로 완료되었습니다.</h6>
      <div className="confirmPayment_main">
        <div className="confirmPayment_left">
          <h5>결제 정보</h5>
          <div className="confirmPayment_left_panel">
            <div>
              <strong>티켓금액:</strong> {totalDiscount}원
            </div>
            <div>
              <strong>할인금액:</strong> {ticketPrice}원
            </div>
            <div>
              <strong>쿠폰금액:</strong> {couponDiscount}원
            </div>
            <div>
              <strong>총금액:</strong> {paymentInfo.amount}원
            </div>
          </div>
          <h5>결제 상세 정보</h5>
          <div className="confirmPayment_left2_panel">
            <div>
              <strong>결제방법:</strong> 이니시스 카드 결제
            </div>
            <div>
              <strong>카드 종류:</strong> {paymentInfo.card_name}
            </div>
            <div>
              <strong>카드 번호:</strong> {paymentInfo.card_number}
            </div>
            <div>
              <strong>예금주명:</strong> (주) WINTI
            </div>
          </div>
        </div>
        <div className="confirmPayment_right">
          <h5>예매정보</h5>
          <div className="confirmPayment_right_panel">
            <div>
              <strong>상품명:</strong> {paymentInfo.name}
            </div>
            <div>
              <strong>장소:</strong> {showDetails.performance.showAddress}{" "}
              {showDetails.performance.showSubAddress}
            </div>
            <div>
              <strong>일시:</strong> {confirmPayInfo.selectedDate}
            </div>
            <div>
              <strong>좌석:</strong> {confirmPayInfo.selectedSeats}
            </div>
            <div>
              <strong>예매자:</strong> {paymentInfo.buyerName}
            </div>
            <div>
              <strong>연락처:</strong> {confirmPayInfo.buyerTel}
            </div>
          </div>
          <button className="confirm_button" onClick={handleNextStep}>
            예매내역 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
