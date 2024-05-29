import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Icon } from "@iconify/react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import ResponseCode from "../../axios/types/enums/response-code.enum.ts";
import { findUserRequest } from "../../axios/MemberAxios.ts";

Modal.setAppElement('#root');

const MobileTicket = ({ modalIsOpen, closeModal }) => {
  const [qrCodeURL, setQrCodeURL] = useState('');
  const [closestTicket, setClosestTicket] = useState(null);
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

  useEffect(() => {
    const token = cookies.accessToken;
    const requestBody = { token };
    findUserRequest(requestBody).then(findUserResponse);
    console.log("Seller_Registration 페이지 유저 정보 찾기");
  }, [cookies, userId]);

  useEffect(() => {
    async function fetchQRCode() {
      try {
        const seatsString = closestTicket.selectedSeats.join(',');
        const response = await axios.get('http://localhost:8080/generateQRCode', {
          params: {
            date: closestTicket.payDateString,
            title: closestTicket.name,
            count: closestTicket.selectedSeats.length,
            price: closestTicket.amount,
            seat: seatsString,
            purchaser: closestTicket.buyerName,
          },
          responseType: 'blob'
        });

        const qrCodeURL = URL.createObjectURL(response.data);
        setQrCodeURL(qrCodeURL);
      } catch (error) {
        console.error("Error fetching QR code:", error);
      }
    }

    fetchQRCode();
  }, [closestTicket]);

  useEffect(() => {
    async function fetchClosestTicket() {
      try {
        const response = await axios.get('http://localhost:8080/api/buy/recentShow', {
          params: { userId }
        });

        setClosestTicket(response.data);
      } catch (error) {
        console.error("Error fetching closest ticket:", error);
      }
    }

    if (modalIsOpen) {
      fetchClosestTicket();
    }
  }, [modalIsOpen, userId]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const formatSeats = (seats) => {
    return seats.join(', ');
  };

  console.log(closestTicket);
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="모바일 티켓"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          height: '800px',
          width: '500px'
        }
      }}
    >
      <div className='MobileTicket'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>모바일 티켓</h3>
          <button onClick={closeModal}>
            <Icon icon="ic:round-close" width="2rem" height="2rem" style={{ color: '#8a4aed' }} className='closeBtn' />
          </button>
        </div>
        <hr />
        <div>
          {closestTicket ? (
            <ul className='ticketInfo'>
              <li className='ticket1th'><img src={"http://localhost:8080" + closestTicket.posterPath1} alt="티켓 이미지" /></li>
              <li className='ticket2th'>{closestTicket.name}</li>
              <li className='ticket3th'>일시 | {closestTicket.payDateString}</li>
              <li className='ticket4th'>매수 | {closestTicket.selectedSeats.length}</li>
              <li className='ticket5th'>가격 | {formatAmount(closestTicket.amount)}원</li>
              <li className='ticket6th'>좌석 | {formatSeats(closestTicket.selectedSeats)}</li>
              <li className='ticket7th'>장소 | {closestTicket.address}</li>
              <li className='ticket8th'>예매자명 | {closestTicket.buyerName}</li>
              <li className='ticket9th'><img src={qrCodeURL} alt="QR 코드" /></li>
            </ul>
          ) : (
            <p>예매한 티켓이 없습니다.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MobileTicket;
