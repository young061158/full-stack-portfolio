import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mainBannerUpload } from "../../../axios/upload/MainBannerUploadAxios";

const MainBannerUploadStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const uploadData = async () => {
      try {
        const formData = new FormData();
        formData.append("userId", location.state.userId);
        formData.append("title", location.state.title);
        formData.append("file", location.state.selectedFile);
        formData.append("showInfo", location.state.selectedShow.showid);

        await mainBannerUpload(formData);
        alert("Successfully uploaded Banner");
        // 업로드가 완료되면 홈 화면으로 이동합니다.
        navigate("/");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload Banner.");
      }
    };

    uploadData();
  }, [
    navigate,
    location.state.userId,
    location.state.title,
    location.state.selectedFile,
    location.state.selectedShow,
  ]);

  return (
    <div className="contWrap">
      <div className="container">
        <h1>Banner Upload - Step 3</h1>
        <p>Uploading...</p>
      </div>
    </div>
  );
};

export default MainBannerUploadStep3;
