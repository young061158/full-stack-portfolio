import React, { useState } from 'react';
import ModalSeat from './component/ModalSeat.tsx';
import ModalRound from './component/ModalRound.tsx';
import ModalCoupon from './component/ModalCoupon.tsx';


const ModalStageCreate = ({ handleModalRound, handleModalSeat, handleModalCoupon, roundSetting, handleLimit, roundList, stage, couponList, setShowModal }) => {
  const [page, setPage] = useState<number>(0);


  return (
    <div className='modal-bg'>
    <div className="add-modal">
      <div className="modal-top">
        <div className="title">등록하기</div>
        <div className="close-icon" onClick={() => { setShowModal(false) }}>
          <div className="line"></div>
        </div>
        <div className="divider"></div>
        <div className="steps-container">
          <div className={`step ${page === 0 ? "active" : ""}`}>좌석 등록</div>
          <div className={`triangle ${page === 0 ? "active" : ""}`}></div>
          <div className={`double-triangle ${page === 1 ? "active" : ""}`}></div>
          <div className={`step ${page === 1 ? "active" : ""}`}>회차 등록</div>
          <div className={`triangle ${page === 1 ? "active" : ""}`}></div>
          <div className={`double-triangle ${page === 2 ? "active" : ""}`}></div>
          <div className={`step ${page === 2 ? "active" : ""}`}>쿠폰 등록</div>
        </div>
        {page === 0 && (
          <ModalSeat
            handleModal={handleModalSeat}
            handleLimit={handleLimit}
            page={page} setPage={setPage}
            stage={stage}
          />
        )}
        {page === 1 && (
          <ModalRound
            handleModal={handleModalRound}
            roundSetting={roundSetting}
            page={page} setPage={setPage}
            roundList={roundList}
          />
        )}
        {page === 2 && (
          <ModalCoupon
            handleModal={handleModalCoupon}
            setShowModal={setShowModal}
            couponList={couponList}
          />
        )}

        <div className="btn-container">
          <button className="button btn-prev" onClick={() => setPage(page - 1)} style={{ display: page <= 0 ? 'none' : 'block' }}>이전</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ModalStageCreate;
