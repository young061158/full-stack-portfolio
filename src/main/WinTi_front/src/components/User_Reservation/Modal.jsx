import React, { useState } from "react";
import SeatSelection from "../User_Reservation/SeatSelection";
import ConfirmPayment from "./ConfirmPayment";
import SelectPrice from "./SelectPrice";
import Confirmation from "./Confirmation";
import Payments from "./Payments";
import axios from "axios";
import { useCookies } from "react-cookie";
import ProgressBar from "../../pages/payment/ProgressBar";

const Modal = ({
  onClose,
  showDetails,
  paymentsId,
  selectedRound,
  purchaseLimit,
  reservedSeats,
}) => {
  const [step, setStep] = useState(1);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const [seatInfo, setSeatInfo] = useState({});
  const [finalTotal, setFinalTotal] = useState(0);
  const paymentId = paymentsId.paymentId;
  const nextStep = (
    ticketPrice = null,
    totalDiscount = null,
    couponDiscount = null
  ) => {
    if (ticketPrice !== null && totalDiscount !== null) {
      setTicketPrice(ticketPrice);
      setTotalDiscount(totalDiscount);
      setCouponDiscount(couponDiscount); // 쿠폰 할인 상태 업데이트
    }
    setStep(step + 1);
  };
  const updateSeatInfo = (info) => {
    setSeatInfo(info);
  };
  const previousStep = () => step > 1 && setStep(step - 1);

  const handleClose = async () => {
    if (!paymentCompleted && step !== 5) {
      // 결제가 완료되지 않은 경우에만 삭제 요청
      try {
        await axios.delete(
          `http://localhost:8080/api/payment/delete/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Payment history deleted");
      } catch (error) {
        console.error("Error deleting payment history:", error);
      }
    }
    onClose();
  };

  const handlePaymentSuccess = (rsp) => {
    console.log("결제 성공", rsp);
    setPaymentCompleted(true); // 결제가 완료된 상태로 설정
  };
  const renderStep = () => {
    const commonProps = {
      onNext: nextStep,
      onBack: previousStep,
      showDetails,
      paymentsId,
    };
    switch (step) {
      case 1:
        return (
          <SeatSelection
            {...commonProps}
            selectedRound={selectedRound}
            purchaseLimit={purchaseLimit}
          />
        );
      case 2:
        return (
          <SelectPrice
            {...commonProps}
            seatInfo={seatInfo}
            setFinalTotal={setFinalTotal}
            finalTotal={finalTotal}
          />
        );
      case 3:
        return (
          <Confirmation
            {...commonProps}
            ticketPrice={ticketPrice}
            totalDiscount={totalDiscount}
            couponDiscount={couponDiscount}
            seatInfo={seatInfo}
            finalTotal={finalTotal}
          />
        );
      case 4:
        return (
          <Payments
            {...commonProps}
            ticketPrice={ticketPrice}
            totalDiscount={totalDiscount}
            couponDiscount={couponDiscount}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      case 5:
        return (
          <ConfirmPayment
            {...commonProps}
            ticketPrice={ticketPrice}
            totalDiscount={totalDiscount}
            couponDiscount={couponDiscount}
            onFinish={() => {
              console.log("결제 완료!");
              onClose();
            }}
          />
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="payModal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <div className="seatSelection_top">
          <div className="title">예매하기</div>
        </div>
        <ProgressBar currentStep={step} />
        {renderStep()}
      </div>
    </div>
  );
};

export default Modal;
