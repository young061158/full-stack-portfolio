import React, { useState } from "react";
import { ModalPoster } from './ModalPoster';
import { ModalActor } from './ModalActor';

const ModalActAndPoster = ({ setShowModal, setPosterPath, setActorInfo }) => {
  const [page, setPage] = useState(0);

  // 모달 데이터를 저장하는 함수
  const handleModalData = (data) => {
    // 페이지에 따라서 다르게 처리
    if (page === 0) {
      setPosterPath(data);
    } else if (page === 1) {
      setActorInfo(data);
    }
  };

  //모달 닫기
  const handleShutdown = () => {
    const closeConfirm = window.confirm("정말 닫으시겠습니까? \n[지금 까지의 변경사항이 저장되지 않습니다.]");
    if (closeConfirm) {
      setShowModal(false);
    }
  }



  return (
    <div className="modal-bg">
    <div className="add-modal">
      <div className="modal-top">
        <div className="title">등록하기</div>
        <div className="close-icon" onClick={handleShutdown}>
          <div className="line"></div>
        </div>
        <div className="divider"></div>
        <div className="steps-container">
          <div className={`step ${page === 0 ? "active" : ""}`}>포스터 등록</div>
          <div className={`triangle ${page === 0 ? "active" : ""}`}></div>
          <div className={`double-triangle ${page === 1 ? "active" : ""}`}></div>
          <div className={`step ${page === 1 ? "active" : ""}`}>출연진 등록</div>
          {/* <div className={`triangle ${page === 1 ? "active" : ""}`}></div> */}
        </div>

        {page === 0 && (
          <ModalPoster
            page={page}
            setPage={setPage}
            onModalData={handleModalData}
          />
        )}
        {page === 1 && (
          <ModalActor
            setShowModal={setShowModal}
            onModalData={handleModalData}
          />
        )}

        {/* <div className="btn-container">
          <button className="button btn-prev" onClick={() => setPage(page - 1)} style={{ display: page <= 0 ? 'none' : 'block' }}>이전</button>
        </div> */}
      </div>
    </div>
    </div>
  );
};

export default ModalActAndPoster;
