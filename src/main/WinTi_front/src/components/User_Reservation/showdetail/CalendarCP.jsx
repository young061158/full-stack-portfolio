import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const StyledCalendarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .react-calendar {
    width: 100%;
    max-width: 600px; /* 캘린더의 최대 너비 설정 */
    border: none;
    border-radius: 0.5rem;
    box-shadow: 4px 2px 10px 0px rgba(0, 0, 0, 0.13);
    background-color: white;
  }

  .react-calendar__navigation {
    justify-content: center;
  }

  .react-calendar__tile--now {
    background: none;
    abbr {
      color: #4f46e5; /* primary color */
    }
  }

  .react-calendar__tile--active {
    background-color: #fbbf24; /* yellow */
    border-radius: 0.3rem;
  }

  .highlight {
    background-color: #76baff; /* 하이라이트 색상 */
    color: white;
  }
`;

const CalendarCP = ({ onChange, value }) => {
  const { id } = useParams();
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/winti/show_add/round/list/${id}`
        );
        const fetchedDates = response.data.map(
          (round) => new Date(`${round.roundDate}T${round.roundTime}:00`)
        );
        setDates(fetchedDates);
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };

    fetchDates();
  }, [id]);

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <StyledCalendarWrapper>
      <Calendar
        onChange={onChange}
        value={value}
        calendarType="gregory"
        showNeighboringMonth={false}
        tileClassName={({ date, view }) =>
          dates.some((d) => isSameDay(d, date)) ? "highlight" : null
        }
      />
    </StyledCalendarWrapper>
  );
};

export default CalendarCP;
