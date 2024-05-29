import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { mainOpen } from "../../axios/MainAxios";
import { Link } from "react-router-dom";

const MainOpen = () => {
  const [mainSlide, setMainSlide] = useState([]);

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const response = await mainOpen();
        setMainSlide(response.data);
      } catch (error) {
        console.error("Error fetching performances:", error);
      }
    };

    fetchPerformances();
  }, []);

  return (
    <div className="MainOpenContainer">
      <div className="ticketBanner">TICKET OPEN</div>
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
        >
          {mainSlide.map((slide, index) => (
            <SwiperSlide key={index}>
              <Link className="moveShow" to={`/performance/${slide.showid}`}>
                <img
                  src={"http://localhost:8080" + slide.posterPath1}
                  alt={slide.posterPath1}
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

export default MainOpen;
