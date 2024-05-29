import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SeatTable = () => {
  const [seats, setSeats] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    const response = await axios.get(`http://localhost:8080/api/seats/${id}`);
    setSeats(response.data);
  };

  const toggleReservation = async (seatId, isReserved) => {
    await axios.put(`http://localhost:8080/api/seats/${seatId}`, {
      id: seatId,
      isReserved: !isReserved,
    });
    fetchSeats(); // 상태 변경 후 좌석 데이터 새로고침
  };

  return (
    <div>
      {seats.map((seat) => {
        for (let i = 1; i < seat.maxCol + 1; i++) {
          if (seat.colSeat === i) {
            if (seat.rowSeat === seat.maxRow) {
              return (
                <>
                  <span
                    key={seat.id}
                    onClick={() => toggleReservation(seat.id, seat.isReserved)}
                    style={{
                      marginRight: "5px",
                      backgroundColor: seat.isReserved ? "#f00" : "#0f0",
                    }}
                    className={
                      seat.round.performance.mainTitle +
                      "_" +
                      seat.round.id +
                      "_" +
                      seat.colSeat +
                      "_" +
                      seat.rowSeat
                    }
                  >
                    {seat.colSeat}열_{seat.rowSeat}행
                  </span>
                  <br />
                </>
              );
            }
            return (
              <span
                key={seat.id}
                onClick={() => toggleReservation(seat.id, seat.isReserved)}
                style={{
                  marginRight: "5px",
                  backgroundColor: seat.isReserved ? "#f00" : "#0f0",
                }}
                className={
                  seat.round.performance.mainTitle +
                  "_" +
                  seat.round.id +
                  "_" +
                  seat.colSeat +
                  "_" +
                  seat.rowSeat
                }
              >
                {seat.colSeat}열_{seat.rowSeat}행
              </span>
            );
          }
        }
      })}
    </div>
  );
};

export default SeatTable;
