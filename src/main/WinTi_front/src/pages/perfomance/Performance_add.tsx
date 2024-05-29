import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Poster from "../../components/Performance_Add/Session/Poster.jsx";
import Preview from "../../components/Performance_Add/Session/Preview.tsx";
import Caveats from "../../components/Performance_Add/Session/Caveats.jsx";
import PrevImage from "../../components/Performance_Add/Session/PrevImage.jsx";
import PerformanceForm from "../../components/Performance_Add/Session/PerformanceForm.jsx";
import FindUserResponseDto from "../../axios/member/response/auth/find-user.response.dto.ts";
import { ResponseBody } from "../../axios/types/index.ts";
import ResponseCode from "../../axios/types/enums/response-code.enum.ts";
import FindUserRequestDto from "../../axios/member/request/auth/find-user.dto.ts";
import { findUserRequest } from "../../axios/MemberAxios.ts";
import { useCookies } from "react-cookie";
import { ShowInfo, Discription, Round, Actor, Seat, Coupon } from "../../interface/performance.ts";
import { createShow, getShow, modifyShow } from "../../axios/performance_add/show.js";
import { createActor, getActorList } from "../../axios/performance_add/actor.js";
import { createRound, getRoundList } from "../../axios/performance_add/round.js";
import { createStage, getSampleStage } from "../../axios/performance_add/stage.js";
import { createCoupon, getCouponList } from "../../axios/performance_add/coupon.js";

const Performance_add = () => {
  const navigate = useNavigate();

  const { modifyShowId } = useParams();

  const [showInfo, setShowInfo] = useState<ShowInfo>({
    title: "",
    subTitle: "",
    startDate: "",
    endDate: "",
    category: "",
    showAddress: "",
    showSubAddress: "",
    showAge: "",
    bank: "",
    accountNumber: "",
    runtime: "",
    uploaderId: ""
  });

  const [discription, setDiscription] = useState<Discription>({
    discriptionText: "",
    discriptionImg: "",
  }); //공연 소개글

  const [caveats, setCaveats] = useState(""); //공연 주의사항
  const [posterPath, setPosterPath] = useState<any[]>([]); // 포스터 이미지 경로
  const [actorInfo, setActorInfo] = useState<Actor[]>([]); // 출연진 정보

  const [roundList, setRoundList] = useState<Round[]>([]); //회차 정보
  const [stage, setStage] = useState<Seat[]>([]); //좌석 정보
  const [couponList, setCouponList] = useState<Coupon[]>([]);

  const [cookies, setCookie, removeCookie] = useCookies(); // 토큰에서 유저정보가져오기
  const [userId, setUserId] = useState<string>(''); // 유저 아이디

  // performanceData에 데이터 저장
  const [performanceData, setPerformanceData] = useState<any>({
    userId: "",
    title: "",
    subTitle: "",
    startDate: "",
    endDate: "",
    category: "",
    runTime: "",
    showAddress: "",
    showSubAddress: "",
    showAge: "",
    bank: "",
    account: "",
    discriptionText: "",
    discriptionImg: "",
    caveats: "",
    posterPaths: [],
    ticketLimit: "",
  });


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
      if (modifyShowId) {
        fetchShow(id);
      }
    }
  }

  useEffect(() => {
    const token = cookies.accessToken;
    const requestBody: FindUserRequestDto = { token };
    findUserRequest(requestBody).then(findUserResponse);
    console.log("Performance_add 페이지 사용자 정보 불러오기")
  }, [cookies]);

  const roundSetting = {
    start_date: performanceData.startDate,
    end_date: performanceData.endDate,
    run_time: performanceData.runTime
  };


  /** 등록 */
  const handleAxiosPost = async () => {
    try {
      const showData = new FormData(); // FormData 객체 생성

      // 공연 정보를 FormData에 추가
      showData.append("userId", performanceData.userId);
      showData.append("title", performanceData.title);
      showData.append("subTitle", performanceData.subTitle);
      showData.append("startDate", performanceData.startDate);
      showData.append("endDate", performanceData.endDate);
      showData.append("category", performanceData.category);
      showData.append("runTime", performanceData.runTime);
      showData.append("showAddress", performanceData.showAddress);
      showData.append("showSubAddress", performanceData.showSubAddress);
      showData.append("bank", performanceData.bank);
      showData.append("account", performanceData.account);
      showData.append("discriptionText", performanceData.discriptionText);
      showData.append("discriptionImg", performanceData.discriptionImg);
      showData.append("caveats", performanceData.caveats);
      showData.append("ticketLimit", performanceData.ticketLimit);
      posterPath.forEach((posterPath) => {
        showData.append("posterPath", posterPath.poster);
      });
      showData.append("showAge", performanceData.showAge);
      const showInfoResponse = await createShow(showData);
      console.log("Show uploaded:", showInfoResponse.data);


      for (const actor of actorInfo) {
        const actorData = new FormData();
        actorData.append(`actorName`, actor.actorName);
        actorData.append(`characterName`, actor.characterName);
        actorData.append(`actorPath`, actor.actorPath);
        actorData.append('showId', showInfoResponse.data.showId); // 공연의 ID를 FormData에 추가합니다.
        const actorResponse = await createActor(actorData)
        console.log("actor uploaded:", actorResponse.data);
      }

      // 회차 , 좌석 등록
      for (const round of roundList) {
        const roundResponse = await createRound(showInfoResponse.data.showId, round);
        console.log("Round uploaded:", roundResponse.data);
        // 좌석 등록
        const stageResponse = await createStage(roundResponse.data.roundId, stage);
        console.log("Seat uploaded:", stageResponse.data);
      }
      // 쿠폰 등록
      for (const coupon of couponList) {
        const couponResponse = await createCoupon(showInfoResponse.data.showId, coupon);
        console.log("coupon uploaded:", couponResponse.data);
      }
      navigate(`/performance/${showInfoResponse.data.showId}`)
    } catch (error) {
      if (error.response) {
        console.error("서버가 응답한 상태 코드:", error.response.status);
        console.error("오류 데이터:", error.response.data);
      } else if (error.request) {
        console.error("응답을 받지 못함:", error.request);
      } else {
        console.error("요청 설정 오류:", error.message);
      }
      console.error("오류 설정:", error.config);
    }
  }

  /** 수정 */
  const handleAxiosPatch = async () => {

    // const removeCommonElements = (old_list, new_list) =>{
    //   const commonElements = old_list.filter(element => new_list.includes(element));
    //   return old_list.filter(elemet=> !commonElements.includes(elemet));
    // }

    try {
      const showData = new FormData(); // FormData 객체 생성

      // 공연 정보를 FormData에 추가
      showData.append("userId", performanceData.userId);
      showData.append("title", performanceData.title);
      showData.append("subTitle", performanceData.subTitle);
      showData.append("startDate", performanceData.startDate);
      showData.append("endDate", performanceData.endDate);
      showData.append("category", performanceData.category);
      showData.append("discriptionText", performanceData.discriptionText);
      showData.append("discriptionImg", performanceData.discriptionImg);
      showData.append("caveats", performanceData.caveats);
      showData.append("showAge", performanceData.showAge);


      const showInfoUpdateResponse = await modifyShow(modifyShowId, showData);
      console.log("Show uploaded:", showInfoUpdateResponse.data);


      // // 적용할지말지 구상중
      // for (const actor of actorInfo){
      //   const actorData = new FormData();
      //   actorData.append(`actorName`, actor.actorName);
      //   actorData.append(`characterName`, actor.characterName);
      //   actorData.append(`actorPath`, actor.actorPath);
      //   actorData.append('showId', showInfoUpdateResponse.data.showId); // 공연의 ID를 FormData에 추가합니다.
      //   const actorResponse = await createActor(actorData)
      //   console.log("actor uploaded:", actorResponse.data);
      // }

      // // 회차 추가 등록
      // const roundResponse = await getRoundList();
      // const updateRoundList = removeCommonElements(roundList, roundResponse.data);
      // for (const round of updateRoundList) {
      //   const roundUpdateResponse = await createRound(showInfoUpdateResponse.data.showId, round);
      //   console.log("Round uploaded:", roundUpdateResponse.data);
      //   // 회차 추가 좌석 등록
      //   for (const seat of stage) {
      //     const stageUpdateResponse = await createStage(roundUpdateResponse.data.roundId, seat);
      //     console.log("Seat uploaded:", stageUpdateResponse.data);
      //   }
      // }
      // // 쿠폰 추가 등록
      // const couponResponse = await getCouponList();
      // const updateCouponList = removeCommonElements(couponList , couponResponse.data);
      // for (const coupon of updateCouponList) {
      //   const couponUpdateResponse = await createCoupon(showInfoUpdateResponse.data.showId, coupon);
      //   console.log("coupon uploaded:", couponUpdateResponse.data);
      // }
      navigate(`/performance/${showInfoUpdateResponse.data.showId}`)

    } catch (error) {
      console.error("Error:", error);
    }
  }

  //핸들러들
  const handleSubmitShow = (data) => {
    setShowInfo(data);
  };

  const handleSubmitDis = (data) => {
    setDiscription(data);
  };

  const handleModalRound = (data) => {
    setRoundList(data);
  }
  const handleModalSeat = (data) => {
    setStage(data);
  }
  const handleModalCoupon = (data) => {
    setCouponList(data);
  }

  const handleLimit = (data) => {
    setPerformanceData(prevState => ({
      ...prevState,
      ticketLimit: data
    }))
  }

  useEffect(() => {
    setPerformanceData(prevState => ({
      ...prevState,
      userId: userId,
      title: showInfo.title,
      subTitle: showInfo.subTitle,
      startDate: showInfo.startDate,
      endDate: showInfo.endDate,
      category: showInfo.category,
      runTime: showInfo.runtime,
      showAddress: showInfo.showAddress,
      showSubAddress: showInfo.showSubAddress,
      bank: showInfo.bank,
      account: showInfo.accountNumber,
      discriptionText: discription.discriptionText,
      discriptionImg: discription.discriptionImg,
      caveats: caveats,
      posterPaths: posterPath,
      showAge: showInfo.showAge,

    }));
  }, [userId, showInfo, discription, caveats, posterPath]);



  const fetchShow = async (id) => {
    try {
      const showResponse = await getShow(modifyShowId);

      console.log('Fetched uploaderId:', showResponse.data.uploaderId);
      console.log('Current userId:', id);
      if (showResponse.data.uploaderId !== id) {
        alert("#### 다른사람의 공연은 수정 X ####")
        navigate("/")
        return;

      }
      setShowInfo({
        title: showResponse.data.title,
        subTitle: showResponse.data.subTitle,
        startDate: showResponse.data.startDate,
        endDate: showResponse.data.endDate,
        category: showResponse.data.category,
        showAddress: showResponse.data.showAddress,
        showSubAddress: showResponse.data.showSubAddress,
        showAge: showResponse.data.showAge,
        bank: showResponse.data.bank,
        accountNumber: showResponse.data.account,
        runtime: showResponse.data.runTime,
        uploaderId: showResponse.data.uploaderId
      })

      setPosterPath([
        showResponse.data.posterPath1,
        showResponse.data.posterPath2,
        showResponse.data.posterPath3
      ])

      setDiscription({
        discriptionText: showResponse.data.discriptionText,
        discriptionImg: showResponse.data.discriptionImg,
      })

      setCaveats(showResponse.data.caveats)

      fetchActorList();
      fetchRoundList();
      fetchStage();
      fetchCouponList();

    } catch (error) {
      console.error(error)
      navigate("/error")
    }

  };

  const fetchActorList = async () => {
    const actorResponse = await getActorList(modifyShowId);
    setActorInfo(actorResponse.data);
  };

  const fetchRoundList = async () => {
    const roundResponse = await getRoundList(modifyShowId);
    setRoundList(roundResponse.data);
  };

  const fetchStage = async () => {
    const stageResponse = await getSampleStage(modifyShowId)
    setStage(stageResponse.data);
  };

  const fetchCouponList = async () => {
    const couponResponse = await getCouponList(modifyShowId)
    setCouponList(couponResponse.data);
  };



  return (
    <div className="contWrap">
      <div className="add-container">
        <h2 className="addTitle" style={{ textAlign: "center", fontWeight: 'bold' }}>공연 {modifyShowId == null ? "등록" : "수정"}</h2>
        <div style={{ borderBottom: '1px solid', margin: "50px" }}></div>
        <div className="addTop">
          <Poster setPosterPath={setPosterPath} setActorInfo={setActorInfo} posterPath={posterPath} actorInfo={actorInfo} />
          <PerformanceForm
            showInfo={showInfo}
            onSubmitShow={handleSubmitShow}
          />
        </div>
        <PrevImage
          discription={discription}
          onSubmitDescriptions={handleSubmitDis}
        />
        <Caveats
          caveats={caveats}
          setCaveats={setCaveats} />
        <Preview
          handleModalRound={handleModalRound}
          handleModalSeat={handleModalSeat}
          handleModalCoupon={handleModalCoupon}
          roundSetting={roundSetting}
          handleLimit={handleLimit}
          roundList={roundList}
          stage={stage}
          couponList={couponList}
        />

        {modifyShowId ?
          <button className='showInfoUpload' onClick={handleAxiosPatch}>수정하기</button>
          :
          <button className='showInfoUpload' onClick={handleAxiosPost}>등록하기</button>
        }
      </div>
    </div>
  );
};

export default Performance_add;