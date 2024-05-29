import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CategoryBest from "./CategoryBest";
import { getPerformancesByCategory } from "../../axios/MainAxios";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [performances, setPerformances] = useState([]);
  const [sortBy, setSortBy] = useState("alphabetical"); // 기본 정렬 기준은 글자순

  useEffect(() => {
    const fetchCategoryPerformances = async () => {
      try {
        const response = await getPerformancesByCategory(categoryName);
        setPerformances(response.data);
      } catch (error) {
        console.error("Error fetching performances:", error);
      }
    };

    fetchCategoryPerformances();
  }, [categoryName]);

  // performances 배열이 유효한지 확인합니다.
  if (!performances || performances.length === 0) {
    return <div>공연이 없습니다.</div>;
  }

  // 정렬 기준에 따라 공연 데이터를 재정렬하는 함수
  const sortPerformances = (performances, sortBy) => {
    if (sortBy === "alphabetical") {
      return performances
        .slice()
        .sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "recent") {
      return performances
        .slice()
        .sort(
          (a, b) => new Date(b.createDateString) - new Date(a.createDateString)
        );
    }

    return performances;
  };

  // 셀렉트박스에서 사용자의 선택을 감지하여 정렬 기준을 변경하는 함수
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // 공연을 테이블 형식으로 렌더링하는 함수
  const renderCategoryPerformances = () => {
    const sortedPerformances = sortPerformances(performances, sortBy);
    const grid = [];
    for (let i = 0; i < sortedPerformances.length; i += 5) {
      const row = [];
      for (let j = i; j < i + 5 && j < sortedPerformances.length; j++) {
        const performance = sortedPerformances[j];
        row.push(
          <td key={performance.showid}>
            {/* Link 컴포넌트를 사용하여 클릭 시 해당 공연의 상세 페이지로 이동 */}
            <Link to={`/performance/${performance.showid}`}>
              <img
                src={"http://localhost:8080" + performance.posterPath1}
                alt={performance.title}
              />
            </Link>
            <h3 className="category-title">{performance.title}</h3>
            <label className="time">
              {performance.startDateString} ~ {performance.endDateString}
            </label>
          </td>
        );
      }
      grid.push(<tr key={i}>{row}</tr>);
    }
    return grid;
  };

  return (
    <div className="category-container">
      <CategoryBest />
      <div className="category-content">
        <div className="sort-container">
          <label htmlFor="sort">정렬 기준: </label>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="alphabetical">글자순</option>
            <option value="recent">최근등록순</option>
          </select>
        </div>
        <table className="category-table">
          <tbody>{renderCategoryPerformances()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryPage;
