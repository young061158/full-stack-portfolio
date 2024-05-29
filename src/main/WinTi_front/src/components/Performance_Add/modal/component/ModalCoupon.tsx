import React, { useEffect, useState } from 'react';

import { Coupon } from '../../../../interface/performance';

import Plus from '../../../../assets/img/btn/plus.svg';
import X from '../../../../assets/img/btn/x.svg';



const ModalCoupon = ({handleModal, setShowModal, couponList}) => {

    const [couponDtoList,setCouponDtoList] = useState<Coupon[]>([])
    const [defaultCouponList,setDefaultCouponList] = useState<Coupon[]>([
        {
            couponName: "조기 예매",
            discount: 10,
            couponCode:"기본쿠폰조깅예매",
            isPermit: true,
        }, {
            couponName: "어린이 쿠폰",
            discount: 10,
            couponCode:"기본쿠폰어린이쿠폰",
            isPermit: true,
        }, {
            couponName: "직장인 쿠폰",
            discount: 10,
            couponCode:"기본쿠폰직장인쿠폰",
            isPermit: true,
        }, {
            couponName: "장애인경증",
            discount: 10,
            couponCode:"기본쿠폰장애인경증",
            isPermit: true,
        }, {
            couponName: "장애인 중증",
            discount: 15,
            couponCode:"기본쿠폰장애인중증",
            isPermit: true,
        }, {
            couponName: "국가 유공자",
            discount: 20,
            couponCode:"기본쿠폰국가유공자",
            isPermit: true,
        },
    ]);

    const [couponDto, setCouponDto] = useState<Coupon>({
        couponName: "",
        discount: 0,
        couponCode:"",
        isPermit: true,
    });

    const handleCouponCheck = (e, index) => {
        const isChecked = e.target.checked;
        setDefaultCouponList(prevList => {
            return prevList.map((item, i) =>
                i === index ? { ...item, isPermit: isChecked } : item
            );
        });
    };

    const handleChangeCoupon = (e) => {
    const { name, value } = e.target;

    let inputValue = value;
        if (name === 'discount') {
            // 숫자가 아닌 문자는 모두 제거
            inputValue = value.replace(/\D/g, '');

            // 값이 100 이하인지 확인
            if (parseInt(inputValue, 10) > 50) {
                alert("50 % 이상 등록할수 없습니다.")
                inputValue = '50'; // 100 이상일 경우 100으로 설정
            }
        }

        if (value.length <= 10) {
            setCouponDto({
            ...couponDto,
            [name]: inputValue
            });
        }
    };

    const onClickDeleteCoupon = (index) => {
        const updatedItems = couponDtoList.filter((_, i) => i !== index);
        setCouponDtoList(updatedItems);
    }

    const generateRandomString = () => {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const onClcickAddCoupon = () => {
        
        if (couponDto.couponName === ""){
            alert("쿠폰 명이 비어있습니다.");
            return;
        }
        if(couponDto.discount <= 0) {
            alert("퍼센트가 잘못 입력 되었습니다.");
            return;
        }
        if(couponDtoList.length >= 10){
            alert("최대 생성 개수를 초과하였습니다.");
            return;
        }
        if (couponDtoList.some(couponData => couponData.couponName === couponDto.couponName)) {
            alert("이미 있는 쿠폰입니다.");
            return;
        }
        setCouponDtoList([
            ...couponDtoList,
            couponDto
        ])
    }

    const onClickCouponFixed = () => {
        if (couponDtoList.length === 6) {
            const alertConfirm = window.confirm("기본 등록 하시겠습니까?");
            if (!alertConfirm) {
                return;
            }
        }

        handleModal([
            ...defaultCouponList
            ,...couponDtoList
        ]);
        
        alert("등록 완료.");
        setShowModal(false)
    }

    useEffect(()=>{
        if(couponList.length > 0){
            const SettingDefaultList = couponList.slice(0, 6);
            setDefaultCouponList(SettingDefaultList)
        }
        const SettingAddList = couponList.slice(6);
        setCouponDtoList(SettingAddList)
    },[])

    useEffect(()=>{
        setCouponDto((prevCouponDto) => ({
            ...prevCouponDto,
            couponCode: generateRandomString()
        }));
    },[couponList])

    return (
        <div className='coupon-modal'>
            <div className='coupon-title'>
                <span className='h3 coupon-add'>적용 할 할인을 선택해 주세요.</span>
                <span className='h3 coupon-list'>쿠폰 리스트 {couponDtoList.length === 0 ? null : couponDtoList.length}</span>
            </div>
            <div className='coupons-setting'>
                <div className="coupon-box">
                    <div className="defalut-coupon">
                        <div className="background-box defalut">
                            <label className="default-title">기본 할인</label>
                        </div>
                        <div className="inner-box inner-box-1">
                            {defaultCouponList.map((coupon, index) => (
                                <label key={index} className="discounts">
                                    <span className='coupon coupon-name'>{coupon.couponName}</span>
                                    <span className='coupon coupon-discount'>{coupon.discount}%</span>
                                    <input
                                        className='coupon coupon-checkbox'
                                        type='checkbox'
                                        onChange={(e) => handleCouponCheck(e, index)}
                                        checked={coupon.isPermit}
                                    />
                                </label>
                            ))}
                        </div>

                    </div>
                    <div className="additional-coupon">
                        <div className="background-box additional">
                            <label className="default-title">추가 쿠폰</label>
                        </div>
                        <div className="inner-box inner-box-2">
                            <label className="discounts">
                                <input type='text' className='coupon coupon-name' name='couponName' placeholder='쿠폰 명' value={couponDto.couponName} onChange={handleChangeCoupon} />
                                <input type='text' className='coupon coupon-discount' name='discount' value={couponDto.discount} onChange={handleChangeCoupon} />
                                <span className='coupon percent'>%</span>
                                <img src={Plus} className='coupon coupon-btn' onClick={onClcickAddCoupon} />
                            </label>
                        </div>
                    </div>
                </div>
                <div className='additional-list'>
                    <ul className='ul ul-additional'>
                        {couponDtoList.map((coupon, index) => (
                            <li key={index} className='li li-additional'>
                                <span className='li-couponName'>{coupon.couponName}</span>
                                <span className='li-discount'>{coupon.discount}%</span>
                                <img src={X} className='li-remove' onClick={() => onClickDeleteCoupon(index)} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="btn-container">
                <button 
                className="button btn-next" 
                onClick={onClickCouponFixed}
                >
                등록
                </button>
            </div>
        </div>
    )
}

export default ModalCoupon
