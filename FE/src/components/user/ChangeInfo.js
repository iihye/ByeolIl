import React, { useRef, useState, useEffect } from 'react';
import PWCheck from './PWCheckAlert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isChangeInfoOpenState, isPwCheckOpenState } from 'components/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiLockPasswordLine } from 'react-icons/ri';
import swal from 'sweetalert';

// Sidebar에서 회원정보 수정 버튼 누름 -> PWCheckAlert를 먼저 가서 비밀번호 검사
// -> 검사 통과시에 ChangeInfo에 연결. -> 소셜로그인 회원은 비밀번호 수정이 없고 닉네임 수정만 있다.
// -> 소셜로그인 회원은 비밀번호 수정이 없고 닉네임 수정만 있다.
// + 닉네임수정은 메인화면에서 "OO님의 우주" 옆에 수정 아이콘을 눌러서 바로 수정이 되는 기능도

export default function ChangeInfo() {
    // const isPwCheckOpen = useRecoilValue(isPwCheckOpenState);
    const [isPwCheckOpen, setIsPwCheckOpen] =
        useRecoilState(isPwCheckOpenState);
    const setIsChangeInfoOpen = useSetRecoilState(isChangeInfoOpenState);
    console.log(isPwCheckOpen);
    const navigate = useNavigate();

    // 패스워드, 패스워드확인
    const password = useRef('');
    const passwordConfirm = useRef('');

    // 오류메세지 상태 저장
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');

    // 유효성 검사
    const [isPassword, setIsPassword] = useState(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

    const onChangePassword = () => {
        const passwordRegExp =
            /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,25}$/;
        if (!passwordRegExp.test(password.current.value)) {
            setPasswordMessage(
                '숫자+영문자+특수문자 조합으로 8자리 이상 25자 이하로 입력해주세요!'
            );
            setIsPassword(false);
        } else {
            setPasswordMessage('안전한 비밀번호 입니다.');
            setIsPassword(true);
        }
    };
    const onChangePasswordConfirm = () => {
        if (password.current.value !== passwordConfirm.current.value) {
            setPasswordConfirmMessage('비밀번호가 똑같지 않아요!');
            setIsPasswordConfirm(false);
        } else {
            setPasswordConfirmMessage('똑같은 비밀번호를 입력했습니다.');
            setIsPasswordConfirm(true);
        }
    };

    // 비밀번호 수정기능
    const handlesubmit = () => {
        const data = {
            memberIndex: sessionStorage.getItem('memberIndex'),
            memberPass: password.current.value,
        };
        axios
            .put(`${process.env.REACT_APP_API_URL}/member`, data, {
                headers: {
                    token: sessionStorage.getItem('token') ?? '',
                },
            })
            .then(() => {
                swal({
                    title: '비밀번호 변경 성공!',
                    icon: 'success',
                }).then(() => {
                    setIsPwCheckOpen(true);
                    setIsChangeInfoOpen(false);
                });
            });
    };

    // 회원탈퇴
    const handleDelete = () => {
        if (window.confirm('정말로 탈퇴하시겠습니까?')) {
            axios
                .put(`${process.env.REACT_APP_API_URL}/member/delete`, {
                    headers: {
                        token: sessionStorage.getItem('token') ?? '',
                    },
                })
                .then(() => {
                    // console.log(response.data);
                    swal({
                        title: '회원탈퇴 처리가 완료되었습니다',
                        icon: 'success',
                    }).then(() => {
                        sessionStorage.removeItem('memberIndex');
                        sessionStorage.removeItem('nickname');
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('auth');
                        setIsPwCheckOpen(true);
                        setIsChangeInfoOpen(false);
                        navigate('/landing');
                    });
                });
        }
    };

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();
            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                setIsPwCheckOpen(true);
                setIsChangeInfoOpen(false);
            }
        }

        window.addEventListener('click', handleClick);

        // 마운트 시 무조건 비밀번호 체크하기
        setIsPwCheckOpen(true);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <>
            {isPwCheckOpen ? (
                <PWCheck />
            ) : (
                <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
                    <Card
                        className="changePW h-88 bg-modal-bg text-white-sub px-6 py-6 rounded-component"
                        style={{ width: '500px' }}
                    >
                        <CardHeader className="flex">
                            <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                                <RiLockPasswordLine className="mr-1" />
                                회원정보수정
                            </CardTitle>
                        </CardHeader>
                        <div></div>
                        <CardContent>
                            <div className="form">
                                <div className="form-el mb-2 h-24">
                                    <label
                                        className="regist-label"
                                        htmlFor="password"
                                    >
                                        새로운 비밀번호
                                    </label>{' '}
                                    <br />
                                    <input
                                        className="find-input"
                                        id="password"
                                        name="password"
                                        ref={password}
                                        onBlur={onChangePassword}
                                    />
                                    <p className="message regist-message">
                                        {passwordMessage}
                                    </p>
                                </div>
                                <div className="form-el mb-2 h-24">
                                    <label
                                        className="regist-label"
                                        htmlFor="passwordConfirm"
                                    >
                                        비밀번호 확인
                                    </label>{' '}
                                    <br />
                                    <input
                                        className="find-input"
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        ref={passwordConfirm}
                                        onBlur={onChangePasswordConfirm}
                                    />
                                    <p className="message regist-message">
                                        {passwordConfirmMessage}
                                    </p>
                                </div>
                                <br />
                                <div className="flex justify-center itmes-center">
                                    <button
                                        className={`regist-button w-full h-button mt-2 px-2 mb-2 ${
                                            !(isPassword && isPasswordConfirm)
                                                ? 'opacity-50'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            handlesubmit();
                                        }}
                                        disabled={
                                            !(isPassword && isPasswordConfirm)
                                        }
                                    >
                                        수정하기
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-center itmes-center">
                                <button
                                    className="regist-button w-full h-button mt-2 px-2 mb-2"
                                    onClick={() => {
                                        handleDelete();
                                    }}
                                >
                                    탈퇴하기
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
