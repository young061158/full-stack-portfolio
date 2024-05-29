import React, { useEffect, useState } from 'react';
import ModalStageCreate from '../modal/ModalStageCreate.tsx';
import { Coupon, Round, Seat } from '../../../interface/performance';
import { useParams } from 'react-router-dom';


const Preview = ({ handleModalRound, handleModalSeat, handleModalCoupon, roundSetting, handleLimit, roundList, stage, couponList }) => {

  const { modifyShowId } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [maxRow, setMaxRow] = useState(999);
  const [maxCol, setMaxCol] = useState(999);

  const findMaxRowSeat = (seats: Seat[]) => {
    let maxRowSeat = 0;
    for (let seat of seats) {
      if (seat.rowSeat > maxRowSeat) {
        maxRowSeat = seat.rowSeat;
      }
    }
    return maxRowSeat;
  };

  const findMaxColSeat = (seats: Seat[]) => {
    let maxColSeat = 0;
    for (let seat of seats) {
      if (seat.colSeat > maxColSeat) {
        maxColSeat = seat.colSeat;
      }
    }
    return maxColSeat;
  };

  /** 숫자를 문자로 받기 */
  function numberToTextMessage(number) {
    let result = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    while (number > 0) {
      const remainder = (number - 1) % 26; // Get the remainder after dividing by 26
      result = alphabet.charAt(remainder) + result; // Get the corresponding letter
      number = Math.floor((number - 1) / 26); // Update number
    }

    return result;
  }

  const seatTable = () => {
    const seatSize = Math.max(40, 300 / Math.max(maxRow, maxCol));
    const updatedSeats: JSX.Element[] = [];

    let seatCount = 0;

    stage.map((seat: Seat, index: number) => {
      seatCount++
      if (seat.seatClass === "empty") {
        seatCount--
      }
      updatedSeats.push(
        <span
          key={seat.seatName}
          className={`seat ${seat.seatClass}`}
          style={{ width: `${seatSize}px`, height: `${seatSize}px`, background: `${seat.seatClass === "empty" ? "#EFE6FF" : seat.seatClass}` }}
        >
          <span key={index} className={`seat-content seat_${seat.rowSeat}_${seat.colSeat}_${seat.seatClass}`} style={{ fontSize: `${seatSize * 0.4}px`, color: `${seat.seatClass === "empty" ? "#EFE6FF" : ""}` }}>
            {seat.seatClass === "empty" ? "X" : seatCount}
          </span>
        </span>
      );

      let char = numberToTextMessage(seat.rowSeat);
      if (index % maxCol === maxCol - 1) {
        if (maxCol - seatCount == maxCol) {
          updatedSeats.push(
            <span key={index + "_"} className="seatInfo" style={{ fontSize: `${seatSize * 0.7}px` }}>
            </span>
          );
        } else {
          updatedSeats.push(
            <span key={index + "-"} className="seatInfo" style={{ fontSize: `${seatSize * 0.7}px` }}>
              {char}
            </span>
          );
        }
      }

      if (maxCol == seat.colSeat) {
        updatedSeats.push(<br key={index} />);
        seatCount = 0;
      }

    });
    return updatedSeats;
  };

  const handleShowModal = () => {
    if (roundSetting.start_date === '') {
      alert("공연 정보가 등록 되지 않았습니다.")
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }
    setShowModal(true);
  };

  useEffect(() => {
    const maxRowValue = findMaxRowSeat(stage);
    const maxColValue = findMaxColSeat(stage);
    setMaxRow(maxRowValue);
    setMaxCol(maxColValue);
  }, [stage]);

  return (
    <div className='prev'>
      <div style={{ borderBottom: '1px solid', margin: "50px" }}></div>
      <p style={{ margin: '30px', fontSize: '20px', fontWeight: 'bold' }}>등록 미리보기</p>
      {modifyShowId == null &&
        <button className="btn-modal" onClick={handleShowModal}>등록</button>
      }

      {showModal && <ModalStageCreate
        handleModalRound={handleModalRound}
        handleModalSeat={handleModalSeat}
        handleModalCoupon={handleModalCoupon}
        roundSetting={roundSetting}
        handleLimit={handleLimit}
        roundList={roundList}
        stage={stage}
        couponList={couponList}
        setShowModal={setShowModal}
      />}
      <div className='stage-box'>
        <div className="stage">stage</div>
        <div className='seat-prev'>
          {seatTable()}
        </div>
      </div>
      <div className="div-round" style={{ maxWidth: '800px', margin: '150px auto' }}>
        <div style={{ borderBottom: '1px solid', margin: "50px" }}></div>
        <table className='round-table'>
          <thead>
            <tr>
              <th className='th-count'>회차</th>
              <th className='th-date'>날짜</th>
              <th className='th-time'>시간</th>
            </tr>
          </thead>
          <tbody>
            {roundList.map((round: Round, index) => (
              <tr key={index}>
                <td className='td-count'>{index + 1}</td>
                <td className='td-date'>{round.roundDate}</td>
                <td className='td-time'>{round.roundTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='div-coupon' style={{ maxWidth: '800px', margin: '150px auto' }}>
        <div style={{ borderBottom: '1px solid', margin: "50px" }}></div>
        <table className='coupon-table'>
          <thead>
            <tr>
              <th className='th-couponName'>쿠폰명</th>
              <th className='th-discount'>할인율</th>
              <th className='th-couponCode'>쿠폰번호</th>
            </tr>
          </thead>
          <tbody>
            {couponList.map((c: Coupon, index: number) => {
              if (c.couponCode.length === 6) {
                return (
                  <tr key={index}>
                    <td className='td-couponName'>{c.couponName}</td>
                    <td className='td-discount'>{c.discount}% </td>
                    <td className='td-couponCode'>{c.couponCode}</td>
                  </tr>
                )
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Preview;