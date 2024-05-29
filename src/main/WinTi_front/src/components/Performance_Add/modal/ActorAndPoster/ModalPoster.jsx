import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";

export const ModalPoster = ({ page, setPage, onModalData }) => {
  const [imageFile, setImageFile] = useState(null); // 선택된 포스터 이미지
  const fileInputRef = useRef(null); // 파일 입력 참조
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [slides, setSlides] = useState([]);
  const slideContainerRef = useRef(null);

  // 슬라이드 추가 핸들러
  const handleAddSlide = () => {
    if (slides.length < 3) {
      if (imageFile) {
        const newSlide = { imageFile: imageFile };
        setSlides((prevSlides) => [...prevSlides, newSlide]);
        setImageFile(null);
        setBackgroundImage(null);
      } else {
        alert("포스터를 첨부해주세요.");
      }
    } else {
      alert("파일을 3개까지만 추가할 수 있습니다.");
    }
  };

  // 파일 삭제 핸들러
  const handleRemoveSlide = (index) => {
    setSlides((prevSlides) => prevSlides.filter((_, i) => i !== index));
  };

  // 파일 선택 시 호출되는 함수
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

  // 파일 선택 창 열기
  const handlePlusClick = () => {
    fileInputRef.current.click();
  };

  // 모달 데이터 전달 함수
  const handleNextClick = () => {
    if (slides.length > 0) {
      const slidePoster = slides.map((slide) => ({ poster: slide.imageFile }));
      onModalData(slidePoster);
      setPage(page + 1);
    } else {
      alert("포스터를 등록해주세요.");
    }
  };

  return (
    <div className="modalPosterContainer">
      {slides.length > 0 ? (
        <div className="slides-container" ref={slideContainerRef}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <div className="image-container">
                <img src={URL.createObjectURL(slide.imageFile)} alt="Poster" />
                <button type="button" onClick={() => handleRemoveSlide(index)}>
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h5>※ 3개까지 가능합니다.</h5>
          <h5>※ 특수문자가 포함된 이미지는 불가능합니다.</h5>
        </>
      )}
      <form className="inputImg">
        <div className="file-input">
          <label
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
            }}
            onClick={handlePlusClick}
          >
            +
          </label>
          <button type="button" onClick={handleAddSlide}>
            포스터 등록
          </button>
          <input type="file" onChange={handleImageChange} ref={fileInputRef} />
        </div>
      </form>
      <div className="btn-container">
        <button
          className="button btn-next"
          onClick={handleNextClick}
          style={{ display: page >= 1 ? "none" : "block" }}
        >
          다음
        </button>
      </div>
    </div>
  );
};
