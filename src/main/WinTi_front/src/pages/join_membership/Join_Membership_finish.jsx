import React from "react";
import { ReactComponent as JoinImg3 } from "../../assets/img/join_membership/membership3.svg";
import { useNavigate } from "react-router-dom";

const Join_Membershipfinish = () => {
  const navigator = useNavigate();

  function finish(e) {
    navigator("/Login");
  }

  return (
    <div className="contWrap">
      <div className="Join2_Membership">
        <div className="img">
          <JoinImg3 />
        </div>
        <div className="join_finish">
          <div className="finish_1">가입이 완료되었습니다.</div>
          <div className="finish_2">다양한 서비스를 즐겨보세요!</div>

          <button className="btn-success" onClick={finish}>
            로그인 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join_Membershipfinish;
