import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ResponseCode from "../../../axios/types/enums/response-code.enum.ts";
import { findUserRequest } from "../../../axios/MemberAxios.ts";
import { useCookies } from "react-cookie";

const ReservationShow = () => {
  const { reservationShowId } = useParams();
  const [showDetails, setShowDetails] = useState({});
  const [cookies] = useCookies(); // 토큰에서 유저정보 가져오기
  const [userId, setUserId] = useState(""); // 유저 아이디
  const navigate = useNavigate();

  const findUserResponse = (ResponseBody) => {
    if (!ResponseBody) return;
    const { code, id } = ResponseBody;
    if (code === ResponseCode.SIGN_IN_FAIL)
      alert("등록되지 않은 사용자 입니다.");
    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("로그인이 필요한 서비스 입니다.");
      navigate("/Login");
    }
    if (code === ResponseCode.SUCCESS) {
      if (id !== undefined) {
        setUserId(id);
      }
      console.log(id);
    }
  };

  const findseller_user = () => {
    if (reservationShowId) {
      const fetchShowDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/reservation/${reservationShowId}`
          );
          setShowDetails(response.data);
        } catch (error) {
          console.error("Error fetching show details:", error);
          navigate("/error");
        }
      };

      fetchShowDetails();
    }
  };

  useEffect(() => {
    const token = cookies.accessToken;
    const requestBody = { token };
    findUserRequest(requestBody).then(findUserResponse);
    findseller_user();
    console.log("Seller_Registration 페이지 유저 정보 찾기");
  }, [cookies, userId]);

  console.log(showDetails);

  return (
    <div className="ticket-detail">
      <h2 className="line-h2">
        <span>예매 상세 내역</span>
        <span className="head-side">
          마이페이지 {">"} 예매내역 {">"}
          <span>예매상세내역</span>
        </span>
      </h2>

      <div className="ticket-detail-header">
        <div className="image-container">
          <img
            src={"http://localhost:8080" + showDetails.posterPath1}
            alt="Exhibition"
            className="ticket-image"
          />
          <button
            className="move-button"
            onClick={() => navigate(`/performance/${showDetails.showId}`)}
          >
            상세 페이지
          </button>
        </div>

        <div className="detail-container">
          <div className="detail-section">
            <h3>상품</h3>
            <div>{showDetails.name}</div>
          </div>
          <div className="detail-section">
            <h3>예약번호</h3>
            <div>{showDetails.paymentId}</div>
          </div>
          <div className="detail-section">
            <h3>장소</h3>
            <div>{showDetails.address}</div>
          </div>
          <div className="detail-section">
            <h3>일시</h3>
            <div>{showDetails.selectedDate}</div>
          </div>
          <div className="detail-section">
            <h3>좌석</h3>
            <div>
              {showDetails.selectedSeats &&
                showDetails.selectedSeats.map((seatName, index) => (
                  <span key={index}>{seatName}</span>
                ))}
            </div>
          </div>
          <div className="detail-section">
            <h3>예매자</h3>
            <div>{showDetails.buyerName}</div>
          </div>
          <div className="detail-section">
            <h3>티켓수령방법</h3>
            <div>Mobile</div>
          </div>
        </div>
      </div>
      <div className="ticket-detail-body">
        <h2>결제 상세 정보</h2>
        <div className="section">
          <div className="detail-section">
            <h3>예매일</h3>
            <div>{showDetails.payDateString}</div>
          </div>
          <div className="detail-section">
            <h3>결제금액</h3>
            <div>{showDetails.amount} 원</div>
          </div>
          <div className="detail-section">
            <h3>카드 결제</h3>
            <div>
              {showDetails.status === "OK" ? "결제완료" : showDetails.status}
            </div>
          </div>
        </div>
        <h2>취소 유의사항</h2>
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>취소기간</th>
                <th>취소수수료</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>예매 후 ~ 관람일 10일 전까지</td>
                <td>없음</td>
              </tr>
              <tr>
                <td>관람일 9일 전 ~ 관람일 3일 전까지</td>
                <td>티켓금액의 10%</td>
              </tr>
              <tr>
                <td>관람일 2일 전 ~ 관람일 1일 전까지</td>
                <td>티켓금액의 30%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationShow;
