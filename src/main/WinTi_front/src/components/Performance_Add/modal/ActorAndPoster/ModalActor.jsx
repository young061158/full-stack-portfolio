import React, { useState, useRef } from "react";
import Slider from "react-slick";
import { Icon } from "@iconify/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const ModalActor = ({ setShowModal, onModalData }) => {
  const [actorName, setActorName] = useState(""); // 배우 이름
  const [roleName, setRoleName] = useState(""); // 캐릭터 이름
  const [imageFile, setImageFile] = useState(null); // 선택된 배우 이미지
  const fileInputRef = useRef(null);

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [slides, setSlides] = useState([]);
  const slideContainerRef = useRef(null);

  //input 배우이름
  const handleActorNameChange = (event) => {
    const value = event.target.value;
    if (/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s]/.test(value)) {
      alert("특수문자는 입력이 불가능합니다.");
      return;
    }
    setActorName(value);
  };

  //input 배역이름
  const handleRoleNameChange = (event) => {
    const value = event.target.value;
    if (/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s]/.test(value)) {
      alert("특수문자는 입력이 불가능합니다.");
      return;
    }
    setRoleName(value);
  };

  //input 배우프로필사진
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      if (/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s.]/.test(fileName)) {
        alert("파일 이름에 특수문자가 포함되어 있습니다.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBackgroundImage(null);
    }
  };

  //슬라이드
  const handleAddSlide = () => {
    if (actorName && roleName && imageFile) {
      const newSlide = {
        actorName: actorName,
        roleName: roleName,
        imageFile: imageFile,
      };
      setSlides((prevSlides) => [...prevSlides, newSlide]);
      setActorName("");
      setRoleName("");
      setImageFile(null);
      setBackgroundImage(null);
    } else {
      alert("모든 필드를 입력해주세요.");
    }
  };

  //삭제
  const handleRemoveSlide = (index) => {
    setSlides((prevSlides) => prevSlides.filter((_, i) => i !== index));
  };

  const handlePlusClick = () => {
    fileInputRef.current.click();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // 데이터 전달 및 모달 닫기 함수
  const handleSavedAndClose = () => {
    if (slides.length > 0) {
      const slideData = slides.map((slide) => ({
        actorName: slide.actorName,
        characterName: slide.roleName,
        actorPath: slide.imageFile,
      }));
      onModalData(slideData);
      closeModal();
    } else {
      alert("모든 필드를 입력해주세요.");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="modalActcontainer">
      <div className="slides-container" ref={slideContainerRef}>
        <Slider {...sliderSettings}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <div className="image-container">
                <img src={URL.createObjectURL(slide.imageFile)} alt="Actor" />
                <button type="button" onClick={() => handleRemoveSlide(index)}>
                  x
                </button>
              </div>
              <p>배우명 : {slide.actorName}</p>
              <p>배역명 : {slide.roleName}</p>
            </div>
          ))}
        </Slider>

        {slides.length === 0 && (
          <>
            <h5>※ 3개까지 가능합니다.</h5>
            <h5>※ 특수문자가 포함된 이미지는 불가능합니다.</h5>
          </>
        )}
      </div>
      <form className="inputImg">
        <div className="file-input">
          <input type="file" onChange={handleImageChange} ref={fileInputRef} />
          <label
            className="inputFile"
            onClick={handlePlusClick}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
            }}
          >
            +
          </label>
          <div className="actorInfo">
            <br />
            <label>배우 이름</label>
            <br />
            <input
              type="text"
              placeholder="배우명"
              value={actorName}
              onChange={handleActorNameChange}
              className="actorInfoInput"
            />
            <br />
            <label>배역 이름</label>
            <br />
            <input
              type="text"
              placeholder="배역명"
              value={roleName}
              onChange={handleRoleNameChange}
              className="actorInfoInput"
            />
            <br />
            <button
              type="button"
              onClick={handleAddSlide}
              className="actorSumit"
            >
              추가
            </button>
          </div>
        </div>
      </form>
      <button
        className="ActInfosumit button btn-saved"
        onClick={handleSavedAndClose}
      >
        저장하기
      </button>
    </div>
  );
};
