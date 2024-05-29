import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { search } from "../../axios/MainAxios";

const SearchPage = () => {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState("alphabetical"); // 기본 정렬 기준은 글자순

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await search(query);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
    setSortBy("alphabetical");
  }, [query]);

  // 정렬 기준에 따라 검색 결과를 재정렬하는 함수
  const sortSearchResults = (results, sortBy) => {
    if (sortBy === "alphabetical") {
      return results.slice().sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "recent") {
      return results
        .slice()
        .sort(
          (a, b) => new Date(b.createDateString) - new Date(a.createDateString)
        );
    }
    return results;
  };

  // 셀렉트박스에서 사용자의 선택을 감지하여 정렬 기준을 변경하는 함수
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <tr>
          <td colSpan="5">검색 결과가 없습니다.</td>
        </tr>
      );
    }

    const sortedResults = sortSearchResults(searchResults, sortBy);
    const grid = [];
    const numCols = 5; // 5열로 구성

    for (let i = 0; i < sortedResults.length; i += numCols) {
      const row = [];
      for (let j = i; j < i + numCols && j < sortedResults.length; j++) {
        const performance = sortedResults[j];
        row.push(
          <td key={performance.id}>
            <Link to={`/performance/${performance.showid}`}>
              <img
                src={"http://localhost:8080" + performance.posterPath1}
                alt={performance.title}
              />
            </Link>
            <h3 className="performance-title">{performance.title}</h3>
            <p className="performance-date">
              {performance.startDateString}~{performance.endDateString}
            </p>
          </td>
        );
      }
      grid.push(<tr key={i / numCols}>{row}</tr>);
    }
    return grid;
  };

  return (
    <div className="contWrap">
      <div className="search-page-container">
        {searchResults.length > 0 && (
          <p className="search-info">
            총 {searchResults.length}건의 검색 결과가 있습니다.
          </p>
        )}
        <div className="sort-container">
          <label htmlFor="sort">정렬 기준: </label>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="alphabetical">글자순</option>
            <option value="recent">최근등록순</option>
          </select>
        </div>
        <table className="search-table">
          <tbody>{renderSearchResults()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchPage;
