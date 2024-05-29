import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import FindUserRequestDto from '../../axios/member/request/auth/find-user.dto.ts';
import { findUserRequest } from '../../axios/MemberAxios.ts';
import { ResponseBody } from '../../axios/types/index.ts';
import ResponseCode from '../../axios/types/enums/response-code.enum.ts';
import { FindUserResponseDto } from '../../axios/member/response/auth';
import { Link, useNavigate } from 'react-router-dom';

const Seller_Registration = () => {
  const [registrations, setRegistrations] = useState([]);
  const [sortKey, setSortKey] = useState('createDate');
  const [cookies] = useCookies(); // 토큰에서 유저정보 가져오기
  const [userId, setUserId] = useState(''); // 유저 아이디
  const navigate = useNavigate();

  const findUserResponse = (ResponseBody: ResponseBody<FindUserResponseDto>) => {
    if (!ResponseBody) return;
    const { code, id } = ResponseBody;
    if (code === ResponseCode.SIGN_IN_FAIL) alert("등록되지 않은 사용자 입니다.")
    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("로그인이 필요한 서비스 입니다.");
      navigate("/Login")
    }
    if (code === ResponseCode.SUCCESS) {
      if (id !== undefined) {
        setUserId(id);
      }
      console.log(id)
    }
  }

  const findseller_user = () => {
    if (userId) {
      const fetchRegistrations = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/sell/registrations', { params: { userId } });
          setRegistrations(response.data);
        } catch (error) {
          console.error('Error fetching data', error);
        }
      };

      fetchRegistrations();
    }
  }

  useEffect(() => {
    const token = cookies.accessToken;
    const requestBody: FindUserRequestDto = { token };
    findUserRequest(requestBody).then(findUserResponse);
    findseller_user();
    console.log("Seller_Registration 페이지 유저 정보 찾기")
  }, [cookies, userId]);

  const handleSortChange = (e) => {
    setSortKey(e.target.value);
    sortRegistrations(e.target.value);
  };

  const sortRegistrations = (key) => {
    const sorted = [...registrations].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    setRegistrations(sorted);
  };

  return (
    <div className='contWrap'>
      <div className='Seller_Registration'>
        <h1 className="head">등록내역</h1>
        <h4 className="headSide">마이페이지 {'>'} <span>등록내역</span></h4>
        <div className="line" />
        <div style={{ textAlign: 'right', marginBottom: '10px' }} className="selectBox">
          <select onChange={handleSortChange} value={sortKey}>
            <option value="createDate">등록일</option>
            <option value="showId">등록번호</option>
            <option value="title">상품명</option>
            <option value="status">등록상태</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>등록일</th>
              <th>등록번호</th>
              <th>상품명</th>
              <th>등록상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, index) => (
              <tr key={index}>
                <td>{reg.createDate}</td>
                <td>{reg.showId}</td>
                <td>{reg.title}</td>
                <td>{reg.status}</td>
                <td><Link className="moveShow" to={`/performance/modify/${reg.showId}`}><button className='myShowBtn'>수정</button></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default Seller_Registration;