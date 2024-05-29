import React from "react";

const ProgressBar = ({ currentStep }) => {
  const steps = [
    "등급/좌석 선택",
    "가격/할인 선택",
    "배송선택/예매확인",
    "결제하기",
  ];

  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${currentStep === index + 1 ? "active" : ""}`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
