import React, { useEffect, useState } from "react";

const Caveats = ({caveats, setCaveats }) => {
  const [caveatDto, setCaveatDto] = useState("");

  const handleChange = (e) => {
    setCaveatDto(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaveats(caveatDto);
    alert("주의사항이 등록되었습니다.");
  };

  useEffect(()=>{
    setCaveatDto(caveats)
  },[caveats])
  return (
    <div className="cavats">
      <div
        style={{
          borderBottom: "1px solid",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      ></div>
      <p
        className="caveatsTitle"
        style={{ fontSize: "1.3em", fontWeight: "bold" }}
      >
        공연 주의사항
      </p>
      <button
        className="caveatsUpload"
        type="button"
        style={{ marginLeft: "900px" }}
        onClick={handleSubmit}
      >
        등록
      </button>
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="공연 주의사항 및 알림"
          style={{ height: "300px" }}
          id="floatingTextarea"
          value={caveatDto}
          onChange={handleChange}
          required
        ></textarea>
      </div>
    </div>
  );
};
export default Caveats;
