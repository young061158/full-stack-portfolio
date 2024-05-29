import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PrevImage = ({ discription, onSubmitDescriptions }) => {
  const { modifyShowId } = useParams();
  const [modifyCount, setModifyCount] = useState(false);

  const [discriptionDto, setDiscriptionDto] = useState({
    discriptionText: "",
    discriptionImg: null,
  });

  const [backgroundImage, setBackgroundImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setDiscriptionDto((prevState) => ({
      ...prevState,
      discriptionImg: file,
    }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result);
      };
      reader.readAsDataURL(file);
      setModifyCount(true);
    } else {
      setBackgroundImage(null);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setDiscriptionDto((prevState) => ({
      ...prevState,
      discriptionText: value,
    }));
  };

  const handleUpload = () => {
    onSubmitDescriptions(discriptionDto);
    setModifyCount(true);
    alert("정상적으로 등록되었습니다");
  };

  useEffect(() => {
    setDiscriptionDto(discription);
    setBackgroundImage(discription.discriptionImg);
    if (discription.discriptionImg) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result);
      };
      if (modifyShowId == null || modifyCount === true) {
        reader.readAsDataURL(discription.discriptionImg); // 문제
      }
    } else {
      setBackgroundImage(null);
    }
  }, [discription]);

  return (
    <div className="prev_image">
      <div
        style={{
          borderBottom: "1px solid",
          marginBottom: "20px",
          marginTop: "80px",
        }}
      ></div>
      <p
        className="prevTitle"
        style={{ fontSize: "1.3em", fontWeight: "bold" }}
      >
        상세 포스터 등록
      </p>
      <button
        className="prevImgUpload"
        style={{ marginLeft: "900px" }}
        onClick={handleUpload}
      >
        업로드
      </button>
      <input className="prevImgFile" type="file" onChange={handleImageChange} />
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="공연 안내"
          id="floatingTextarea"
          value={discriptionDto.discriptionText}
          onChange={handleChange}
          required
        ></textarea>

        {backgroundImage && (
          <div className="card">
            {modifyShowId != null && modifyCount === false ? (
              <img
                src={"http://localhost:8080" + backgroundImage}
                className="card-img-top"
                alt={backgroundImage}
              />
            ) : (
              <img
                src={backgroundImage}
                className="card-img-top"
                alt={backgroundImage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrevImage;
