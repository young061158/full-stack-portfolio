import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mainTodayHot } from "../../axios/MainAxios";

const MainTodayHot = () => {
  const [performances, setPerformances] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("연극");
  const navigation = useNavigate();
  // const categories = ["연극", "뮤지컬", "콘서트", "클래식", "아동", "성인"];
  const categories = ["연극", "뮤지컬", "콘서트", "클래식", "아동"];



  useEffect(() => {
    // 백앤드에서 선택한 카테고리에 해당하는 공연 데이터 가져오기
    const fetchPerformances = async () => {
      try {
        const response = await mainTodayHot(selectedCategory); // 선택한 카테고리를 전달하여 공연 데이터 가져오기
        setPerformances(response.data);
      } catch (error) {
        console.error("Error fetching performances:", error);
      }
    };

    fetchPerformances();
  }, [selectedCategory]);

  // 'Book Now' 버튼 클릭 시 해당 공연으로 이동하는 함수
  const handleBookNow = (performanceId) => {
    navigation(`/performance/${performanceId}`);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="MainHotContainer">
      <img
        className="MainHotBackground"
        src={"http://localhost:8080" + performances.posterPath1}
        alt={performances.title}
      />
      <h2>TODAY'S HOT</h2>
      <div>
        {/* 카테고리 선택 버튼 */}
        <div className="mainHotCategory">
          {/* 각 카테고리별로 선택되었을 때 클래스 추가 */}
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "selected" : ""}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 선택한 카테고리에 해당하는 최고 viewCount 공연 표시 */}
        <div className="hotContainer">
          <div>
            {performances && (
              <div key={performances.showid}>
                <img
                  className="mainHotPoster"
                  src={"http://localhost:8080" + performances.posterPath1}
                  alt={performances.title}
                />
                <div>
                  <div className="mainHotContent">
                    <p className="mainHotDes">{performances.subtitle}</p>
                    <p className="mainHotTitle">{performances.title}</p>
                    <p className="mainHotDate">
                      {performances.startDateString}~
                      {performances.endDateString}
                    </p>
                  </div>
                  <button
                    className="bookNow"
                    onClick={() => handleBookNow(performances.showid)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTodayHot;
