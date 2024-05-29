import React, { useEffect, useState } from "react";
import nav from "../../assets/img/payment/nav.png";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const SelectPrice = ({
  onBack,
  onNext,
  showDetails,
  paymentsId,
  setPaymentsId,
  selectedRound,
}) => {
  const paymentId = paymentsId.paymentId;
  const navigate = useNavigate();
  const [cookies] = useCookies(["accessToken"]);
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [couponDiscounts, setCouponDiscounts] = useState(0);
  const [priceInfo, setPriceInfo] = useState({});
  const [selections, setSelections] = useState({});
  const [seatPrices, setSeatPrices] = useState([]);
  const [amount, setAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const token = cookies.accessToken;
  const showId = showDetails.performance.showid;

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
          setPriceInfo(response.data);
          console.log("Response Data:", response.data);
        } else {
          console.log("No data found for this ID");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/winti/show_add/coupon/${showId}`
        );
        if (response.status === 200) {
          setCoupons(response.data);
          console.log("Coupons Data:", response.data);
        } else {
          console.log("No coupons found for this show ID");
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    const fetchSeats = async () => {
      if (paymentId) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/winti/show_add/seats/payment/${paymentId}`
          );
          if (response.status === 200) {
            const initialSeatPrices = response.data;
            setSeatPrices(initialSeatPrices);
            console.log("Seat Prices:", initialSeatPrices);
          } else {
            console.log("No seats found for this round ID");
          }
        } catch (error) {
          console.error("Error fetching seats:", error);
        }
      } else {
        console.error("paymentId is undefined");
      }
    };

    fetchData();
    fetchCoupons();
    fetchSeats();
  }, [paymentId, showId, token]);

  const handlePaymentInfo = () => {
    const PaymentData = {
      paymentId: paymentsId.paymentId,
      amount: amount,
    };

    fetch(`http://localhost:8080/api/payment/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(PaymentData),
    })
      .then((response) => response.json())
      .then((data) => {
        setPaymentsId(data);
        console.log("결제상품정보 저장완료", data);
      })
      .catch((error) => {
        console.error("에러내용:", error);
      });
  };

  const handleNextStep = () => {
    handlePaymentInfo();
    onNext(totalDiscount, ticketPrice, couponDiscounts);
  };

  useEffect(() => {
    let basePrice = 0;
    let discountTotal = 0;

    // Calculate the base price
    seatPrices.forEach((seat) => {
      basePrice += seat.seatAmount;
    });

    // Apply coupon discounts
    let totalCouponDiscount = 0;
    selectedCoupons.forEach((coupon) => {
      const couponAmount =
        Math.ceil((basePrice * (coupon.discount / 100)) / 10) * 10;
      totalCouponDiscount += couponAmount;
    });

    // Calculate final total
    const finalTotal = basePrice - totalCouponDiscount;

    setCouponDiscounts(totalCouponDiscount);
    setAmount(finalTotal > 0 ? finalTotal : 0);
    setTicketPrice(basePrice);
    setTotalDiscount(totalCouponDiscount); // Adjusted to reflect the total discount applied
  }, [seatPrices, selectedCoupons]);

  const handleSelectChange = (seatName, value) => {
    const newValue = value ? 1 : 0;
    setSelections((prev) => {
      const newSelections = { ...prev, [seatName]: newValue };
      return newSelections;
    });
  };

  const removeCoupon = (couponCode) => {
    setSelectedCoupons((prev) =>
      prev.filter((coupon) => coupon.couponCode !== couponCode)
    );
  };

  const applyCoupon = () => {
    const coupon = coupons.find((coupon) => coupon.couponCode === couponCode);
    if (coupon && !selectedCoupons.some((sc) => sc.couponCode === couponCode)) {
      setSelectedCoupons([...selectedCoupons, coupon]);
      setCouponCode("");
    } else if (!coupon) {
      alert("Invalid coupon code");
    } else {
      alert("Coupon already applied");
    }
  };

  const handleCouponCodeChange = (event) => {
    setCouponCode(event.target.value);
  };

  const handlePreStep = () => {
    onBack();
  };
  return (
    <div className="selectPriceContent">
      <div className="labels-container">
        <div className="price">가격/할인 선택</div>
        <label className="price-info">예매 정보</label>
      </div>
      <div className="price-selection">
        <div className="price-options">
          <div className="item-selection">
            <table>
              <thead>
                <tr>
                  <th className="table-header">가격 정보</th>
                </tr>
              </thead>
              <tbody>
                {seatPrices.map((seat) => (
                  <tr key={seat.seatId}>
                    <td className="woodong">{seat.seatName}</td>
                    <td>{seat.seatAmount} 원</td>
                    <td>
                      <input type="checkbox" checked={true} disabled={true} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="coupon">
            <label>쿠폰 코드 : </label>
            <input
              type="text"
              value={couponCode}
              onChange={handleCouponCodeChange}
            />
            <button onClick={applyCoupon}>적용</button>
            {selectedCoupons.map((coupon) => (
              <div className="selected-coupon" key={coupon.couponCode}>
                <p>쿠폰 이름: {coupon.couponName}</p>
                <p>할인율: {coupon.discount}%</p>
                <button onClick={() => removeCoupon(coupon.couponCode)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="right-panel">
        <div className="summary">
          <p>
            <strong>좌석:</strong> {priceInfo.selectedSeats}
          </p>
          <div className="lien"></div>

          <div className="woodong">
            <p>
              <div>
                <strong>일시:</strong>{" "}
              </div>
              <div className="woo">{priceInfo.selectedDate}</div>
            </p>
          </div>

          <div className="lien"></div>
          <p>
            <strong>티켓금액:</strong> {ticketPrice}원
          </p>
          <div className="lien"></div>
          <p>
            <strong>쿠폰 할인:</strong> {couponDiscounts}원
          </p>
          <div className="lien"></div>
          <p>
            <strong>총 금액:</strong> {amount}원
          </p>
          <div className="lien"></div>
          <p>
            <strong>취소기한:</strong> 이틀 24시간 이전까지 무료 취소
          </p>
        </div>
      </div>
      <div className="next-button">
        <button className="modal_button" onClick={handlePreStep}>
          이전단계
        </button>
        <button className="modal_button" onClick={handleNextStep}>
          다음단계
        </button>
      </div>
    </div>
  );
};

export default SelectPrice;
