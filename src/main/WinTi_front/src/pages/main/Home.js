import React from "react";
import MainBanner from "../../components/Main/MainBanner";
import MainOpen from "../../components/Main/MainOpen";
import MainTodayHot from "../../components/Main/MainTodayHot";
import MainWeekHot from "../../components/Main/MainWeekHot";

const Home = () => {
  return (
    <div className="contWrap">
      <div className="swiper-container">
        <MainBanner />
        <MainOpen />
        <MainTodayHot />
        <MainWeekHot />
      </div>
    </div>
  );
};

export default Home;
