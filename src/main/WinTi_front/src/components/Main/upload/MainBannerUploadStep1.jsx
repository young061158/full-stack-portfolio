import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPerformancesByCategory } from "../../../axios/MainAxios";

const MainBannerUploadStep1 = () => {
  const navigate = useNavigate();
  const [performances, setPerformances] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPerformances, setSelectedPerformances] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가

  const categories = [
    "All",
    "연극",
    "뮤지컬",
    "콘서트",
    "클래식",
    "아동",
  ];
  // const categories = [
  //   "All",
  //   "연극",
  //   "뮤지컬",
  //   "콘서트",
  //   "클래식",
  //   "아동",
  //   "성인",
  // ];


  useEffect(() => {
    const fetchPerformancesByCategory = async () => {
      try {
        const response = await getPerformancesByCategory(selectedCategory);
        setPerformances(response.data);
      } catch (error) {
        console.error("Error fetching performances by category:", error);
      }
    };

    fetchPerformancesByCategory();
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handlePerformanceSelect = (performanceId) => {
    // 선택된 공연 정보를 상태에 추가
    const selectedPerformance = performances.find(
      (performance) => performance.showid === performanceId
    );
    setSelectedPerformances([...selectedPerformances, selectedPerformance]);
  };

  const handleNext = () => {
    if (!selectedCategory || selectedPerformances.length === 0) {
      alert("Please select a category and at least one performance.");
      return;
    }
    navigate("/banner/upload/step2", {
      state: {
        selectedCategory,
        selectedPerformances,
      },
    });
  };

  return (
    <div className="contWrap">
      <div className="MainBannerContainer">
        <div className="mainBannerCategory">
          {/* 카테고리 선택 버튼 */}
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "selected" : ""}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>USER_ID</th>
              <th>Date</th>
              <th>CreateDate</th>
              <th>Ref</th>
              <th>Checkbox</th>
            </tr>
          </thead>
          <tbody className="performanceItem">
            {performances
              .filter((performance) =>
                performance.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((performance) => (
                <tr key={performance.showid}>
                  <td>
                    <img
                      src={"http://localhost:8080" + performance.posterPath1}
                      alt={performance.title}
                    />
                  </td>
                  <td>{performance.title}</td>
                  <td>{performance.userId}</td>
                  <td>
                    {performance.startDateString} ~ {performance.endDateString}
                  </td>
                  <td>{performance.createDateString}</td>
                  <td>{performance.banner ? "참조됨" : "참조되지 않음"}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handlePerformanceSelect(performance.showid)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <button type="button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MainBannerUploadStep1;
