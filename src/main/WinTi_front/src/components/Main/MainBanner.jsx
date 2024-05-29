import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { mainBanner, searchPerformancesByTitle } from "../../axios/MainAxios";
import { useNavigate } from "react-router-dom";

const MainBanner = () => {
  const [mainSlide, setMainSlide] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const response = await mainBanner();
        setMainSlide(response.data);
      } catch (error) {
        console.error("Error fetching performances:", error);
      }
    };
    fetchPerformances();
  }, []);

  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      const slide = mainSlide[index];
      if (slide) {
        const fullURL = "http://localhost:8080" + slide.bannerPath;
        return `<img class="${className}" src="${fullURL}" alt="pagination-${
          index + 1
        }" />`;
      } else {
        return `<span class="${className}">${index + 1}</span>`;
      }
    },
  };

  const handleBannerClick = async (banner) => {
    try {
      // 배너의 제목을 가져옵니다.
      const bannerTitle = banner.title;
      const bannerUserId = banner.userId;
      const bannderShowId = banner.showId;

      // 제목을 기반으로 공연 정보를 가져옵니다.
      const performanceResponse = await searchPerformancesByTitle(
        bannerUserId,
        bannerTitle,
        bannderShowId
      );
      const performance = performanceResponse.data;

      // 페이지 이동
      navigate(`/performance/${performance[0].showid}`);
    } catch (error) {
      console.error("Error handling banner click:", error);
    }
  };

  return (
    <div className="MainSliedContainer">
      <div className="mainSlideSwiper">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={pagination}
          modules={[Autoplay, Pagination]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="mySwiper"
        >
          {mainSlide.map((slide, index) => (
            <SwiperSlide key={index} className="swiper-slide">
              <SwiperSlide key={index} className="swiper-slide">
                <img
                  src={"http://localhost:8080" + slide.bannerPath}
                  alt={slide.path}
                  onClick={() => handleBannerClick(slide)}
                />
              </SwiperSlide>
            </SwiperSlide>
          ))}

          {/* 자동 재생 관련 요소 */}
          <div className="autoplay-progress" slot="container-end">
            <svg viewBox="0 0 48 48" ref={progressCircle}>
              <circle cx="24" cy="24" r="20"></circle>
            </svg>
            <span ref={progressContent}></span>
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default MainBanner;
