import { useEffect, useRef, useState } from 'react';
import {
    isDeleteAlertOpenState,
    isReportAlertOpenState,
    isStarDetailOpenState,
    isPwCheckOpenState,
    isChangeInfoOpenState,
} from 'components/atom';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router';
import swal from 'sweetalert';

// type: 'report', 'PWCheck', 'delete', 'block'
function Alert(props) {
    const alertTypes = {
        block: <Block />,
        delete: (
            <Delete boardIndex={props.boardIndex} userIndex={props.userIndex} />
        ),
        PWCheck: <InputAlert type={props.type} />,
        report: (
            <InputAlert
                type={props.type}
                boardIndex={props.boardIndex}
                userIndex={props.userIndex}
            />
        ),
    };

    return (
        <div className="alert-container bg-modal-outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10">
            <div className="alert w-auto h-auto p-4 bg-alert-bg rounded-xl text-white-sub shadow-xl font-['Pretendard']">
                {alertTypes[props.type]}
            </div>
        </div>
    );
}

// Input 요소를 가진 alert
function InputAlert(props) {
    const input = useRef(null);

    const setIsReportAlertOpen = useSetRecoilState(isReportAlertOpenState);
    const setIsPwCheckOpenState = useSetRecoilState(isPwCheckOpenState);
    const setIsChangeInfoOpen = useSetRecoilState(isChangeInfoOpenState);

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();
            const check = [...e.target.classList].some(
                (it) => it === 'alert-container'
            );

            if (check) {
                handleClose();
            }
        }

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    const toEnter = {
        PWCheck: '비밀번호를',
        report: '신고 내용을',
    };

    const buttonValue = {
        PWCheck: '입력',
        report: '신고',
    };

    const handleReport = async (inputData) => {
        const reportData = {
            boardIndex: props.boardIndex, // 게시글 번호
            memberIndex: props.userIndex, // 유저 번호
            reportContent: inputData,
        };
        console.log(reportData);

        await axios
            .post(`${process.env.REACT_APP_API_URL}/board/report`, reportData, {
                headers: {
                    token: sessionStorage.getItem('token'),
                },
            })
            .then(() => {
                swal({
                    title: '신고가 접수되었습니다🚨',
                    icon: 'warning',
                });

                setIsReportAlertOpen(false);
            })
            .catch((e) =>
                swal({
                    title: '이미 신고한 글입니다',
                    icon: 'info',
                })
            );
    };

    const handlePWChange = (inputData) => {
        /* 1. 비밀번호 일치하는지 체크 */
        const PWData = {
            memberPass: inputData,
        };
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/member/check/pass`,
                PWData,
                {
                    headers: {
                        token: sessionStorage.getItem('token'),
                    },
                }
            )
            .then((response) => {
                // console.log(response.data);
                if (response.data.message === 'success')
                    setIsPwCheckOpenState(false);
                // else alert('비밀번호가 틀렸습니다!');
            });
    };

    // 비밀번호 입력 / 신고 요청
    const handleSubmit = () => {
        // Input 공백 체크
        const emptyCheck = (input) => {
            return input.trim();
        };

        const inputData = input.current.value;

        if (!emptyCheck(inputData)) {
            swal({
                title: `${toEnter[props.type]} 입력해주세요!`,
                icon: 'warning',
            });
            return;
        }

        if (buttonValue[props.type] === '신고') {
            handleReport(inputData);
        } else if (buttonValue[props.type] === '입력') {
            handlePWChange(inputData);
        }
    };

    const handleClose = () => {
        if (props.type === 'report') {
            setIsReportAlertOpen(false);
        } else if (props.type === 'PWCheck') {
            setIsPwCheckOpenState(false);
            setIsChangeInfoOpen(false);
        }
    };
    // className="rounded-input bg-transparent border-white-sub outline-none"
    return (
        <>
            <div className="flex-row">
                {props.type === 'report' ? (
                    <h1 className="text-center text-3xl mb-2 font-['Pre-bold']">
                        신고하기
                    </h1>
                ) : null}
                <div className="text-lg text-center mb-3">
                    {toEnter[props.type]} 입력해주세요.
                </div>
                <div className="flex justify-center mb-3">
                    {props.type === 'report' ? (
                        <textarea
                            className="bg-transparent rounded-lg p-2 h-28 w-80 resize-none border border-gray-300"
                            maxLength="80"
                            ref={input}
                        />
                    ) : (
                        <input
                            type="password"
                            className="bg-transparent border border-white-sub px-2 w-40"
                            ref={input}
                        />
                    )}
                </div>
                <div className="flex justify-center gap-5 px-28">
                    <button
                        className="h-8 px-2"
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        {buttonValue[props.type]}
                    </button>
                    <button
                        className="h-8 px-2"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </>
    );
}

function Delete(props) {
    const setIsDeleteAlertOpen = useSetRecoilState(isDeleteAlertOpenState);
    const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();
            const check = [...e.target.classList].some(
                (it) => it === 'alert-container'
            );

            if (check) {
                handleClose();
            }
        }

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    const handleDelete = async () => {
        const data = {
            boardIndex: props.boardIndex,
            memberIndex: props.userIndex,
        };

        await axios
            .put(`${process.env.REACT_APP_API_URL}/board/delete`, data, {
                headers: {
                    token: sessionStorage.getItem('token'),
                },
            })
            .then((response) => {
                if (response.data.map.response === 'success') {
                    setIsDeleteAlertOpen(false);
                    setIsStarDetailOpen(false);
                }
            });
    };

    const handleClose = () => {
        setIsDeleteAlertOpen(false);
    };

    return (
        <>
            <div className="text-center mb-3 px-20 text-lg">
                <div>별이 빛을 잃고 말거에요.</div>
                <div>정말로.. 삭제할까요?</div>
            </div>
            <div className="flex justify-center gap-5">
                <button
                    className="h-8 px-2"
                    onClick={() => {
                        handleDelete();
                    }}
                >
                    삭제
                </button>
                <button
                    className="h-8 px-2"
                    onClick={() => {
                        handleClose();
                    }}
                >
                    취소
                </button>
            </div>
        </>
    );
}

function Block() {
    // userData -> 로그인 직후에 유저 정보 받아오기
    // memberRole -> Ban일 경우 차단된 사용자
    // memberBanDate -> 차단 일자
    const [userData, setUserData] = useState({
        memberRole: 'Ban',
        memberBanDate: '2024-01-26',
    });
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        // const fetchData = async () => {
        //   await axios
        //     .get(`${process.env.REACT_APP_API_URL}/`)
        //     .then((response) => {
        //       setUserData(response.data);
        //     })
        //     .catch((e) => console.log(e));
        // };
        //   fetchData();
        const date = new Date(userData.memberBanDate);
        setDueDate(new Date(date.setDate(date.getDate() + 7)));
    }, []);

    const handleClose = () => {};

    return (
        <>
            <div>
                <button
                    onClick={() => {
                        handleClose();
                    }}
                >
                    CLOSE
                </button>
            </div>
            <div>
                차단된 사용자입니다.
                <br />
                차단 해제일 :{' '}
                {`${dueDate && dueDate.getFullYear()}년 ${
                    dueDate && dueDate.getMonth() + 1
                }월 ${dueDate && dueDate.getDate()}일`}
            </div>
        </>
    );
}

export default Alert;
