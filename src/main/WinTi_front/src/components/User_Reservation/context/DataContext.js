import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Context 생성
const ShowDetailsContext = createContext();

// Context Provider 컴포넌트
export const ShowDetailsProvider = ({ children }) => {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/api/performances/${id}`)
        .then((response) => setShowDetails(response.data));
      console.log(showDetails).catch((error) => {
        console.error("Error fetching show details:", error);
      });
    }
  }, [id]);

  const value = {
    showDetails,
    isModalOpen,
    setModalOpen,
  };

  return (
    <ShowDetailsContext.Provider value={value}>
      {children}
    </ShowDetailsContext.Provider>
  );
};

// Context 사용을 위한 custom hook
export const useShowDetails = () => useContext(ShowDetailsContext);
