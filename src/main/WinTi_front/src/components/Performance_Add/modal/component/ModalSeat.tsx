import React, { useState, useEffect, useRef } from 'react';
// import {createStage} from "../../../../axios/performance_add/stage"
// import {removeStage} from "../../../../axios/performance_add/stage.js"

import { Seat } from '../../../../interface/performance';

interface Initial {
  maxCol: number;
  maxRow: number;
  maxSeat: number | undefined;
  ticketLimit: number | undefined;
  s_amount: number | undefined;
  r_amount: number | undefined;
  vip_amount: number | undefined;
  null_amount: undefined;
}

const ModalSeat = ({ handleModal, handleLimit, page, setPage, stage }) => {

  const maxSeatInputRef = useRef<HTMLInputElement>(null); // 좌석 세팅 ref
  const ticketLimitInputRef = useRef<HTMLInputElement>(null); // 구매 리밋 ref

  const [setting, setSetting] = useState<Initial>({
    maxCol: 11,
    maxRow: 5,
    maxSeat: undefined,
    ticketLimit: undefined,
    s_amount: undefined,
    r_amount: undefined,
    vip_amount: undefined,
    null_amount: undefined,
  });

  const { maxCol, maxRow, maxSeat, ticketLimit, s_amount, r_amount, vip_amount, null_amount } = setting;

  const [currentRank, setCurrentRank] = useState('empty');

  const [stageDto, setStageDto] = useState<Seat[]>([])

  const stageCreate = () => {
    const newStage: Seat[] = [];

    for (let row = 1; row <= maxRow; row++) {
      let char = String.fromCharCode(64 + row);
      for (let col = 1; col <= maxCol; col++) {
        newStage.push({
          seatName: char + "-" + col,
          colSeat: col,
          rowSeat: row,
          seatClass: 's',
          seatAmount: undefined,
          isReserved: false,
        });
      }
    }
    return newStage;
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
    const seatSize = Math.max(20, 300 / Math.max(maxRow, maxCol)); // Set a minimum size of 50px
    const updatedSeats: JSX.Element[] = [];

    let seatCount = 0;
    stageDto.map((seat: Seat, index: number) => {
      seatCount++
      if (seat.seatClass === "empty") {
        seatCount--
      }
      updatedSeats.push(
        <span
          key={seat.seatName}
          className={`seat ${seat.seatClass}`}
          onClick={() => handleSeatClick(index, seat, currentRank)}
          style={{ width: `${seatSize}px`, height: `${seatSize}px`, cursor: 'pointer' }}
        >
          <span className={`seat-content seat_${seat.rowSeat}_${seat.colSeat}_${seat.seatClass}`} style={{ width: `${seatSize}px`, fontSize: `${seatSize * 0.4}px` }}>
            {seat.seatClass === "empty" ? "X" : seatCount}
          </span>
        </span>
      );

      let char = numberToTextMessage(seat.rowSeat);
      if (index % maxCol === maxCol - 1) {
        if (maxCol - seatCount == maxCol) {
          updatedSeats.push(
            <span className="seatInfo" style={{ fontSize: `${seatSize * 0.7}px` }}>
            </span>
          );
        } else {
          updatedSeats.push(
            <span className="seatInfo" style={{ fontSize: `${seatSize * 0.7}px` }}>
              {char}
            </span>
          );
        }
      }

      if (maxCol == seat.colSeat) {
        updatedSeats.push(<br />);
        seatCount = 0;
      }

    });
    return updatedSeats;
  };
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


  const handleCurrentRank = (e) => {
    setCurrentRank(e.target.value);
  };

  const handleSetting = (e) => {
    const { name, value } = e.target;

    const inputValue = value.replace(/\D/g, '');

    setSetting((prevSeat) => ({
      ...prevSeat,
      [name]: inputValue,
    }));
  };

  const handleSeatClick = (index: number, seat: Seat, rank: string) => {
    const updatedSeat: Seat = {
      ...seat,
      seatClass: rank,
    };

    const updatedStage = [...stageDto];
    updatedStage[index] = updatedSeat;

    setStageDto(updatedStage);
  };

  const onClickStageFixed = () => {
    const seatNull = stageDto.length - stageDto.filter((s: Seat) => s.seatClass === "empty").length;

    if (seatNull <= 0) {
      alert("등록 좌석이 없습니다.")
      if (maxSeatInputRef.current) {
        maxSeatInputRef.current.focus()
      }
      return;
    }

    // 티켓 리밋 확인
    if (ticketLimit === undefined || ticketLimit <= 0) {
      alert("구매석 수량이 입력 되지 않았습니다.")
      if (ticketLimitInputRef.current) {
        ticketLimitInputRef.current.focus()
      }
      return;
    }


    const stage_count_s = stageDto.filter((s: Seat) => s.seatClass === "s").length;
    const stage_count_r = stageDto.filter((s: Seat) => s.seatClass === "r").length;
    const stage_count_vip = stageDto.filter((s: Seat) => s.seatClass === "vip").length;

    const s_price = s_amount ? parseInt(s_amount.toString(), 10) : 0;
    const r_price = r_amount ? parseInt(r_amount.toString(), 10) : 0;
    const vip_price = vip_amount ? parseInt(vip_amount.toString(), 10) : 0;

    // 좌석 가격이 100원 단위인지 확인
    if (s_price % 100 !== 0 || r_price % 100 !== 0 || vip_price % 100 !== 0) {
      alert("좌석 가격은 100원 단위로만 입력 가능합니다.");
      return;
    }



    // S 석의 가격이 R 석이나 VIP 석의 가격보다 높은지 확인
    if (stage_count_s > 0) {
      if (stage_count_r > 0 && s_price > r_price) {
        alert("S 석이 R 석보다 가격이 큽니다.");
        return;
      }
      if (stage_count_vip > 0 && s_price > vip_price) {
        alert("S 석이 VIP 석보다 가격이 큽니다.");
        return;
      }
    }

    // R 석의 가격이 VIP 석의 가격보다 높은지 확인
    if (stage_count_r > 0) {
      if (stage_count_vip > 0 && r_price > vip_price) {
        alert("R 석이 VIP 석보다 가격이 큽니다.");
        return;
      }
    }

    if ((stage_count_s > 0 && s_price < 100) || (stage_count_r > 0 && r_price < 100) || (stage_count_vip > 0 && vip_price < 100)) {
      alert("최소 등록 금액은 100원 입니다.")
      return;
    }



    // 배치석 확인
    const currentSeatCount = stageDto.filter((s: Seat) => s.seatClass !== "empty").length;

    if (maxSeat == currentSeatCount) {
      alert(`최대 배치석과 실제 자리가 일치합니다`)
    } else {
      if (maxSeat === undefined && maxCol * maxRow == currentSeatCount) {
        const alertConfirm = window.confirm("빈 좌석 없이 등록하시겠습니까?");
        if (alertConfirm) {
          alert(`최대 배치석과 실제 자리가 일치합니다`)
        } else {
          return;
        }
      } else {
        alert(`최대 배치석과 실제 배치된 좌석 수가 일치하지 않습니다.\n 현재 배치석 : ${currentSeatCount} \n 목표 배치석 : ${(maxSeat === undefined) ? maxCol * maxRow : maxSeat}`);
        if (maxSeatInputRef.current) {
          maxSeatInputRef.current.focus()
        }
        return;
      }
    }

    // 좌석 전체 가격 업데이트
    const updatedStage = stageDto.map((s: Seat) => {
      if (s.seatClass === "s") {
        return {
          ...s,
          seatAmount: s_amount === undefined ? 0 : s_amount,
          isReserved: false
        };
      } else if (s.seatClass === "r") {
        return {
          ...s,
          seatAmount: r_amount === undefined ? 0 : r_amount,
          isReserved: false
        };
      } else if (s.seatClass === "vip") {
        return {
          ...s,
          seatAmount: vip_amount === undefined ? 0 : vip_amount,
          isReserved: false
        };
      } else if (s.seatClass === "empty") {
        return {
          ...s,
          seatAmount: 0,
          isReserved: true
        };
      } else {
        return s;
      }
    });

    updatedStage.sort((a, b) => {
      let [rowA, colA] = a.seatName.split('-');
      let [rowB, colB] = b.seatName.split('-');

      let rowValA = rowA.charCodeAt(0);
      let rowValB = rowB.charCodeAt(0);

      if (rowValA !== rowValB) {
        return rowValA - rowValB;
      }

      return parseInt(colA) - parseInt(colB);
    });

    handleModal(updatedStage);
    handleLimit(ticketLimit)
    setPage(page + 1)
  };

  useEffect(() => {
    if (stage.length >= 1) {
      const stageMaxRow = findMaxRowSeat(stage)
      const stageMaxCol = findMaxColSeat(stage)
      const stageMaxSeat = stage.filter((s: Seat) => s.seatClass !== "empty").length;

      // Filter seats based on class
      const stage_s = stage.filter((s: Seat) => s.seatClass === "s");
      const stage_r = stage.filter((s: Seat) => s.seatClass === "r");
      const stage_vip = stage.filter((s: Seat) => s.seatClass === "vip");

      // Calculate prices for each class
      const s_amount = stage_s.length > 0 ? stage_s[0].seatAmount || 0 : 0;
      const r_amount = stage_r.length > 0 ? stage_r[0].seatAmount || 0 : 0;
      const vip_amount = stage_vip.length > 0 ? stage_vip[0].seatAmount || 0 : 0;

      setSetting({
        maxCol: stageMaxCol,
        maxRow: stageMaxRow,
        maxSeat: stageMaxSeat,
        ticketLimit: undefined,
        s_amount: s_amount,
        r_amount: r_amount,
        vip_amount: vip_amount,
        null_amount: undefined,
      });
    }
  }, [])

  useEffect(() => {
    setStageDto(stageCreate());
  }, [maxCol, maxRow]);

  return (
    <div className="seat-modal">
      <div className="stage-box">
        <div className="instruction">좌석 등급을 선택해 주세요.</div>
        <div className="stage">stage</div>
        <div className="seat-box">{seatTable()}</div>
      </div>

      <div className="settings-container">
        <label className='setting-title' htmlFor="">공연장 설정</label>
        <div className="input-group">
          <div className="row-setting">
            <label htmlFor="maxRow">행</label>
            <input type="text" placeholder="행" name="maxRow" onChange={handleSetting} value={maxRow} />
          </div>
          <div className="col-setting">
            <label htmlFor="maxCol">열</label>
            <input type="text" placeholder="열" name="maxCol" onChange={handleSetting} value={maxCol} />
          </div>
        </div>
        <div className="max-purchase-seating">
          <label className="max-seating">최대 배치석</label>
          <input
            ref={maxSeatInputRef} // Assigning the ref to the input field
            type='text'
            name="maxSeat"
            placeholder={`최대 : ${maxCol * maxRow}            현재 : ${maxCol * maxRow - stageDto.filter((s: Seat) => s.seatClass === "empty").length}`}
            onChange={handleSetting}
            value={maxSeat}
          />
        </div>
        <div className="max-purchase-seating">
          <label className="max-seating">최대 구매석</label>
          <input
            type="text"
            ref={ticketLimitInputRef}
            name="ticketLimit"
            placeholder="인당 구매 좌석"
            onChange={handleSetting}
            value={ticketLimit}
          />
        </div>
        <div className="seat-pricing">
          <div className="seat-type">
            <label onChange={handleSetting} >
              <input type="radio" name="rank" value="s" onClick={handleCurrentRank} />
              <div className="square square-s"></div>
              <input type="text" name="s_amount" placeholder="S석 금액 입력" onChange={handleSetting} value={s_amount} />
            </label>
          </div>
          <div className="seat-type">
            <label onChange={handleSetting} >
              <input type="radio" name="rank" value="r" onClick={handleCurrentRank} />
              <div className="square square-r"></div>
              <input type="text" name="r_amount" placeholder="R석 금액 입력" value={r_amount} />
            </label>
          </div>
          <div className="seat-type">
            <label onClick={handleCurrentRank} >
              <input type="radio" name="rank" value="vip" />
              <div className="square square-vip"></div>
              <input type="text" name="vip_amount" placeholder="VIP석 금액 입력" onChange={handleSetting} value={vip_amount} />
            </label>
          </div>
          <div className="seat-type">
            <label onClick={handleCurrentRank}>
              <input type="radio" name="rank" value="empty" defaultChecked />
              <div className="square square-empty"></div>
              <input type="text" name="null_amount" placeholder="제외 좌석 선택" value={null_amount} readOnly />
            </label>
          </div>
        </div>
        <div className="btn-container">
          <button
            className="button btn-next"
            onClick={onClickStageFixed}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSeat;
