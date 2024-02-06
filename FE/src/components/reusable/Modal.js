import axios from "axios";
import StarDeleteAlert from "components/star/StarDeleteAlert";
import StarReplyList from "components/star/StarReplyList";
import StarReportAlert from "components/star/StarReportAlert";
import { isStarDetailOpenState, isStarRegistOpenState, renewStarDetailState } from "components/atom";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isDeleteAlertOpenState, isReportAlertOpenState, isStarModifyOpenState, renewReplyState } from "components/atom";
import { GoRocket } from "react-icons/go";

// type: "radio", "star", "report"
function Modal(props) {
  const type = props.type;

  return (
    <div className="modal-container absolute top-0 left-0 flex justify-center items-center w-full h-full">
      <div className="modal bg-modal-bg">{type === "radio" ? <RadioContent /> : <StarContent {...props} />}</div>
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

  // 좋아요 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/board/like/${loginUserIndex}`)
        .then((response) => {
          const res = response.data.some((it) => it.boardIndex === starIndex);
          // setLikeData(response.data);
          setIsLike(res);
        })
        .catch((error) => console.log(error));
    };
    fetchData();

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
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
        console.log("좋아요 성공");
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

  function handleClick(e) {
    e.stopPropagation();
    const check = [...e.target.classList].some((it) => it === "modal-container");
    if (check) {
      handleClose();
    }
  }

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
          <div className="text-xl">{data ? `${data.boardInputDate[0]}년 ${data.boardInputDate[1]}월 ${data.boardInputDate[2]}일` : "로딩중"}</div>
          {/* 작성일(수정일) */}
          <div>{data ? `${data.boardUpdateDate[0]}년 ${data.boardUpdateDate[1]}월 ${data.boardUpdateDate[2]}일` : "로딩중"}</div>
        </div>
        <div className="star-content-content relative bg-white-sub h-32">
          <MediaArea data={data} />
          {/* 게시글 내용 */}
          <div>
            {data ? data.boardContent : "로딩중"}
            <div className="absolute right-0 bottom-0 mr-2 mb-2 text-2xl">
              <GoRocket />
            </div>
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
          <div>
            {/* 댓글 작성 영역 */}
            {isLogin() && <ReplyRegistArea starIndex={starIndex} loginUserIndex={loginUserIndex} />}
          </div>
        ) : null}
        <div>
          {/* 최하단 */}
          {type === "star" ? (
            <>
              {!isLike ? <button onClick={handleLike}>LIKE</button> : <button onClick={handleDislike}>DISLIKE</button>}

              <button onClick={handleReport}>REPORT</button>
              {isWriter() && (
                <>
                  <button onClick={handleDelete}>DELETE</button>
                  <button onClick={handleModify}>MODIFY</button>
                </>
              )}
            </>
          ) : (
            <button onClick={handleBlock}>차단</button>
          )}
          <button onClick={handleClose}>CLOSE</button>
        </div>
      </div>
      <div className="alert">
        {isDeleteAlertOpen && <StarDeleteAlert boardIndex={starIndex} userIndex={loginUserIndex} />}
        {isReportAlertOpen && <StarReportAlert boardIndex={starIndex} userIndex={loginUserIndex} />}
      </div>
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
    <>
      <input ref={inputRef} onKeyDown={handleKeyDown} />
      <button onClick={handleRegistReply}>등록</button>
    </>
  );
}

function RadioContent() {
  const [data, setData] = useState(null);

  // useEffect(() => {

  // }, []);

  return (
    <div>
      <div>
        {/*라디오 모달 상단 헤더 */}
        <div>n년 n월 n일</div>
        <button>REPORT</button>
        <button>CLOSE</button>
      </div>
      <div>
        {/*라디오 내용 */}
        <div>{data ? data.boardContent : "로딩중"}</div>
      </div>
      <div>
        <button>PLAY</button>
        <button>재송신하기</button>
      </div>
    </div>
  );
}

export default Modal;
