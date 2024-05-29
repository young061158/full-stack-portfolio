import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getBannerById } from "../../../axios/upload/MainBannerUploadAxios";
import {
  mainBannerDelete,
  mainBannerUpdate,
} from "../../../axios/upload/MainBannerUploadAxios";

const MainBannerUploadStep2 = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [mainBanner, setMainBanner] = useState([]);
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  // 이전 페이지에서 전달된 정보 받기
  const { selectedPerformances } = useLocation().state;

  useEffect(() => {
    const fetchBannerImageUrl = async () => {
      if (
        selectedPerformances.length === 0 ||
        !selectedPerformances[0].banner
      ) {
        // 선택된 공연이 없거나 참조되지 않는 공연이라면 작업을 중단합니다.
        return;
      }
      try {
        const bannerUserId = selectedPerformances[0].userId;
        const bannerTitle = selectedPerformances[0].title;
        const response = await getBannerById(bannerUserId, bannerTitle);
        setMainBanner(response.data);
      } catch (error) {
        console.error("Error fetching banner image URL:", error);
      }
    };

    if (selectedPerformances && selectedPerformances.length > 0) {
      setTitle(selectedPerformances[0].title || ""); // 공연의 제목
      setUserId(selectedPerformances[0].userId || ""); // 사용자 ID
    }

    fetchBannerImageUrl();

    // 버튼 표시 설정
    setShowSaveButton(
      !selectedPerformances.some((performance) => performance.banner)
    ); // 참조되지 않음이면 저장 버튼 표시
    setShowEditButton(
      selectedPerformances.some((performance) => performance.banner)
    ); // 참조됨이면 수정 버튼 표시
    setShowDeleteButton(
      selectedPerformances.some((performance) => performance.banner)
    ); // 참조됨이면 삭제 버튼 표시
  }, [selectedPerformances]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPreviewUrl(URL.createObjectURL(event.target.files[0]));
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handleSave = () => {
    if (!selectedFile || !title) {
      alert("Please select a file and enter a title.");
      return;
    }

    // 저장 동작

    // 저장 버튼이 눌렸으므로 ref의 결과를 true로 변경
    setShowSaveButton(false);
    setShowEditButton(true);
    setShowDeleteButton(true);

    // 다음 단계로 이동
    navigate("/banner/upload/step3", {
      state: {
        userId,
        selectedFile,
        title,
        selectedShow: selectedPerformances[0],
      },
    });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", selectedPerformances[0].userId);
      formData.append("title", selectedPerformances[0].title);
      formData.append("file", selectedFile);
      // 삭제 API 호출
      await mainBannerUpdate(formData);
      alert("Successfully deleted the banner.");
      navigate("/");
    } catch (error) {
      console.error("Error deleting the banner:", error);
      alert("An error occurred while deleting the banner.");
    }
  };

  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", selectedPerformances[0].userId);
      formData.append("title", selectedPerformances[0].title);
      formData.append("showInfo", selectedPerformances[0].showid);
      // 삭제 API 호출
      await mainBannerDelete(formData);
      alert("Successfully deleted the banner.");
      navigate("/");
    } catch (error) {
      console.error("Error deleting the banner:", error);
      alert("An error occurred while deleting the banner.");
    }
  };

  return (
    <div className="contWrap">
      <div className="MainBannerContainer">
        {/* 이전 페이지에서 가져온 정보 테이블로 보여주기 */}
        <table>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>User ID</th>
              <th>Date</th>
              <th>Ref</th>
              <th>Banner_Img</th>
            </tr>
          </thead>
          <tbody className="performanceItem">
            {selectedPerformances.map((performance) => (
              <tr key={performance.showid}>
                <td>
                  <img
                    src={"http://localhost:8080" + performance.posterPath1}
                    alt={performance.title}
                  />
                </td>
                <td>{performance.title}</td>
                <td>{performance.userId}</td>
                <td>{`${performance.startDateString} ~ ${performance.endDateString}`}</td>
                <td>{performance.banner ? "참조됨" : "참조되지 않음"}</td>
                {performance.banner &&
                  mainBanner.length > 0 && ( // Ref가 참조됨인 경우에만 이미지를 표시하고 mainBanner가 존재하는 경우에만 렌더링
                    <td>
                      <img
                        src={"http://localhost:8080" + mainBanner[0].bannerPath}
                        alt={performance.title + " Banner"}
                      />
                    </td>
                  )}
              </tr>
            ))}
          </tbody>
        </table>

        <form>
          <label htmlFor="inputTitle">공연 이름 : </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            required
          />{" "}
          <label htmlFor="inputTitle">User Id : </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={userId}
            onChange={handleUserIdChange}
            required
          />{" "}
          <label htmlFor="inputFile">Banner File : </label>
          <input type="file" id="file" onChange={handleFileChange} />
          <br />
          <label htmlFor="performanceItem">Banner 사진 </label>
          {previewUrl && (
            <img
              className="performanceItem"
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
          <br />
          {/* 버튼 표시 여부에 따라 버튼을 동적으로 표시 */}
          {showSaveButton && (
            <button
              className="mainBannerCategory"
              type="button"
              onClick={handleSave}
            >
              저장
            </button>
          )}
          {showEditButton && (
            <button
              className="mainBannerCategory"
              type="button"
              onClick={handleUpdate}
            >
              수정
            </button>
          )}
          {showDeleteButton && (
            <button
              className="mainBannerCategory"
              type="button"
              onClick={handleDelete}
            >
              삭제
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MainBannerUploadStep2;
