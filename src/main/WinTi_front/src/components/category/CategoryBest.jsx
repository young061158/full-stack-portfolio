import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { mainWeekHot } from "../../axios/MainAxios";
import { Link, useParams } from "react-router-dom";

const CategoryBest = () => {
  const [mainBanner, setMainBanner] = useState([]);
  const { categoryName } = useParams();

  useEffect(() => {
    // 백앤드에서 선택한 카테고리에 해당하는 공연 데이터 가져오기
    const fetchWeeklyHotPerformances = async () => {
      try {
        const response = await mainWeekHot(categoryName);
        setMainBanner(response.data);
      } catch (error) {
        console.error("Error fetching weekly hot performances:", error);
      }
    };

    fetchWeeklyHotPerformances();
  }, [categoryName]);

  return (
    <div key={categoryName} className="MainOpenContainer">
      <div className="ticketBanner"> {categoryName} BEST</div>
      <div className="openMain">
        <Swiper
          slidesPerView={5}
          spaceBetween={-80}
          loop={false}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
          key={categoryName}
        >
          {mainBanner.map((slide, index) => (
            <SwiperSlide key={index}>
              <Link className="moveShow" to={`/performance/${slide.showid}`}>
                <img
                  src={"http://localhost:8080" + slide.posterPath1}
                  alt={slide.posterPath}
                />
                <br />
                <div className="mainlabel">
                  <label className="title">{slide.title}</label>
                  <label className="time">
                    {slide.startDateString}~{slide.endDateString}
                  </label>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryBest;
