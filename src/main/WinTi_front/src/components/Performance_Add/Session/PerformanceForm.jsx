import React, { useEffect, useState } from "react";
import UserAddress from "../../Login/UserAddress.jsx";
import { useParams } from "react-router-dom";

export const PerformanceForm = ({ showInfo, onSubmitShow }) => {
  const { modifyShowId } = useParams();
  const [readOnly, setReadOnly] = useState(false);

  const [performanceData, setPerformanceData] = useState({
    title: "",
    subTitle: "",
    startDate: "",
    endDate: "",
    category: "",
    runtime: "",
    showAddress: "",
    showSubAddress: "",
    bank: "",
    accountNumber: "",
    showAge: "",
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPostCode = () => {
    if (modifyShowId == null) {
      setIsPopupOpen(true);
    } else {
      alert("주소 수정은 불가능합니다.");
    }
  };

  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  const handleAddressSelect = (selectedAddress) => {
    setPerformanceData((prevData) => ({
      ...prevData,
      showAddress: selectedAddress,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "subTitle" && value.length > 10) {
      alert("부제목은 10글자 이하만 허용됩니다.");
      return;
    }

    if (name === "runtime" || name === "accountNumber") {
      if (!/^\d*$/.test(value)) {
        alert("숫자만 입력 가능합니다.");
        return;
      }
    }

    setPerformanceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "title",
      "subTitle",
      "startDate",
      "endDate",
      "category",
      "runtime",
      "showAddress",
      "showSubAddress",
      "bank",
      "accountNumber",
      "showAge",
    ];
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!performanceData[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      const missingFieldLabels = missingFields.map((field) => {
        switch (field) {
          case "title":
            return "공연 제목";
          case "subTitle":
            return "부제목";
          case "startDate":
            return "공연 시작일";
          case "endDate":
            return "공연 종료일";
          case "category":
            return "공연 장르";
          case "runtime":
            return "공연 런타임";
          case "showAddress":
            return "공연 장소";
          case "showSubAddress":
            return "상세 주소";
          case "bank":
            return "은행 선택";
          case "accountNumber":
            return "계좌번호";
          case "showAge":
            return "관람등급";
          default:
            return "";
        }
      });

      alert(`${missingFieldLabels.join(", ")}를 입력해주세요.`);
    } else {
      const today = new Date().toISOString().split("T")[0];

      if (performanceData.startDate <= today) {
        alert("공연 시작일은 오늘 이후 날짜만 가능합니다.");
        return;
      }

      if (performanceData.endDate < performanceData.startDate) {
        alert("공연 종료일은 공연 시작일 이후여야 합니다.");
        return;
      }

      onSubmitShow(performanceData);
      alert("정상적으로 등록되었습니다.");
    }
  };

  useEffect(() => {
    // Check if id exists
    if (modifyShowId) {
      // If id exists, set readOnly to true
      setReadOnly(true);
    }
  }, [modifyShowId]);

  useEffect(() => {
    setPerformanceData(showInfo);
  }, [showInfo]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().split("T")[0];

  return (
    <section className="data-form">
      <div className="performance-form">
        <div className="form-header">
          <h1>공연 등록</h1>
          <hr />
        </div>
        <div className="form-content">
          <form>
            <div className="input-show-group">
              <label>공연 제목</label>
              <input
                type="text"
                placeholder="공연 제목"
                className="input-field"
                name="title"
                value={performanceData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-show-group">
              <label>부제목 (10글자까지 가능)</label>
              <input
                type="text"
                placeholder="공연 부제목"
                className="input-field"
                name="subTitle"
                value={performanceData.subTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="date-group">
              <div className="input-show-group">
                <label>공연 시작일</label>
                <input
                  type="date"
                  className="input-field"
                  name="startDate"
                  value={performanceData.startDate}
                  onChange={handleChange}
                  min={tomorrowISO}
                  required
                />
              </div>
              <span>~</span>
              <div className="input-show-group">
                <label>공연 종료일</label>
                <input
                  type="date"
                  className="input-field"
                  name="endDate"
                  value={performanceData.endDate}
                  onChange={handleChange}
                  min={performanceData.startDate}
                  required
                />
              </div>
            </div>
            <div className="genre-group">
              <div className="input-show-group">
                <label>공연 장르</label>
                <select
                  className="input-field"
                  name="category"
                  value={performanceData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">선택</option>
                  <option value="연극">연극</option>
                  <option value="뮤지컬">뮤지컬</option>
                  <option value="콘서트">콘서트</option>
                  <option value="클래식">클래식</option>
                  <option value="아동">아동</option>
                </select>
              </div>
              <div className="input-show-group">
                <label>공연 런타임</label>
                <input
                  type="text"
                  className="input-field"
                  name="runtime"
                  value={performanceData.runtime}
                  onChange={handleChange}
                  readOnly={readOnly}
                  required
                />
              </div>
            </div>
            <div className="address-group">
              <div className="input-show-group">
                <label>공연 장소</label>
                <input
                  value={performanceData.showAddress}
                  className="input-field"
                  type="text"
                  placeholder="공연장주소"
                  readOnly
                  required
                />
                <input
                  type="text"
                  placeholder="공연장 상세주소"
                  className="input-address"
                  name="showSubAddress"
                  value={performanceData.showSubAddress}
                  onChange={handleChange}
                  readOnly={readOnly}
                  required
                />
              </div>
              <button
                type="button"
                className="search-button"
                onClick={openPostCode}
              >
                주소검색
              </button>
            </div>
            <div className="bank-group">
              <div className="input-show-group">
                <label>은행 선택</label>
                {readOnly ? (
                  <input
                    className="input-field"
                    name="bank"
                    value={performanceData.bank}
                    readOnly
                    required
                  />
                ) : (
                  <select
                    className="input-field"
                    name="bank"
                    value={performanceData.bank}
                    onChange={handleChange}
                    required
                  >
                    <option value="">선택</option>
                    <option value="KB국민은행">KB국민은행</option>
                    <option value="신한은행">신한은행</option>
                    <option value="우리은행">우리은행</option>
                    <option value="하나은행">하나은행</option>
                    <option value="기업은행">기업은행</option>
                    <option value="농협은행">농협은행</option>
                    <option value="KDB산업은행">KDB산업은행</option>
                    <option value="SC제일은행">SC제일은행</option>
                    <option value="씨티은행">씨티은행</option>
                    <option value="부산은행">부산은행</option>
                    <option value="광주은행">광주은행</option>
                    <option value="대구은행">대구은행</option>
                    <option value="전북은행">전북은행</option>
                    <option value="경남은행">경남은행</option>
                    <option value="제주은행">제주은행</option>
                  </select>
                )}
              </div>
              <div className="input-show-group">
                <input
                  type="text"
                  placeholder="계좌번호 입력"
                  className="input-account-field input-field"
                  name="accountNumber"
                  value={performanceData.accountNumber}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div className="show-age">
              <label>관람등급</label>
              <select
                className="input-field"
                name="showAge"
                value={performanceData.showAge}
                onChange={handleChange}
                required
              >
                <option value="">선택</option>
                <option value="전체이용가">전체이용가</option>
                <option value="12세 이상">12세 이상</option>
                <option value="15세 이상">15세 이상</option>
                <option value="19세 이상">19세 이상</option>
              </select>
              <div className="div-btn">
                <button
                  className="showSumit"
                  type="button"
                  onClick={handleSubmit}
                >
                  등록
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {isPopupOpen && (
        <div className="modal-bg">
          <popupDom>
            <UserAddress
              onClose={closePostCode}
              onAddressSelect={handleAddressSelect}
            />
          </popupDom>
        </div>
      )}
    </section>
  );
};

export default PerformanceForm;
