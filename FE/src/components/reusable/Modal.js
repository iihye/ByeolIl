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
import { GoRocket } from "react-icons/go";

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
        console.log('Fetch');
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
                    setData(response.data);
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        setIsDetailAlarmOpen(false);
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
            // setReportModal('');
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

    const handleBlock = () => {
        /* 정말 차단할까요 alert 띄우기 */
    };

    const handleClose = () => {
        /* 모달 닫기 */
        setIsDeleteAlertOpen(false);
        setIsReportAlertOpen(false);
        setIsStarModifyOpen(false);
        setIsStarDetailOpen(false);
        // setReportModal('');
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
            .then((response) => console.log(response))
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
                                <button onClick={handleBlock}>차단</button>
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
    let curPage = 0;

    function handleLeft() {
        if (curPage <= 0) return;
        curPage--;
        areaRef.current.style.transform = `translateX(${-curPage * 32}rem)`;
    }

    function handleRight() {
        if (curPage >= lastPage) return;
        curPage++;
        areaRef.current.style.transform = `translateX(${-curPage * 32}rem)`;
    }

    return (
        <div className="flex items-center top-12 rounded right-full p-5 mr-6 h-full bg-modal-bg">
            <div className="flex relative overflow-hidden items-center w-pic">
                <div
                    className="flex items-center h-pic transition-all"
                    ref={areaRef}
                >
                    {data &&
                        data.boardMedia.map((it, index) => (
                            <div
                                className="w-pic h-pic bg-black-sub flex items-center"
                                key={index}
                            >
                                <img
                                    className="w-pic max-h-pic"
                                    src={it}
                                    key={index}
                                    alt="it"
                                ></img>
                            </div>
                        ))}
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
                    console.log('댓글 등록 실패');
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
                    className="text-white-sub text-xl w-8 p-2 text-start rounded hover:text-modal-bg hover:bg-white-sub hover:text-modal-bg duration-200 hover:cursor-pointer"
                    onClick={handleRegistReply}
                >
                    <IoMdSend />
                </div>
            </div>
        </>
    );
}

function RadioContent() {
  const [rdata, setRdata] = useState();
  const [isReportAlertOpen, setIsReportAlertOpen] = useRecoilState(isReportAlertOpenState);
  const [repostActive, setRepostActive] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const navigate = useNavigate();
  const fetchData = async () => {
      await axios
          .get(`${process.env.REACT_APP_API_URL}/radio/${sessionStorage.getItem("memberIndex")}`, {
              headers: {
                  token: sessionStorage.getItem("token") ?? "",
              },
          })
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

      try {
          const res = await fetch(`${process.env.REACT_APP_TTS_URL}/api/infer-glowtts?text=${rdata.boardContent}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });
          const radioBlob = await res.blob();
          setAudioSrc(URL.createObjectURL(radioBlob));
      } catch (error) {
          console.log(error);
      }
  };

  useEffect(() => {
      // 최초1회 데이터를 수신한다.
      fetchData();
  }, []);

  useEffect(() => {
      // TTS 음성파일 추출 및 다운.
      fetchDataWav();
  }, [rdata]); // rdata에 의존성

  function handleRepost() {
      axios
          .post(
              `${process.env.REACT_APP_API_URL}/radio/toss`,
              {
                  memberIndex: rdata.fromMemberIndex,
                  boardIndex: rdata.boardIndex,
              },
              {
                  headers: {
                      token: sessionStorage.getItem("token") ?? "",
                  },
              }
          )
          .then((response) => {
              console.log(response.data);
          });
      alert("재송신 성공!");
      setRepostActive(true);
  }

  return (
    <div>
      <div>
        {/*라디오 모달 상단 헤더 */}
        {rdata ? (
          <div>
            20{rdata.boardInputDate.split(".")[0]}년 {rdata.boardInputDate.split(".")[1]}월 {rdata.boardInputDate.split(".")[2]}일
          </div>
        ) : (
          "로딩중"
        )}
        <button
          onClick={() => {
            setIsReportAlertOpen(true);
          }}
        >
          REPORT
        </button>
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          CLOSE
        </button>
      </div>
      <div>
        {/*라디오 내용 */}
        <div>{rdata ? rdata.boardContent : "로딩중"}</div>
      </div>
      <div>
        <button
          onClick={() => {
            handlePlay();
          }}
        >
          PLAY
        </button>
        <button
          disabled={repostActive}
          onClick={() => {
            handleRepost();
          }}
        >
          재송신하기
        </button>
      </div>
      <div className="reportAlert">{isReportAlertOpen && <Alert type={"report"} boardIndex={rdata.boardIndex} userIndex={rdata.fromMemberIndex} />}</div>
    </div>
  );
}

export default Modal;
