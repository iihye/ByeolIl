import axios from 'axios';
import StarDeleteAlert from 'components/star/StarDeleteAlert';
import StarReplyList from 'components/star/StarReplyList';
import StarReportAlert from 'components/star/StarReportAlert';
import Alert from './Alert';
import { isStarDetailOpenState } from 'components/atom';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    isDeleteAlertOpenState,
    isReportAlertOpenState,
    isStarModifyOpenState,
    renewReplyState,
    isAlarmDetailState,
    isReportDetailOpenState,
} from 'components/atom';
import { useNavigate } from 'react-router';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { PiSiren } from 'react-icons/pi';
import { FaRegTrashCan } from 'react-icons/fa6';
import { TiSpannerOutline } from 'react-icons/ti';
import { CgCloseR } from 'react-icons/cg';
import { IoMdSend } from 'react-icons/io';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';
import { ScrollArea } from '@/components/ui/scroll-area';
import swal from 'sweetalert';
import { EXTENSION_IMAGE, EXTENSION_VIDEO } from 'data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaRadio } from 'react-icons/fa6';
import { FaRegFaceSadTear } from 'react-icons/fa6';
import { RiCloseFill } from 'react-icons/ri';
// type: "radio", "star", "report"
function Modal(props) {
    const type = props.type;

    return (
        <div className="modal-container absolute bg-modal-outside top-0 left-0 flex justify-center items-center w-full h-full z-20">
            <div className="modal bg-modal-bg rounded-lg p-3 w-fit font-['Pre-bold']">
                {type === 'radio' ? (
                    <RadioContent />
                ) : (
                    <StarContent {...props} />
                )}
            </div>
        </div>
    );
}

function StarContent(props) {
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useRecoilState(
        isDeleteAlertOpenState
    );
    const [isReportAlertOpen, setIsReportAlertOpen] = useRecoilState(
        isReportAlertOpenState
    );
    const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
    const setIsStarModifyOpen = useSetRecoilState(isStarModifyOpenState);
    const setIsDetailAlarmOpen = useSetRecoilState(isAlarmDetailState);
    const setReportModalState = useSetRecoilState(isReportDetailOpenState);

    const [data, setData] = useState(null);
    const [likeData, setLikeData] = useState([]);
    const [isLike, setIsLike] = useState(false);

    const replyInputRef = useRef();

    // properties
    const loginUserIndex = Number(sessionStorage.getItem('memberIndex'));
    const type = props.type;
    const reportInfo = props.reportInfo;
    const starIndex = props.starIndex;
    const writerIndex = props.userIndex;
    const location = props.location;

    // 글 조회 / 수정시 내용 갱신
    useEffect(() => {
        const fetchData = async (starIndex) => {
            await axios
                .get(
                    `${process.env.REACT_APP_API_URL}/board/${starIndex}/${loginUserIndex}`,
                    {
                        headers: {
                            token: sessionStorage.getItem('token') ?? '',
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    data.boardInputDate = data.boardInputDate.split('.');
                    data.boardUpdateDate = data.boardUpdateDate
                        .split(' ')[0]
                        .split('.');

                    const likeState = response.data.boardLike;
                    if (likeState) {
                        setIsLike(true);
                    } else {
                        setIsLike(false);
                    }
                    console.log(response.data);
                    setData(response.data);
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        setReportModalState(false);
                        setIsDetailAlarmOpen(false);
                        setIsStarDetailOpen(false);
                        swal({
                            title: '삭제된 글입니다',
                            icon: 'warning',
                        });
                    }
                });
        };
        fetchData(starIndex);
    }, []);

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();
            const check = [...e.target.classList].some(
                (it) => it === 'modal-container'
            );
            if (check) {
                handleClose();
            }
        }

        const handleClose = () => {
            /* 모달 닫기 */
            setIsDeleteAlertOpen(false);
            setIsReportAlertOpen(false);
            setIsStarModifyOpen(false);
            setIsStarDetailOpen(false);
            setReportModalState(false);
        };
        function handleKeydown(e) {
            if (e.key === 'Escape') {
                handleClose();
            }
        }

        window.addEventListener('click', handleClick);
        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    const handleDelete = () => {
        /* 삭제하시겠습니까 alert 띄우기 */
        setIsDeleteAlertOpen(true);
    };

    const handleReport = () => {
        /* 신고 내용 입력 alert 출력 */
        setIsReportAlertOpen(true);
    };

    const handleModify = () => {
        setIsStarModifyOpen([data, starIndex, location, loginUserIndex]);
        setIsStarDetailOpen(false);
    };

    const handleLike = async () => {
        /* 게시글 좋아요 Req */
        const data = {
            boardIndex: starIndex,
            memberIndex: loginUserIndex,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/board/like`,
                data,
                {
                    headers: {
                        token: sessionStorage.getItem('token'),
                    },
                }
            );

            if (response.request.status === 200) {
                setIsLike(true);
            } else {
                console.log('좋아요 실패');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDislike = async () => {
        const data = {
            boardIndex: starIndex,
            memberIndex: loginUserIndex,
        };

        await axios
            .delete(`${process.env.REACT_APP_API_URL}/board/like`, {
                headers: {
                    token: sessionStorage.getItem('token'),
                },
                data: data,
            })
            .then((response) => {
                if (response.data.map.response === 'success') {
                    setIsLike(false);
                }
            });
    };

    const handleClose = () => {
        /* 모달 닫기 */
        setIsDeleteAlertOpen(false);
        setIsReportAlertOpen(false);
        setIsStarModifyOpen(false);
        setIsStarDetailOpen(false);
        setReportModalState(false);
    };

    /* 게시글 작성자 체크*/
    const isWriter = () => {
        return writerIndex === loginUserIndex;
    };

    /* 로그인 체크 */
    const isLogin = () => {
        return sessionStorage.getItem('token') ? true : false;
    };

    async function handleRadio() {
        const data = {
            memberIndex: writerIndex,
            boardIndex: starIndex,
        };

        await axios
            .post(`${process.env.REACT_APP_API_URL}/radio`, data, {
                headers: {
                    token: sessionStorage.getItem('token'),
                },
            })
            .then(() =>
                swal({
                    title: '라디오 전송 성공!',
                    icon: 'success',
                })
            )
            .catch((error) => console.log(error));
    }

    return (
        <div className="flex items-center">
            {data && data.boardMedia.length > 0 ? (
                <MediaArea data={data} />
            ) : null}

            <div className="star-content">
                {/* 최상단 */}
                <div className="star-content-top text-white-sub">
                    {/* 지정일 */}
                    <div className="relative text-2xl mb-2 font-['Pre-bold'] flex justify-between items-center">
                        {data ? (
                            <div>
                                20{data.boardInputDate[0]}년{' '}
                                {data.boardInputDate[1]}월{' '}
                                {data.boardInputDate[2]}일
                                <span className="text-lg">의 기록</span>
                            </div>
                        ) : (
                            '로딩중'
                        )}
                    </div>
                </div>

                <div className="">
                    <ScrollArea className="star-content-content relative w-96 border border-white-sub rounded-lg text-white-sub p-2 h-44 bg-alert-bg">
                        {/* 게시글 내용 */}
                        {data ? data.boardContent : '로딩중'}
                    </ScrollArea>
                </div>

                <div>
                    {/* 해시태그 */}
                    <div className="flex text-white-sub gap-3 mt-2">
                        {data
                            ? data.hashContent.map((i, idx) => (
                                  <div key={idx}># {i}</div>
                              ))
                            : '로딩중'}
                    </div>
                </div>
                {type === 'report' ? (
                    <div>{reportInfo && reportInfo.reportContent}</div>
                ) : null}
                <div>
                    {/* 댓글 리스트 영역 */}
                    <StarReplyList
                        boardIndex={starIndex}
                        handleRadio={handleRadio}
                        isWriter={isWriter}
                    />
                </div>
                <div>
                    {/* 최하단 */}
                    {type === 'star' ? (
                        <>
                            {/* 댓글 작성 영역 */}
                            {isLogin() && (
                                <ReplyRegistArea
                                    starIndex={starIndex}
                                    loginUserIndex={loginUserIndex}
                                />
                            )}
                        </>
                    ) : null}
                    <div className="flex justify-between items-center text-2xl">
                        <div className="flex gap-1 items-center">
                            {type === 'star' ? (
                                <>
                                    <LikeButtons
                                        isLike={isLike}
                                        handleLike={handleLike}
                                        handleDislike={handleDislike}
                                    />
                                    <ReportButton handleReport={handleReport} />
                                    {isWriter() && (
                                        <>
                                            <DeleteButton
                                                handleDelete={handleDelete}
                                            />
                                            <ModifyButton
                                                handleModify={handleModify}
                                            />
                                        </>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                        <CloseButton handleClose={handleClose} />
                    </div>
                </div>
            </div>
            <div className="alert">
                {isDeleteAlertOpen && (
                    <StarDeleteAlert
                        boardIndex={starIndex}
                        userIndex={loginUserIndex}
                    />
                )}
                {isReportAlertOpen && (
                    <StarReportAlert
                        boardIndex={starIndex}
                        userIndex={loginUserIndex}
                    />
                )}
            </div>
        </div>
    );
}

function CloseButton(props) {
    const handleClose = props.handleClose;
    return (
        <div
            className="text-white-sub hover:hover text-3xl"
            onClick={handleClose}
        >
            <CgCloseR />
        </div>
    );
}
function ModifyButton(props) {
    const handleModify = props.handleModify;
    return (
        <div
            className="text-white-sub hover:hover text-3xl"
            onClick={handleModify}
        >
            <TiSpannerOutline />
        </div>
    );
}

function DeleteButton(props) {
    const handleDelete = props.handleDelete;

    return (
        <div className="text-white-sub hover:hover" onClick={handleDelete}>
            <FaRegTrashCan />
        </div>
    );
}
function ReportButton(props) {
    const handleReport = props.handleReport;

    return (
        <div
            className="text-white-sub text-3xl hover:hover"
            onClick={handleReport}
        >
            <PiSiren />
        </div>
    );
}
function LikeButtons(props) {
    const isLike = props.isLike;
    const handleLike = props.handleLike;
    const handleDislike = props.handleDislike;

    return (
        <>
            {!isLike ? (
                <div
                    className="hover:cursor-pointer text-white-sub hover:text-white"
                    onClick={handleLike}
                >
                    <FaRegHeart />
                </div>
            ) : (
                <div
                    className="hover:cursor-pointer text-white-sub hover:text-white"
                    onClick={handleDislike}
                >
                    <FaHeart />
                </div>
            )}
        </>
    );
}

function MediaArea(props) {
    const areaRef = useRef();

    const data = props.data;

    let lastPage = data.boardMedia.length - 1;

    const [curPage, setCurPage] = useState(0);

    function handleLeft() {
        if (curPage <= 0) return;
        setCurPage(curPage - 1);
    }

    function handleRight() {
        if (curPage >= lastPage) return;
        setCurPage(curPage + 1);
    }

    useEffect(() => {
        areaRef.current.style.transform = `translateX(${
            -Math.min(curPage, lastPage) * 32
        }rem)`;
    }, [curPage]);

    return (
        <div className="flex items-center top-12 rounded right-full p-5 mr-6 h-full bg-modal-bg">
            <div className="flex relative overflow-hidden items-center w-pic">
                <div
                    className="flex items-center h-pic transition-all"
                    ref={areaRef}
                >
                    {data &&
                        data.boardMedia.map((it, index) => {
                            const arr = it.split('.');
                            const type = arr[arr.length - 1];

                            return (
                                <div
                                    className="w-pic h-pic bg-black-sub flex items-center"
                                    key={index}
                                >
                                    {EXTENSION_IMAGE.has(type) ? (
                                        <img
                                            className="w-pic max-h-pic"
                                            src={it}
                                            key={index}
                                            alt="it"
                                        ></img>
                                    ) : null}
                                    {EXTENSION_VIDEO.has(type) ? (
                                        <video
                                            className="w-pic max-h-pic"
                                            src={it}
                                            key={index}
                                            alt="it"
                                            controls
                                        ></video>
                                    ) : null}
                                </div>
                            );
                        })}
                </div>
                <FaChevronLeft
                    className="absolute left-0 h-full w-8 mx-2 text-black-sub hover:text-black"
                    onClick={handleLeft}
                />
                <FaChevronRight
                    className="absolute right-0 h-full w-8 mx-2 text-black-sub hover:text-black"
                    onClick={handleRight}
                />
            </div>
        </div>
    );
}

function ReplyRegistArea(props) {
    const inputRef = useRef();

    const [renewReply, setRenewReply] = useRecoilState(renewReplyState);

    const handleRegistReply = async () => {
        const data = {
            boardIndex: props.starIndex,
            memberIndex: props.loginUserIndex,
            commentContent: inputRef.current.value.trim(),
        };

        if (data.commentContent === '') {
            swal({
                title: '내용을 입력해주세요',
                icon: 'info',
            });
            return;
        }
        await axios
            .post(`${process.env.REACT_APP_API_URL}/comment`, data, {
                header: {
                    token: sessionStorage.getItem('token'),
                },
            })
            .then((response) => {
                if (response.data.map.response === 'success') {
                    inputRef.current.value = '';
                    setRenewReply(!renewReply);
                } else {
                    swal({
                        title: '댓글 등록 실패',
                        icon: 'error',
                    });
                }
            })
            .catch((error) => console.log(error));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleRegistReply();
        }
    };

    return (
        <>
            <div className="w-full flex items-center justify-between w-96">
                <input
                    className="border my-2 p-1 px-2 mr-2 w-full bg-alert-bg text-white-sub"
                    placeholder="댓글 내용을 입력해주세요."
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                />
                <div
                    className="text-white-sub text-xl w-8 p-2 text-start rounded hover:text-modal-bg hover:bg-white-sub duration-200 hover:cursor-pointer"
                    onClick={handleRegistReply}
                >
                    <IoMdSend />
                </div>
            </div>
        </>
    );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function RadioContent() {
    const [rdata, setRdata] = useState();
    const [isReportAlertOpen, setIsReportAlertOpen] = useRecoilState(
        isReportAlertOpenState
    );
    const [repostActive, setRepostActive] = useState(false);
    const [audioSrc, setAudioSrc] = useState('');
    const navigate = useNavigate();
    const fetchData = async () => {
        await axios
            .get(
                `${
                    process.env.REACT_APP_API_URL
                }/radio/${sessionStorage.getItem('memberIndex')}`,
                {
                    headers: {
                        token: sessionStorage.getItem('token') ?? '',
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                setRdata(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const fetchDataWav = async () => {
        if (!rdata) return; // rdata가 null일 때는 메소드를 종료

        await axios
            .get(
                `${process.env.REACT_APP_TTS_URL}/api/infer-glowtts?text=${rdata.boardContent}`,
                {
                    responseType: 'blob',
                }
            )
            .then((response) => {
                const blobUrl = URL.createObjectURL(response.data);
                setAudioSrc(blobUrl);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        // 최초1회 데이터를 수신한다.
        fetchData();
    }, []);

    function handleClose(e) {
        e.stopPropagation();
        if (rdata) {
            swal({
                title: '창을 닫을까요?',
                text: '해당 라디오 내용은 다시 돌아오지 않아요!',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    navigate(-1);
                }
            });
        } else {
            navigate(-1);
        }
    }

    useEffect(() => {
        // TTS 음성파일 추출 및 다운.
        fetchDataWav();
    }, [rdata]); // rdata에 의존성

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();
            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );

            if (check) {
                if (rdata) {
                    swal({
                        title: '창을 닫을까요?',
                        text: '해당 라디오 내용은 다시 돌아오지 않아요!',
                        icon: 'warning',
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            console.log('!!');
                            navigate(-1);
                        }
                    });
                } else if (!rdata) {
                    navigate(-1);
                }
            }
        }

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [rdata]);

    function handleRepost() {
        swal({
            title: '라디오 전송',
            text: '해당 라디오 내용을 다른 유저에게도 공유해볼까요?',
            icon: 'info',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios
                    .post(
                        `${process.env.REACT_APP_API_URL}/radio/toss`,
                        {
                            memberIndex: rdata.fromMemberIndex,
                            boardIndex: rdata.boardIndex,
                        },
                        {
                            headers: {
                                token: sessionStorage.getItem('token') ?? '',
                            },
                        }
                    )
                    .then((response) => {
                        console.log(response.data);
                    });
                swal({
                    title: '다른 사람에게 전달했어요!',
                    icon: 'success',
                });
                setRepostActive(true);
            }
        });
    }

    return (
        // <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
        //     <Card
        //         className="Alarm bg-modal-bg text-white-sub px-6 py-6 rounded-component"
        //         style={{ width: '480px' }}
        //     >
        //         <CardHeader className="flex">
        //             <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
        //                 <FaRegBell className="mr-1" />
        //                 알림
        //             </CardTitle>
        //         </CardHeader>
        //         <div></div>
        //         <CardContent>

        //         </CardContent>
        //         </div>
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
            <Card
                className="Alarm bg-modal-bg text-white-sub px-6 py-6 rounded-component hover:w-20"
                style={{ width: '480px' }}
            >
                <CardHeader className="flex ">
                    <CardTitle className="flex justyfy-between items-center font-['Pre-Bold'] text-2xl mb-8 w-full">
                        <div className="flex justify-start items-center flex-grow">
                            <FaRadio className="mr-1" />
                            라디오
                        </div>

                        <div className="flex justify-end items-center">
                            <div
                                className="Radio-Report text-white-sub text-3xl hover:hover"
                                onClick={handleClose}
                            >
                                <RiCloseFill />
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <div></div>
                <CardContent>
                    <div className="text-white">
                        {/*라디오 모달 상단 헤더 */}
                        {rdata ? (
                            <div>
                                <div className="Radio-Header flex justyfy-between items-center w-full">
                                    <div className="Radio-Date flex justify-start items-center flex-grow relative text-2xl mb-2 font-['Pre-bold']">
                                        20{rdata.boardInputDate.split('.')[0]}년{' '}
                                        {rdata.boardInputDate.split('.')[1]}월{' '}
                                        {rdata.boardInputDate.split('.')[2]}일
                                        작성된 별
                                    </div>
                                    <div
                                        className="Radio-Report flex justify-end items-center  text-white-sub text-3xl hover:hover"
                                        onClick={() => {
                                            setIsReportAlertOpen(true);
                                        }}
                                    >
                                        <PiSiren />
                                    </div>
                                </div>

                                <div className="Radio-Content border border-white-sub p-2 h-44 mb-4">
                                    {rdata.boardContent}
                                </div>

                                {/* <button
                                    onClick={() => {
                                        setIsReportAlertOpen(true);
                                    }}
                                >
                                    신고
                                </button> */}
                                {/* <button
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                >
                                    닫기
                                </button> */}

                                <div className="Radio-Player w-full mb-4">
                                    {audioSrc && (
                                        <audio
                                            className="w-full"
                                            src={audioSrc}
                                            controls
                                        />
                                    )}
                                </div>
                                <div>
                                    <button
                                        className="Radio-Toss w-full h-button my-1"
                                        disabled={repostActive}
                                        onClick={() => {
                                            handleRepost();
                                        }}
                                    >
                                        {!repostActive
                                            ? '다른 사람에게 전달하기'
                                            : '전달 완료!'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="Card-ScrollArea-NonResult h-96 flex flex-col col-span-3 justify-center items-center">
                                <FaRegFaceSadTear className="mr-1" />
                                <div className="font-['Pre-Bold']">
                                    수신할 음성이 없어요
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="reportAlert">
                        {isReportAlertOpen && (
                            <Alert
                                type={'report'}
                                boardIndex={rdata.boardIndex}
                                userIndex={rdata.fromMemberIndex}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
export default Modal;
