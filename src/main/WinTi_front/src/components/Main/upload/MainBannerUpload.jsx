import React, { useState } from "react";
import { mainBannerUpload } from "../../../axios/upload/MainBannerUploadAxios";

const MainBannerUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null); // 추가

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPreviewUrl(URL.createObjectURL(event.target.files[0])); // 추가
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);

    try {
      await mainBannerUpload(formData);
      alert("Successfully uploaded Banner");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload Banner.");
    }
  };

  return (
    <div className="contWrap">
      <div className="container">
        <h1>Banner Upload</h1>
        <form>
          {/* 추가된 이미지 미리보기 */}
          <label htmlFor="bannerImg">배너 사진 </label>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
          <br />
          <label htmlFor="inputTitle">공연 이름 : </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
          <br />
          <label htmlFor="inputFile">Banner Image : </label>
          <input type="file" id="file" onChange={handleFileChange} />
          <button type="button" onClick={handleUpload}>
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainBannerUpload;
