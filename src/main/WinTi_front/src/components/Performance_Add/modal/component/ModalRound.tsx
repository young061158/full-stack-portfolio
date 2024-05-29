import React, { useEffect, useState } from 'react';

import Plus from '../../../../assets/img/btn/plus.svg';
import X from '../../../../assets/img/btn/x.svg';

import { Round } from "../../../../interface/performance";

const ModalRound = ({handleModal,roundSetting,page,setPage,roundList}) => {

  const {start_date,end_date,run_time} = roundSetting;

  const [roundDtoList ,setRoundDtoList] = useState<Round[]>([])
  const [roundInfo, setRoundInfo] = useState<Round>({
    roundDate: '',
    roundTime: '',
  });

  const handleRound = (e) => {
    setRoundInfo({
      ...roundInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onClickAddRound = () => {
    if(start_date == ''){
      alert("공연 등록 부분에서 시작날짜를 선택해주세요.")
      return;
    }
    if (roundInfo.roundDate === '' || roundInfo.roundTime === '') {
      alert("날짜 또는 시간이 비어있습니다.")
      return;
    }
    
    const newRound = roundInfo;
    // 새로운 회차의 시간을 계산
    const newRoundTime = new Date(roundInfo.roundDate + 'T' + roundInfo.roundTime);
    const runtimeMilliseconds = run_time * 60 * 1000; 
    const newRoundStartTime = newRoundTime.getTime() - runtimeMilliseconds;
    const newRoundEndTime = newRoundTime.getTime() + runtimeMilliseconds;
  
    const isWithinRange = roundDtoList.some(round=> {
      const roundTime = new Date(round.roundDate + 'T' + round.roundTime).getTime();
      return roundTime >= newRoundStartTime && roundTime <= newRoundEndTime;
    });
  
    if (isWithinRange) {
      alert('이미 등록된 회차와 시간이 겹칩니다.');
      return;
    }
  
    const updatedRounds = [...roundDtoList, newRound];
  
    updatedRounds.sort((a, b) => {
      const dateA = new Date(a.roundDate + 'T' + a.roundTime).getTime();
      const dateB = new Date(b.roundDate + 'T' + b.roundTime).getTime();
    return dateA - dateB;
    });

    setRoundDtoList(updatedRounds);
  };

  const onClickDeleteRound = (index) => {
    const updatedItems = roundDtoList.filter((_, i) => i !== index);
    setRoundDtoList(updatedItems);
  };

  useEffect(()=>{
    setRoundDtoList(roundList)
  },[])

  return (
    <div className="round-modal">
      <div className='input-group'>
          <span className=' '></span>
          <label className='show-date-text  '>공연 날짜</label>
          <input 
            className='' 
            type="date" 
            name="roundDate" 
            onChange={handleRound} 
            min={start_date} 
            max={end_date} 
            required
          />
          <label className='show-time-text  '>시작 시간</label>
          <input 
            className=' ' 
            type="time" 
            name="roundTime" 
            step="300"  // 300초는 5분을 나타냅니다
            onChange={handleRound} 
            required
          />
          <img className='button-plus' src={Plus} alt="Add Round" onClick={onClickAddRound} />
      </div>
      <div className='round-list'>
        <table className='round-table'>
          <thead>
            <tr>
              <th className='th-count'>회차</th>
              <th className='th-date'>날짜</th>
              <th className='th-time'>시간</th>
              <th className='th-btn'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {roundDtoList.map((round, index) => (
              <tr key={index}>
                  <td className='td-count'>{index + 1}</td>
                  <td className='td-date'>{round.roundDate}</td>
                  <td className='td-time'>{round.roundTime}</td>
                <td className='td-x'><img src={X} alt="Delete Round" onClick={() => onClickDeleteRound(index)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
              
      <div className="btn-container">
            <button 
            className="button btn-next" 
            onClick={()=>{
              if(roundDtoList.length > 0){
                handleModal(roundDtoList)
                setPage(page + 1);
              } else {
                alert("최소 1회는 등록해야 합니다.")
              }
            }} 
            >
              다음
            </button>
        </div>
      </div>

    </div>
  );
};

export default ModalRound;