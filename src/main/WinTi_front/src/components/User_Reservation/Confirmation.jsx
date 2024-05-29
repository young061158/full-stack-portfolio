import React, { useEffect, useState } from "react";
import ProgressBar from "../../pages/payment/ProgressBar";
import axios from "axios";
import { useCookies } from "react-cookie";
const Confirmation = ({
  onBack,
  onNext,
  setPaymentsId,
  paymentsId,
  showDetails,
  ticketPrice,
  totalDiscount,
  couponDiscount,
}) => {
  const paymentId = paymentsId.paymentId;
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격 상태 추가
  const [confirmInfo, setConfirmInfo] = useState({});
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const [buyerTel, setBuyerTel] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const handleAgreementChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  const handlebuyerTelChange = (event) => {
    setBuyerTel(event.target.value);
  };

  const handleEmailChange = (event) => {
    setBuyerEmail(event.target.value);
  };

  useEffect(() => {
    const confirmPaymentInfo = async () => {
      if (paymentId) {
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
            setConfirmInfo(response.data);
            console.log("response data: ", response.data);
            const calculatedTotalPrice =
              response.data.amount - ticketPrice - couponDiscount;
            setTotalPrice(calculatedTotalPrice);
          } else {
            console.log("데이터를 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("데이터 에러 ", error);
        }
      }
    };
    confirmPaymentInfo();
    console.log(confirmInfo);
  }, [paymentId, token, totalDiscount, confirmInfo]);

  const handleInfopost = () => {
    const updateData = {
      paymentId: paymentsId.paymentId,
      buyerTel: buyerTel,
      buyerEmail: buyerEmail,
    };
    fetch("http://localhost:8080/api/payment/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => response.json())
      .then((data) => {
        setConfirmInfo(data);
        console.log("결제상품정보 저장완료", data);
      })
      .catch((error) => {
        console.error("에러내용:", error);
      });
  };

  const handlePreStep = () => {
    setConfirmInfo({});
    onBack();
  };
  const handleNextStep = () => {
    if (!isAgreed) {
      alert("개인정보 제 3자 제공에 동의해주세요.");
      return;
    }
    handleInfopost();

    onNext();
  };
  return (
    <div className="confirmation-container">
      <div className="left-section">
        <form className="info-box">
          <h5>예매자 정보</h5>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <label>{confirmInfo.buyerName}</label>
          </div>
          <div className="form-group">
            <label htmlFor="phone">연락처</label>
            <input
              type="text"
              id="phone"
              value={confirmInfo.buyerTel}
              onChange={handlebuyerTelChange}
              placeholder="01012341234"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={confirmInfo.buyerEmail}
              onChange={handleEmailChange}
              placeholder="example@gmail.com"
            />
          </div>
        </form>

        <div className="confirmation-box">
          <h5>예매자 확인</h5>
          <input
            type="radio"
            id="option1"
            name="option"
            value="1"
            checked={confirmInfo.isAgreed}
            onChange={handleAgreementChange}
          />
          <span>개인정보 제 3자 제공에 동의합니다</span>
          <br />
          <span>(고객응대 및 관람정보안내 등을 위함)</span>
        </div>
      </div>

      <div className="right-section">
        <div className="details-box">
          <h5>예매 정보</h5>
          <div>
            <strong>좌석:</strong> {confirmInfo.selectedSeats}
          </div>
          <div>
            <strong>일시:</strong> {confirmInfo.selectedDate}
          </div>
          <div>
            <strong>티켓가격:</strong>
            {totalDiscount}원
          </div>
          <div>
            <strong>쿠폰할인금액:</strong>
            {couponDiscount}원
          </div>
          <div>
            <strong>총 금액:</strong>
            {confirmInfo.amount}원
          </div>
        </div>
        <div className="button-section">
          <button className="modal_button" onClick={handlePreStep}>
            이전단계
          </button>
          <button
            className="modal_button"
            onClick={handleNextStep}
            showDetails={showDetails}
            paymentsId={paymentsId}
          >
            다음단계
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
