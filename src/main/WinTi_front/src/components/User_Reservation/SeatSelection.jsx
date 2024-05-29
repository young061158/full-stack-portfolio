import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import nav from "../../assets/img/payment/nav.png";
import ProgressBar from "../../pages/payment/ProgressBar";

const SeatSelection = ({
  onNext,
  showDetails,
  paymentsId,
  setPaymentsId,
  updateSeatInfo,
  selectedDate,
  selectedTimeSlot,
  selectedRound,
  purchaseLimit,
}) => {
  const [seatSelectInfo, setSeatSelectInfo] = useState([]);
  const paymentId = paymentsId.paymentId;
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [cookies] = useCookies(["accessToken"]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [remainingSeats, setRemainingSeats] = useState({
    s: 0,
    r: 0,
    vip: 0,
  });

  const selectedDateTime = selectedRound.roundDate + selectedRound.roundTime;

  useEffect(() => {
    const fetchSeatingInfo = async () => {
      if (selectedRound) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/winti/show_add/seats/${selectedRound.roundId}`
          );
          setSeatSelectInfo(response.data);
          updateRemainingSeats(response.data, []);

          const uniqueRows = [
            ...new Set(response.data.map((seat) => String(seat.rowSeat))),
          ];
          const maxCol = Math.max(...response.data.map((seat) => seat.colSeat));
          setRows(uniqueRows.sort());
          setCols(Array.from({ length: maxCol }, (_, i) => i + 1));
        } catch (error) {
          console.error("Error fetching seating info:", error);
        }
      }
    };

    fetchSeatingInfo();
  }, [selectedRound]);

  const updateRemainingSeats = (seats, selectedSeats) => {
    const remaining = { s: 0, r: 0, vip: 0 };
    seats.forEach((seat) => {
      if (!seat.reserved && !selectedSeats.includes(seat.seatId)) {
        remaining[seat.seatClass]++;
      }
    });
    setRemainingSeats(remaining);
  };

  const handleNextStep = () => {
    handleSeatSelection();
  };

  const handleSeatClick = (seat) => {
    if (seat && !seat.reserved) {
      const isSelected = selectedSeats.includes(seat.seatId);
      let updatedSeats;

      if (isSelected) {
        updatedSeats = selectedSeats.filter((id) => id !== seat.seatId);
      } else if (selectedSeats.length < purchaseLimit) {
        updatedSeats = [...selectedSeats, seat.seatId];
      } else {
        return;
      }
      setSelectedSeats(updatedSeats);
      updateRemainingSeats(seatSelectInfo, updatedSeats);
    }
  };

  const handleSeatSelection = async () => {
    const seatData = selectedSeats.map((seatId) => {
      const seat = seatSelectInfo.find((seat) => seat.seatId === seatId);
      return {
        seatId: seat.seatId,
        roundId: selectedRound.roundId,
        seatName: seat.seatName,
        colSeat: seat.colSeat,
        rowSeat: seat.rowSeat,
        seatClass: seat.seatClass,
        seatAmount: seat.seatAmount,
        reserved: true,
      };
    });

    const selectedSeatNames = seatData.map((seat) => seat.seatName);

    const requestData = {
      paymentId: paymentsId.paymentId,
      seats: seatData,
      selectedDate: selectedDateTime,
      address: showDetails.performance.showAddress,
      name: showDetails.performance.title,
      selectedSeats: selectedSeatNames,
    };

    try {
      const token = cookies.accessToken;
      const response = await axios.post(
        "http://localhost:8080/api/payment/save-seating",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onNext();
      } else {
        throw new Error("Failed to select and save seats");
      }
    } catch (error) {
      console.error("Error selecting and saving seats:", error);
    }
  };

  const renderSeats = () => {
    return rows.map((row) => (
      <div key={row} className="seat-row">
        <div className="seat-row-label">{row}</div>
        {cols.map((col) => {
          const seat = seatSelectInfo.find(
            (seat) => String(seat.rowSeat) === row && seat.colSeat === col
          );
          if (seat) {
            return (
              <button
                key={`${row}-${col}`}
                className={`seat ${seat.seatClass} ${
                  seat.reserved ? "reserved" : ""
                } ${selectedSeats.includes(seat.seatId) ? "selected" : ""}`}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.reserved}
              >
                {col}
              </button>
            );
          } else {
            return (
              <button key={`${row}-${col}`} className="seat gray" disabled>
                X
              </button>
            );
          }
        })}
      </div>
    ));
  };

  return (
    <div className="seatSelectionContent">
      <div className="content-header">
        <div className="header-info">
          <div className="title">{showDetails.performance.title}</div>
          <div className="area-date">
            {showDetails.performance.showAddress +
              " " +
              showDetails.performance.showSubAddress}{" "}
            | {showDetails.performance.startDateString}
          </div>
        </div>

        <select className="select-box" disabled>
          <option>
            {selectedRound
              ? `${selectedRound.roundDate} ${selectedRound.roundTime}`
              : "Select a date and time"}
          </option>
        </select>
      </div>
      <div className="content-body">
        <div className="stage_seating">
          <div className="stage">stage</div>
          <div className="seat-grid-container">
            <div className="seat-grid">{renderSeats()}</div>
          </div>
        </div>
        <div className="info-section">
          <div className="member">좌석등급 / 잔여석</div>
          <div className="pricing-info">
            <div className="box-content">
              VIP 석 : {remainingSeats.vip}
              <br />S 석 : {remainingSeats.r}
              <br />R 석 : {remainingSeats.s}
            </div>
          </div>
          <div className="member2">선택좌석</div>
          <div className="seat-selection">
            <div className="member3">
              {selectedSeats
                .map((seatId) => {
                  const seat = seatSelectInfo.find(
                    (seat) => seat.seatId === seatId
                  );
                  return seat ? `${seat.seatName}` : "";
                })
                .join(", ")}
            </div>
            <div className="member4">
              총 {selectedSeats.length}석 선택되었습니다
            </div>
          </div>
          <div className="next-button">
            <button
              className="modal_button"
              onClick={handleNextStep}
              paymentsId={paymentsId}
              setPaymentsId={setPaymentsId}
              seatSelectInfo={seatSelectInfo}
              selectedRound={selectedRound}
            >
              다음단계
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
