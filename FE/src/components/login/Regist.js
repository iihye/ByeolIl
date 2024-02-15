import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FaUser } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ReactComponent as KakaoLogo } from 'img/kakao-logo.svg';
import swal from 'sweetalert';
import cryptoJs from 'crypto-js';

export default function Regist() {
    const [formOpen, setFormOpen] = useState(false);
    const kakao_join_uri = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_JOIN_REDIRECT_URI}&response_type=code`;
    const [data, setData] = useState();

    const location = useLocation();
    const { social_id, social_platform } = location.state || {}; // state가 undefined인 경우를 대비한 기본값 설정
    useEffect(() => { 
        // 리스너 설치해서 인증성공시, 동작하도록해야할까..
        if (social_id) {
            setFormOpen(true); // social_id가 있으면 formOpen을 true로 설정
        }
    }, []);
   
    return (
        <div>
            {!formOpen && (
                <Card className="w-96 px-6 py-4 card-contain-style">
                    <CardHeader>
                        <CardTitle className="text-6xl text-center font-['Star'] py-4">
                            별일
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="font-['Pre-Bold'] ">
                        <div>
                            <div className="Regist">
                                <div>
                                    <Button
                                        onClick={() => setFormOpen(true)}
                                        className="w-full h-button my-1"
                                    >
                                        일반회원가입
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            window.location.assign(
                                                kakao_join_uri
                                            );
                                        }}
                                        className="w-full h-button my-1 no-hover-effect text-kakao-label flex justify-center items-center gap-2"
                                    >
                                        <KakaoLogo className="w-6 h-6 p-0.5 " />
                                        <div>카카오로 시작하기</div>
                                    </Button>
                                    {/* <button>네이버</button>
                    <button>구글</button> 
                    <button>깃헙</button> */}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            {formOpen && (
                <RegistForm
                    social_id={social_id}
                    social_platform={social_platform}
                />
            )}
        </div>
    );
}

function RegistForm({
    social_id: social_id,
    social_platform: social_platform,
}) {
    
    const navigate = useNavigate();
    // 초기값 - 아이디, 닉네임, 비밀번호, 비밀번호확인, 이메일, 생년월일
    const id = useRef('');
    const name = useRef('');
    const nickName = useRef('');
    const password = useRef('');
    const passwordConfirm = useRef('');
    const email = useRef('');
    const authCode = useRef('');
    const birth = useRef('');
    // 오류메세지 상태 저장
    const [idMessage, setIdMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [nickNameMessage, setNickNameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [authMessage, setAuthMessage] = useState('');
    const [birthMessage, setBirthMessage] = useState('');
    // 유효성 검사
    const [isId, setIsId] = useState(false);
    const [isname, setIsName] = useState(false);
    const [isNickName, setIsNickName] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [isAuthCode, setIsAuthCode] = useState(false);
    const [isBirth, setIsBirth] = useState(false);
    const [openAuthFoam, setOpenAuthFoam] = useState(false);

    // 인증코드
    const [AUTH_CODE, setAUTH_CODE] = useState('');
    // 인증코드 암호화 관련 함수
    const secretKey =`${process.env.REACT_APP_AES256_SECRET_KEY}` // 32자리 비밀키
    const iv = `${process.env.REACT_APP_AES256_IV}` // 16자리 iv
    const decrypt = (encryptedText) => {
        const decipher = cryptoJs.AES.decrypt(encryptedText, cryptoJs.enc.Utf8.parse(secretKey), {
            iv: cryptoJs.enc.Utf8.parse(iv),
            padding: cryptoJs.pad.Pkcs7,
            mode: cryptoJs.mode.CBC,
        })
        return decipher.toString(cryptoJs.enc.Utf8);
    }

    const onChangeId = () => {
        const idRegExp = /^[a-z0-9]{4,20}$/;
        if (!idRegExp.test(id.current.value)) {
            setIdMessage('4~15자 사이의 영문, 숫자만 입력해주세요');
            setIsId(false);
        } else {
            // 아이디 중복체크
            axios
                .get(
                    `${process.env.REACT_APP_API_URL}/member/dup-check/id?id=${id.current.value}`
                )
                .then((response) => {
                    setIdMessage(response.data.message);
                    if (response.data.message === '사용 가능한 아이디입니다.')
                        setIsId(true);
                    else setIsId(false);
                });
        }
    };
    const onChangeName = () => {
        const nameRegExp = /^[가-힣a-zA-Z]{2,10}$/;
        if (!nameRegExp.test(name.current.value)) {
            setNameMessage('이름을 확인해주세요(최대10자, 한글 영문)');
            setIsName(false);
        } else {
            setNameMessage('사용 가능한 이름이에요');
            setIsName(true);
        }
    };
    const onChangeNickName = () => {
        const nickNameRegExp = /^[가-힣a-zA-Z0-9_]{2,10}$/;
        if (!nickNameRegExp.test(nickName.current.value)) {
            setNickNameMessage(
                "2~10자 사이 한글, 영문, 숫자, '_' 만 입력해주세요"
            );
            setIsNickName(false);
        } else {
            // 닉네임 중복체크
            axios
                .get(
                    `${process.env.REACT_APP_API_URL}/member/dup-check/nickname?nickname=${nickName.current.value}`
                )
                .then((response) => {
                    setNickNameMessage(response.data.message);
                    if (response.data.message === '사용 가능한 닉네임입니다.')
                        setIsNickName(true);
                    else setIsNickName(false);
                });
        }
    };
    const onChangePassword = () => {
        const passwordRegExp =
            /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,25}$/;
        if (!passwordRegExp.test(password.current.value)) {
            setPasswordMessage('8~25자 영문, 숫자, 특수문자를 사용해주세요');
            setIsPassword(false);
        } else {
            setPasswordMessage('안전한 비밀번호예요');
            setIsPassword(true);
        }
    };
    const onChangePasswordConfirm = () => {
        if (password.current.value !== passwordConfirm.current.value) {
            setPasswordConfirmMessage('비밀번호가 달라요');
            setIsPasswordConfirm(false);
        } else {
            setPasswordConfirmMessage('비밀번호가 확인되었어요');
            setIsPasswordConfirm(true);
        }
    };
    const onChangeEmail = () => {
        const emailRegExp =
            /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
        if (!emailRegExp.test(email.current.value)) {
            setEmailMessage('이메일의 형식이 올바르지 않아요');
            setIsEmail(false);
        } else {
            // 이메일 중복체크
            axios
                .get(
                    `${process.env.REACT_APP_API_URL}/member/dup-check/email?email=${email.current.value}`
                )
                .then((response) => {
                    setEmailMessage(response.data.message);
                    if (response.data.message === '사용 가능한 이메일입니다.')
                        setIsEmail(true);
                    else setIsEmail(false);
                });
        }
    };
    // 인증번호 일치 검사
    const onChangeAuthCode = () => {
        if (authCode.current.value !== decrypt(AUTH_CODE)) {
            setAuthMessage("인증번호를 다시 입력해주세요");
            setIsAuthCode(false);
        } else {
            setAuthMessage("인증되었어요");
            setIsAuthCode(true);
        }
    };
    const onChangeBirth = () => {
        const dateRegex1 = /^\d{4}-\d{2}-\d{2}$/; //? YYYY-MM-DD 형식의 정규식
        const dateRegex2 = /^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[01])$/; //YYYY-MM-DD 각 자리에 유효한 생년월일인지 확인

        if (dateRegex1.test(birth.current.value)) {
            if (dateRegex2.test(birth.current.value)) {
                setBirthMessage('올바르게 입력했어요');
                setIsBirth(true);
            } else {
                setBirthMessage('유효하지 않은 생년월일이에요');
                setIsBirth(false);
            }
        } else {
            {
                setBirthMessage('유효하지 않은 생년월일이에요');
                setIsBirth(false);
            }
        }
    };
    const doAuth = function () {
        setOpenAuthFoam(true);
        // 이메일로 인증코드 보내기.
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/member/check/email?email=${email.current.value}`
            )
            .then((response) => {
                console.log(response.data.code);
                setAUTH_CODE(response.data.code);
            });
    };

    const doRegist = () => {
        // 중복체크 및 인증 완료시 회원가입 성공
        const data = {
            memberId: social_id === undefined ? id.current.value : social_id,
            memberPass:
                social_platform === undefined
                    ? password.current.value
                    : social_platform, //소셜로그인일 경우 소셜플랫폼으로 입력
            memberPlatform:
                social_platform === undefined ? 'origin' : social_platform, //소셜로그인인지 일반로그인인지
            memberName: name.current.value,
            memberNickname: nickName.current.value,
            memberEmail: email.current.value,
            memberBirth: birth.current.value, //형식 준수해야함
        };
        axios
            .post(`${process.env.REACT_APP_API_URL}/member/join`, data)
            .then((response) => {
                if (response.data.message === 'success') {
                    swal({
                        title: '회원가입 성공!',
                        text: `${data.memberNickname}님 환영합니다😊`,
                        icon: 'success',
                    }).then(() => navigate(-1));
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };
    const form = useForm();
    useEffect(() => {
        if(social_id){
            setIsId(true);
            setIsPassword(true);
            setIsPasswordConfirm(true);
        }
    },[])

    return (
        <div>
            <Card className="Regist w-96 px-6 py-6 card-contain-style">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                        <FaUser className="mr-1" />
                        회원가입
                    </CardTitle>
                </CardHeader>
                <div></div>
                <CardContent>
                    <div className="form">
                        {!social_id && (
                            <div className="form-el">
                                <div className="flex justify-between">
                                    <label
                                        className="regist-label"
                                        htmlFor="id"
                                    >
                                        아이디
                                    </label>{' '}
                                    <br />
                                    <div>
                                        <div className="flex justify-end">
                                            <input
                                                className="regist-input"
                                                id="id"
                                                name="id"
                                                ref={id}
                                                onBlur={onChangeId}
                                            />
                                        </div>
                                        <p
                                            className={`message regist-message ${
                                                idMessage.length > 14
                                                    ? `text-red-600`
                                                    : `text-green-500`
                                            }`}
                                        >
                                            {' '}
                                            {idMessage}{' '}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="form-el">
                            <div className="flex justify-between">
                                <label className="regist-label" htmlFor="name">
                                    이름
                                </label>{' '}
                                <br />
                                <div>
                                    <div className="flex justify-end">
                                        <input
                                            className="regist-input"
                                            id="name"
                                            name="name"
                                            ref={name}
                                            onBlur={onChangeName}
                                        />
                                    </div>
                                    <p
                                        className={`messag regist-message ${
                                            nameMessage.length > 12
                                                ? `text-red-600`
                                                : `text-green-500`
                                        }`}
                                    >
                                        {nameMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="form-el">
                            <div className="flex justify-between">
                                <label
                                    className="regist-label"
                                    htmlFor="nickName"
                                >
                                    닉네임
                                </label>{' '}
                                <br />
                                <div>
                                    <div className="flex justify-end">
                                        <input
                                            className="regist-input"
                                            id="nickName"
                                            name="nickName"
                                            ref={nickName}
                                            onBlur={onChangeNickName}
                                        />
                                    </div>
                                    <p
                                        className={`messag regist-message ${
                                            nickNameMessage.length > 14
                                                ? `text-red-600`
                                                : `text-green-500`
                                        }`}
                                    >
                                        {nickNameMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {!social_id && (
                            <div className="form-el">
                                <div className="flex justify-between">
                                    <label
                                        className="regist-label"
                                        htmlFor="password"
                                    >
                                        비밀번호
                                    </label>{' '}
                                    <br />
                                    <div>
                                        <div className="flex justify-end">
                                            <input
                                                type="password"
                                                className="regist-input"
                                                id="password"
                                                name="password"
                                                ref={password}
                                                onBlur={onChangePassword}
                                            />
                                        </div>
                                        <p
                                            className={`messag regist-message ${
                                                passwordMessage.length > 10
                                                    ? `text-red-600`
                                                    : `text-green-500`
                                            }`}
                                        >
                                            {passwordMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!social_id && (
                            <div className="form-el">
                                <div className="flex justify-between">
                                    <label
                                        className="regist-label"
                                        htmlFor="passwordConfirm"
                                    >
                                        비밀번호확인
                                    </label>{' '}
                                    <br />
                                    <div>
                                        <div className="flex justify-end">
                                            <input
                                                type="password"
                                                className="regist-input"
                                                id="passwordConfirm"
                                                name="passwordConfirm"
                                                ref={passwordConfirm}
                                                onBlur={onChangePasswordConfirm}
                                            />
                                        </div>
                                        <p
                                            className={`messag regist-message ${
                                                passwordConfirmMessage.length <
                                                12
                                                    ? `text-red-600`
                                                    : `text-green-500`
                                            }`}
                                        >
                                            {passwordConfirmMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="form-el">
                            <div className="flex justify-between">
                                <label
                                    className="regist-label w-1/3"
                                    htmlFor="email"
                                >
                                    이메일
                                </label>{' '}
                                <br />
                                <div>
                                    <div className="flex justify-end">
                                        <input
                                            className="regist-input"
                                            id="email"
                                            name="email"
                                            ref={email}
                                            onBlur={onChangeEmail}
                                        />
                                    </div>
                                    <p
                                        className={`messag regist-message ${
                                            emailMessage.length > 14
                                                ? `text-red-600`
                                                : `text-green-500`
                                        }`}
                                    >
                                        {emailMessage}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="regist-button w-full h-button px-2 mb-2"
                                disabled={!isEmail}
                                onClick={() => {
                                    doAuth();
                                }}
                            >
                                인증하기
                            </button>
                        </div>
                        {openAuthFoam && (
                            <div className="form-el">
                                <div className="flex justify-between">
                                    <label
                                        className="regist-label"
                                        htmlFor="authCode"
                                    >
                                        인증코드
                                    </label>{' '}
                                    <br />
                                    <div>
                                        <div className="flex justify-end">
                                            <input
                                                className="regist-input"
                                                id="authCode"
                                                name="authCode"
                                                ref={authCode}
                                                onBlur={onChangeAuthCode}
                                                placeholder={
                                                    '인증번호를 입력하세요'
                                                }
                                            />
                                        </div>
                                        <p
                                            className={`messag regist-message ${
                                                authMessage.length > 6
                                                    ? `text-red-600`
                                                    : `text-green-500`
                                            }`}
                                        >
                                            {authMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="form-el">
                            <div className="flex justify-between">
                                <label className="regist-label" htmlFor="birth">
                                    생년월일
                                </label>{' '}
                                <br />
                                <div>
                                    <div className="flex justify-end">
                                        <input
                                            className="regist-input"
                                            placeholder="YYYY-MM-DD"
                                            id="birth"
                                            name="birth"
                                            ref={birth}
                                            onBlur={onChangeBirth}
                                        />
                                    </div>
                                    <p
                                        className={`messag regist-message ${
                                            birthMessage.length > 10
                                                ? `text-red-600`
                                                : `text-green-500`
                                        }`}
                                    >
                                        {birthMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            className="regist-button w-full h-button my-1"
                            onClick={doRegist}
                            disabled={
                                !(
                                    isId &&
                                    isname &&
                                    isNickName &&
                                    isPassword &&
                                    isPasswordConfirm &&
                                    isEmail &&
                                    isBirth &&
                                    isAuthCode
                                )
                            }
                        >
                            가입하기
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
