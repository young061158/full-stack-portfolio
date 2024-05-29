import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mainWeekHot } from "../../axios/MainAxios";

const MainWeekHot = () => {
  const [performances, setPerformances] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("연극");

  useEffect(() => {
    // 백앤드에서 선택한 카테고리에 해당하는 공연 데이터 가져오기
    const fetchWeeklyHotPerformances = async () => {
      try {
        const response = await mainWeekHot(selectedCategory);
        setPerformances(response.data);
      } catch (error) {
        console.error("Error fetching weekly hot performances:", error);
      }
    };

    fetchWeeklyHotPerformances();
  }, [selectedCategory]);

  // 카테고리 선택 시 호출되는 함수
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="MainWeekHotContainer">
      <h2>WEEKLY HOT</h2>
      <div className="mainHotCategory">
        {/* 카테고리 선택 버튼 */}
        {["연극", "뮤지컬", "콘서트", "클래식", "아동"].map(
          (category) => (
            <button
              key={category}
              className={selectedCategory === category ? "selected" : ""}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          )
        )}
      </div>
      <div className="weeklyHotList">
        <table className="weeklyHotTable">
          <tbody>
            {[...Array(2)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {performances
                  .slice(rowIndex * 5, rowIndex * 5 + 5)
                  .map((performance, colIndex) => (
                    <td key={colIndex}>
                      <div className="weeklyHotItem">
                        {/* Link 컴포넌트를 사용하여 클릭 시 해당 공연의 상세 페이지로 이동 */}
                        <Link to={`/performance/${performance.showid}`}>
                          <img
                            className="weeklyHotPoster"
                            src={
                              "http://localhost:8080" + performance.posterPath1
                            }
                            alt={performance.title}
                          />
                        </Link>
                        <div className="weeklyHotContent">
                          <p className="weeklyHotTitle">{performance.title}</p>
                          <p className="mainHotDate">
                            {performance.startDateString}~
                            {performance.endDateString}
                          </p>
                        </div>
                      </div>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* "VIEW MORE" 버튼 */}
      <div className="viewMoreButton">
        <h2>
          <Link to={`/category/${selectedCategory}`}>VIEW MORE</Link>
        </h2>
      </div>
    </div>
  );
};

export default MainWeekHot;
