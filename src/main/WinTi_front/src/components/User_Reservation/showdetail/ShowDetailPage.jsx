import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CalendarCP from "./CalendarCP"; // Import your custom calendar component
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import Modal from "../Modal";
import DetailsPage from "./DetailsPage";
import ReviewPage from "./ReviewPage";
import LocationInfo from "./LocationInfo";
import BookingInfo from "./BookingInfo";

import { formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";

const ShowDetailPage = () => {
  const [cookies] = useCookies(["accessToken"]);
  const [showDetails, setShowDetails] = useState({});
  const [rounds, setRounds] = useState([]);
  const [purchaseLimit, setPurchaseLimit] = useState(0);
  const { showId, id } = useParams();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentsId, setPaymentsId] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [activeTab, setActiveTab] = useState("A");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedRound, setSelectedRound] = useState(null);
  const [seatPrices, setSeatPrices] = useState({
    VIPPrice: 0,
    SPrice: 0,
    RPrice: 0,
  });

  const [remainingSeats, setRemainingSeats] = useState({
    VIPSeats: 0,
    SSeats: 0,
    RSeats: 0,
  });
  const [currentStep, setCurrentStep] = useState(1); // Add state for current ste

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleOnClick = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("날짜 및 시간을 선택해주세요"); // Show alert if date or time slot is not selected
      return;
    }
    handleShowInfo(showInfo);
    handleBooking();
    setCurrentStep(currentStep + 1); // Advance to the next step
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchRounds(date);
  };

  const fetchRounds = async (date) => {
    console.log(date);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/winti/show_add/round/${id}/rounds`,
        {
          params: { date },
        }
      );
      const data = response.data.map((round) => {
        try {
          console.log(round.roundTime);
          const parsedDate = parseISO(round.roundTime); // Ensure the roundTime is parsed correctly
          const kstFormattedDate = formatInTimeZone(
            parsedDate,
            "Asia/Seoul",
            "yyyy-MM-dd HH:mm"
          );
          return {
            ...round,
            roundTime: kstFormattedDate,
          };
        } catch (error) {
          console.error("Error parsing round time:", error);
          return round;
        }
      });
      setRounds(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };

  useEffect(() => {
    console.log(" " + id);
    if (id) {
      const fetchShowDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/performances/${id}`
          );
          setShowDetails(response.data);
          setPurchaseLimit(response.data.performance.ticketLimit);

          console.log(purchaseLimit);
        } catch (error) {
          console.error("Error fetching show details:", error);
          navigate("/error");
        }
      };

      fetchShowDetails();
    }
  }, [showId, navigate]);

  useEffect(() => {
    if (selectedDate) {
      fetchRounds(selectedDate);
    }
  }, [selectedDate]);

  const handleTimeSlotClick = (round) => {
    setSelectedTimeSlot(`${round.roundDate} ${round.roundTime}`);
    setSelectedRound(round); // Store the selected round details
  };

  useEffect(() => {
    if (selectedRound) {
      const fetchRemainingSeats = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/winti/show_add/seats/${selectedRound.roundId}`
          );
          const seatsData = response.data;
          // 잔여 좌석 계산

          const remainingSeats = {
            VIPSeats: seatsData.filter(
              (seat) => seat.seatClass === "vip" && !seat.reserved
            ).length,
            SSeats: seatsData.filter(
              (seat) => seat.seatClass === "r" && !seat.reserved
            ).length,
            RSeats: seatsData.filter(
              (seat) => seat.seatClass === "s" && !seat.reserved
            ).length,
          };
          const seatPrices = {
            VIPPrice:
              seatsData.find((seat) => seat.seatClass === "vip")?.seatAmount ||
              0,
            SPrice:
              seatsData.find((seat) => seat.seatClass === "r")?.seatAmount || 0,
            RPrice:
              seatsData.find((seat) => seat.seatClass === "s")?.seatAmount || 0,
          };
          setRemainingSeats(remainingSeats);
          setSeatPrices(seatPrices);
          setPurchaseLimit(response.data.performance.ticketLimit);
          console.log(purchaseLimit);
        } catch (error) {
          console.error("Error fetching seat information:", error);
        }
      };
      fetchRemainingSeats();
    }
  }, [selectedRound]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePaymentInfo = (showDetails) => {
    const token = cookies.accessToken;

    const PaymentData = {
      merchantUid: "nobody_" + new Date().getTime(),
      address: showDetails.performance.showAddress,
      startDate: showDetails.startDate,
      name: showDetails.performance.title,
      showId: showDetails.performance.showid,
      selectedDate: showDetails.selectedDate,
      posterPath1: showDetails.performance.posterPath1,
    };

    fetch("http://localhost:8080/api/payment/create", {
      method: "POST",
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

  const handleShowInfo = () => {
    const fetchShowInfo = {
      name: showDetails.title,
      area: showDetails.showAddress,
      startDate: showDetails.startDateString,
      firstTime: "10:30",
    };
    setShowInfo(fetchShowInfo);
    setModalVisible(true);
  };

  if (!showDetails || !showDetails.performance) {
    return <div>Loading...</div>;
  }

  const handleBooking = () => {
    const token = cookies.accessToken;
    handlePaymentInfo(showDetails);
    handleOpenModal();
  };

  return (
    <div className="show-container">
      <div className="showDetail-main">
        <div className="poster-title-container">
          <img
            src={`http://localhost:8080${
              showDetails?.performance?.posterPath1 || ""
            }`}
            alt="img"
            className="poster"
          />
          <div className="main-content">
            <label className="main-Title">
              {showDetails.performance.title}
            </label>
            <div className="information-container">
              <div className="Information">
                <span className="area">카테고리</span>
                <span className="area-title">
                  {showDetails.performance.category}
                </span>
              </div>
              <div className="Information">
                <span className="date">기간</span>
                <span className="date-main">
                  {showDetails.performance.startDateString}~
                  {showDetails.performance.endDateString}
                </span>
              </div>
              <div className="view-about">
                <span className="show-time">관람시간</span>
                <span className="run-time">
                  {showDetails.performance.runTime}
                </span>
              </div>
              <div className="view-about">
                <span className="view-etc">관람등급</span>
                <span className="etc">{showDetails.performance.showAge}</span>
              </div>
              <div className="price-section">
                <div className="price-details">
                  <div className="etc-price">
                    <span className="class-price">가격</span>
                    <span className="seat-VIP">VIP석</span>
                    <span className="seat-VIP-price">
                      {seatPrices.VIPPrice}원
                    </span>
                  </div>
                  <div className="etc-price">
                    <span className="seat-name">S석</span>
                    <span className="seat-R">{seatPrices.SPrice}원</span>
                  </div>
                  <div className="etc-price">
                    <span className="seat-name2">R석</span>
                    <span className="seat-S">{seatPrices.RPrice}원</span>
                  </div>
                </div>
              </div>
              <div className="price-sail">
                <div className="sail-item">
                  <span className="sails">상세주소</span>
                  <span className="sails-price">
                    {showDetails.performance.showAddress}
                  </span>
                </div>
                <div className="sail-item">
                  <span className="sails">세부주소</span>
                  <span className="sails-price">
                    {showDetails.performance.showSubAddress}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="DateSelect-container">
        <div className="column">
          <label className="show-date-select">관람일 선택</label>
          <CalendarCP
            onChange={handleDateChange}
            value={selectedDate}
            highlightedDates={highlightedDates}
            showDetails={showDetails}
            className="Calendar"
          />
        </div>
        <div className="column">
          <label className="show-session-select">회차 선택</label>
          {rounds.map((round, index) => (
            <button
              key={index}
              className={`session-button ${
                selectedTimeSlot === `${round.roundDate} ${round.roundTime}`
                  ? "active"
                  : ""
              }`}
              onClick={() => handleTimeSlotClick(round)}
            >
              {index + 1}회 {round.roundDate} {round.roundTime}
            </button>
          ))}
        </div>
        <div className="column">
          <label className="show-remaining-seat">잔여 좌석</label>
          <div className="seating">VIP석 {remainingSeats.VIPSeats} 석</div>
          <div className="seating2">S석 {remainingSeats.SSeats} 석</div>
          <div className="seating2">R석 {remainingSeats.RSeats} 석</div>

          <button className="Rectangle53" type="button" onClick={handleOnClick}>
            예매 하기
          </button>
          {isModalOpen && (
            <Modal
              onClose={handleCloseModal}
              showDetails={showDetails}
              paymentsId={paymentsId}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              selectedRound={selectedRound}
              purchaseLimit={purchaseLimit}
            />
          )}
        </div>
      </div>
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === "A" ? "active" : ""}`}
          onClick={() => handleTabClick("A")}
        >
          상세정보
        </button>
        <button
          className={`tab-button ${activeTab === "B" ? "active" : ""}`}
          onClick={() => handleTabClick("B")}
        >
          관람후기
        </button>
        <button
          className={`tab-button ${activeTab === "C" ? "active" : ""}`}
          onClick={() => handleTabClick("C")}
        >
          장소 정보
        </button>
        <button
          className={`tab-button ${activeTab === "D" ? "active" : ""}`}
          onClick={() => handleTabClick("D")}
        >
          예매/취소 안내
        </button>
      </div>
      <div className="banner-component">
        {activeTab === "A" && <DetailsPage showDetails={showDetails} />}
        {activeTab === "B" && <ReviewPage showDetails={showDetails} />}
        {activeTab === "C" && <LocationInfo showDetails={showDetails} />}
        {activeTab === "D" && <BookingInfo />}
      </div>
    </div>
  );
};

export default ShowDetailPage;
