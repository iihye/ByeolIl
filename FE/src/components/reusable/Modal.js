import axios from "axios";
import StarDeleteAlert from "components/star/StarDeleteAlert";
import StarReplyList from "components/star/StarReplyList";
import StarReportAlert from "components/star/StarReportAlert";
import Alert from "./Alert";
import { isStarDetailOpenState, isStarRegistOpenState, renewStarDetailState } from "components/atom";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isDeleteAlertOpenState, isReportAlertOpenState, isStarModifyOpenState, renewReplyState } from "components/atom";
import { GoRocket } from "react-icons/go";
import { useNavigate } from "react-router";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { PiSiren } from "react-icons/pi";
import { FaRegTrashCan } from "react-icons/fa6";
import { TiSpannerOutline } from "react-icons/ti";
import { CgCloseR } from "react-icons/cg";
import { IoMdSend } from "react-icons/io";

// type: "radio", "star", "report"
function Modal(props) {
  const type = props.type;

  return (
    <div className="modal-container absolute top-0 left-0 flex justify-center items-center w-full h-full">
      <div className="modal bg-modal-bg rounded-lg p-3 w-96 font-['Pre-bold']">{type === "radio" ? <RadioContent /> : <StarContent {...props} />}</div>
    </div>
  );
}

function StarContent(props) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useRecoilState(isDeleteAlertOpenState);
  const [isReportAlertOpen, setIsReportAlertOpen] = useRecoilState(isReportAlertOpenState);
  const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
  const setIsStarModifyOpen = useSetRecoilState(isStarModifyOpenState);
  const renewStarDetail = useRecoilValue(renewStarDetailState);

  const [data, setData] = useState(null);
  const [likeData, setLikeData] = useState([]);
  const [isLike, setIsLike] = useState(false);

  const replyInputRef = useRef();

  // properties
  const loginUserIndex = Number(localStorage.getItem("memberIndex"));
  const type = props.type;
  const reportInfo = props.reportInfo;
  const starIndex = props.starIndex;
  const writerIndex = props.userIndex;
  const location = props.location;

  // 글 조회 / 수정시 내용 갱신
  useEffect(() => {
    const fetchData = async (starIndex) => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/board/${starIndex}/${loginUserIndex}`, {
          headers: {
            token: localStorage.getItem("token") ?? "",
          },
        })
        .then((response) => {
          const data = response.data;
          data.boardInputDate = data.boardInputDate.split(".");
          data.boardUpdateDate = data.boardUpdateDate.split(" ")[0].split(".");

          const likeState = response.data.boardLike;
          if (likeState) {
            setIsLike(true);
          } else {
            setIsLike(false);
          }
          setData(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData(starIndex);
  }, [renewStarDetail]);

  useEffect(() => {
    function handleClick(e) {
      e.stopPropagation();
      const check = [...e.target.classList].some((it) => it === "modal-container");
      if (check) {
        handleClose();
      }
    }

    function handleKeydown(e) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeydown);
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
  };

  const handleLike = async () => {
    /* 게시글 좋아요 Req */
    const data = {
      boardIndex: starIndex,
      memberIndex: loginUserIndex,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/board/like`, data, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (response.request.status === 200) {
        setIsLike(true);
      } else {
        console.log("좋아요 실패");
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
          token: localStorage.getItem("token"),
        },
        data: data,
      })
      .then((response) => {
        if (response.data.map.response === "success") {
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
    // setReportModal('');
  };

  /* 게시글 작성자 체크*/
  const isWriter = () => {
    return writerIndex === loginUserIndex;
  };

  /* 로그인 체크 */
  const isLogin = () => {
    return localStorage.getItem("token") ? true : false;
  };

  return (
    <>
      <div className="star-content">
        {/* 최상단 */}
        <div className="star-content-top text-white-sub">
          {/* 지정일 */}
          <div className="text-2xl mb-2 font-['Pre-bold'] flex justify-between">
            {data ? (
              <div>
                20{data.boardInputDate[0]}년 {data.boardInputDate[1]}월 {data.boardInputDate[2]}일<span className="text-lg">의 기록</span>
              </div>
            ) : (
              "로딩중"
            )}
            <CloseButton handleClose={handleClose} />
          </div>
          {/* 작성일(수정일) */}
          {/* <div>{data ? `${data.boardUpdateDate[0]}년 ${data.boardUpdateDate[1]}월 ${data.boardUpdateDate[2]}일` : "로딩중"}</div> */}
        </div>
        <div className="star-content-content relative border border-white-sub rounded-lg text-white-sub p-2 h-44 bg-alert-bg">
          <MediaArea data={data} />
          {/* 게시글 내용 */}
          {data ? data.boardContent : "로딩중"}
          <div className="absolute right-0 bottom-0 mr-2 mb-2 text-2xl duration-200 hover:text-4xl hover:text-whiteh hover:cursor-pointer">
            <GoRocket />
          </div>
        </div>
        <div>
          {/* 해시태그 */}
          <div style={{ display: "flex" }}>{data ? data.hashContent.map((i, idx) => <div key={idx}>{i}</div>) : "로딩중"}</div>
        </div>
        {type === "report" ? <div>{reportInfo && reportInfo.reportContent}</div> : null}
        <div>
          {/* 댓글 리스트 영역 */}
          <StarReplyList boardIndex={starIndex} />
        </div>
      </div>
      <div>
        {/* 최하단 */}
        {type === "star" ? (
          <>
            {/* 댓글 작성 영역 */}
            {isLogin() && <ReplyRegistArea starIndex={starIndex} loginUserIndex={loginUserIndex} />}
          </>
        ) : null}
        <div className="flex justify-between items-center text-2xl">
          <div className="flex gap-1 items-center">
            {type === "star" ? (
              <>
                <LikeButtons isLike={isLike} handleLike={handleLike} handleDislike={handleDislike} />
                <ReportButton handleReport={handleReport} />
                {isWriter() && (
                  <>
                    <DeleteButton handleDelete={handleDelete} />
                    <ModifyButton handleModify={handleModify} />
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="alert">
        {isDeleteAlertOpen && <StarDeleteAlert boardIndex={starIndex} userIndex={loginUserIndex} />}
        {isReportAlertOpen && <StarReportAlert boardIndex={starIndex} userIndex={loginUserIndex} />}
      </div>
    </>
  );
}

function CloseButton(props) {
  const handleClose = props.handleClose;
  return (
    <div className="text-white-sub hover:cursor-pointer text-3xl" onClick={handleClose}>
      <CgCloseR />
    </div>
  );
}
function ModifyButton(props) {
  const handleModify = props.handleModify;
  return (
    <div className="text-white-sub hover:cursor-pointer text-3xl" onClick={handleModify}>
      <TiSpannerOutline />
    </div>
  );
}

function DeleteButton(props) {
  const handleDelete = props.handleDelete;

  return (
    <div className="text-white-sub hover:cursor-pointer" onClick={handleDelete}>
      <FaRegTrashCan />
    </div>
  );
}
function ReportButton(props) {
  const handleReport = props.handleReport;

  return (
    <div className="text-white-sub text-3xl hover:cursor-pointer" onClick={handleReport}>
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
        <div className="hover:cursor-pointer text-white-sub " onClick={handleLike}>
          <FaRegHeart />
        </div>
      ) : (
        <div className="hover:cursor-pointer text-white-sub " onClick={handleDislike}>
          <FaHeart />
        </div>
      )}
    </>
  );
}

function MediaArea(props) {
  return <div style={{ display: "flex" }}>{props.data && props.data.boardMedia.map((it, index) => <img src={it} style={{ width: "50px" }}></img>)}</div>;
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

    if (data.commentContent === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    await axios
      .post(`${process.env.REACT_APP_API_URL}/comment`, data, {
        header: {
          token: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.map.response === "success") {
          inputRef.current.value = "";
          setRenewReply(!renewReply);
        } else {
          console.log("댓글 등록 실패");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRegistReply();
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <input className="border my-2 p-1 px-2 mr-2 w-full" placeholder="댓글 내용을 입력해주세요." ref={inputRef} onKeyDown={handleKeyDown} />
      <div className="text-white-sub text-xl w-8 p-2 text-start rounded hover:text-modal-bg hover:bg-white-sub hover:text-white hover:cursor-pointer" onClick={handleRegistReply}>
        <IoMdSend />
      </div>
    </div>
  );
}

function RadioContent() {
  const [rdata, setRdata] = useState();
  const [isReportAlertOpen, setIsReportAlertOpen] = useRecoilState(isReportAlertOpenState);

  const [repostActive, setRepostActive] = useState(false);
  const navigate = useNavigate();
  const fetchData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/radio/${localStorage.getItem("memberIndex")}`, {
        headers: {
          token: localStorage.getItem("token") ?? "",
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
  useEffect(() => {
    // 최초1회 데이터를 수신한다.
    fetchData();

    // TTS 음성수신 미해결
    // axios.get(`${process.env.REACT_APP_API_URL}/tts-server/api/infer-glowtts?text=테스트123`);
  }, [rdata]);
  function handlePlay() {
    // 음성파일 재생시켜야됨. => 오디오 플레이어 요소도 추가 필요
  }
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
            token: localStorage.getItem("token") ?? "",
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
