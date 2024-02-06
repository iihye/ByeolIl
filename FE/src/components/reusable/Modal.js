import axios from "axios";
import StarDeleteAlert from "components/star/StarDeleteAlert";
import StarReplyList from "components/star/StarReplyList";
import StarReportAlert from "components/star/StarReportAlert";
import Alert from "./Alert";
import { isStarDetailOpenState } from 'components/atom';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { isDeleteAlertOpenState, isReportAlertOpenState } from "components/atom";

// type: "radio", "star", "report"
function Modal(props) {
  return <div style={{ border: "1px solid black", margin: "5px" }}>{props.type === "radio" ? <RadioContent /> 
  : <StarContent type={props.type} reportInfo={props.reportInfo} starIndex={props.starIndex} userIndex={props.userIndex}/>}</div>;
}

function StarContent({ type,  reportInfo, starIndex, userIndex }) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useRecoilState(isDeleteAlertOpenState);
  const [isReportAlertOpen, setIsReportAlertOpen] = useRecoilState(isReportAlertOpenState);
  const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
  
  const [data, setData] = useState(null);
  const [likeData, setLikeData] = useState([]); 

  const memberIndex = Number(localStorage.getItem('memberIndex'));

  const replyInputRef = useRef();
  
  useEffect(() => {
    const fetchData = async (starIndex) => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/board/${starIndex}`,
        {
          headers: {
            token: localStorage.getItem('token') ?? "",
          },
        })
        .then((response) => {
          const data = response.data;
          data.boardInputDate = data.boardInputDate.split('.');
          data.boardUpdateDate = data.boardUpdateDate.split(' ')[0].split('.');
          
          setData(response.data);
        })
        .catch((err) => {
          console.log(err, "에러 발생으로 임시 데이터로 테스트");
        
          const data = {
            boardRegTime: "2888-88-88 88:88:88.88888",
            boardUpdateDate: "2042-52-34 16:26",
            boardInputDate: "2099-99-99",
            boardContent: "더미내용",
            boardMedia: ["이미지 링크1", "이미지 링크2"],
            boardAccess: "OPEN",
            boardLike: 3,
            hashContent: ["해시태그1 ", "해시태그2 ", "해시태그3 "],
          };

          data.boardInputDate = data.boardInputDate.split('-');
          data.boardUpdateDate = data.boardUpdateDate.split(' ')[0].split('-');
          setData(data);
        });

    };
    fetchData(starIndex);
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
    /* 게시글 수정 화면 띄우기 */
  };

  const handleLike = async () => {
    /* 게시글 좋아요 Req */
    const data = {
      boardIndex: starIndex,
      memberIndex:localStorage.getItem('memberIndex'),
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/board/like`,data,
      {
        headers: {
          token: localStorage.getItem('token'),
        },
      })

      if(response.request.status === 200){
        console.log("좋아요 성공")
      } else {
        console.log("좋아요 실패")
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleRegistReply = async () => {
    /* 댓글 작성 Req */
    const data = {
      boardIndex: starIndex,
      memberIndex: memberIndex,
      commentContent: replyInputRef.current.value.trim(),
    }

    if (data.commentContent === ""){
      alert("내용을 입력해주세요.");
      return;
    }

    await axios.post(`${process.env.REACT_APP_API_URL}/comment/`,data,
    {
      header: {
        token: localStorage.getItem('token'),
      },
    })
    .then((response) => {
      
      if(response.data.map.response === 'success'){
        console.log("댓글 등록 성공");
      } else {
        console.log("댓글 등록 실패");
      }

    })
    .catch((error) => console.log(error));
  };

  const handleBlock = () => {
    /* 정말 차단할까요 alert 띄우기 */
  }

  const handleClose = () => {
    /* 모달 닫기 */
    setIsDeleteAlertOpen(false);
    setIsReportAlertOpen(false);
    setIsStarDetailOpen([])
  }

  /* 게시글 작성자 체크*/
  const isWriter = () => {
      return userIndex === localStorage.getItem('memberIndex');
  }

  /* 로그인 체크 */
  const isLogin = () => {
    return localStorage.getItem('token') ? true : false;
  }

  return (
    <div className="modal">
      {/* 최상단 */}
      <div style={{ display: "flex" }}>
        {/* 지정일 */}
        <div>{data ? `${data.boardInputDate[0]}년 ${data.boardInputDate[1]}월 ${data.boardInputDate[2]}일` : "로딩중"}</div>
        {/* 작성일(수정일) */}
        <div>{data ? `${data.boardUpdateDate[0]}년 ${data.boardUpdateDate[1]}월 ${data.boardUpdateDate[2]}일` : "로딩중"}</div>
      </div>
      <div>
        {/* 이미지 영역 */}
        <div style={{ display: "flex" }}>{data && data.boardMedia.map((i, index) => <div key={index}>이미지 {index}</div>)}</div>
        {/* 게시글 내용 */}
        <div>{data ? data.boardContent : "로딩중"}</div>
      </div>
      <div>
        {/* 해시태그 */}
        <div style={{ display: "flex" }}>
          {data ? data.hashContent.map((i, idx) => <div key={idx}>{i}</div>) : "로딩중"}
        </div>
      </div>
      {type === "report" ? <div>{reportInfo && reportInfo.reportContent}</div> : null}
      <div>{/* 댓글 리스트 영역 */}
        <StarReplyList boardIndex={starIndex}/>
      </div>
      {type === "star" ? (
        <div>
          {/* 댓글 작성 영역 */}
          {
            isLogin() && 
            <>
              <input ref={replyInputRef}/>
              <button onClick={handleRegistReply}>등록</button>
            </>
          }
        </div>
      ) : null}
      <div>
        {/* 최하단 */}
        {type === "star" ? (
          <>
            <button onClick={handleLike}>LIKE</button>
            <button onClick={handleReport}>REPORT</button>
            {
              isWriter() &&
              <>
                <button onClick={handleDelete}>DELETE</button>
                <button onClick={handleModify}>MODIFY</button>
              </>
            }
          </>
        ) : (
          <button onClick={handleBlock}>차단</button>
        )}
        <button onClick={handleClose}>CLOSE</button>
      </div>
      <div className="alert">
          {
            isDeleteAlertOpen && <StarDeleteAlert boardIndex={starIndex} userIndex={memberIndex}/>
          }
          {
            isReportAlertOpen && <StarReportAlert boardIndex={starIndex} userIndex={memberIndex}/>
          }
      </div>
    </div>
  );
}

function RadioContent() {
    const [rdata, setRdata] = useState({  // 테스트용 임시값
      "boardIndex": 3,
      "boardContent": "테스트용 글입니다.",
      "boardInputDate": "24.01.23",
      "fromMemberIndex" : 1
    });
    const [isReportAlertOpen, setIsReportAlertOpen] = useRecoilState(isReportAlertOpenState);

    const [repostActive, setRepostActive] = useState(false);
    const navigate = useNavigate();
    const fetchData = async () => {
      await axios.get(`${process.env.REACT_APP_API_URL}/radio/${localStorage.getItem('memberIndex')}`, {
        headers: {
          token: localStorage.getItem('token') ?? "",
        },
      })
        .then((response) => {
          console.log(response.data);
          setRdata(response.data);
        }).catch((e) => { console.log(e) })
    }
    useEffect(() => {
      // 최초1회 데이터를 수신한다. 
      fetchData();
      // TTS 음성수신 미해결
      axios.get(`${process.env.REACT_APP_API_URL}/tts-server/api/infer-glowtts?text=테스트123`);
    }, [rdata]);
    function handlePlay() {
            // 음성파일 재생시켜야됨. => 오디오 플레이어 요소도 추가 필요 
    }
    function handleRepost() {
      axios.post(`${process.env.REACT_APP_API_URL}/radio/toss`,{
        "memberIndex": rdata.fromMemberIndex,
        "boardIndex": rdata.boardIndex,
      },{
        headers: {
          token: localStorage.getItem('token') ?? "",
        },
      }).then((response)=>{console.log(response.data)});
      alert("재송신 성공!");
      setRepostActive(true);
    }


    return (
          <div>
            <div>
                {/*라디오 모달 상단 헤더 */}
                {rdata ? <div>20{rdata.boardInputDate.split('.')[0]}년 {rdata.boardInputDate.split('.')[1]}월 {rdata.boardInputDate.split('.')[2]}일</div> : '로딩중'}
                <button onClick={() => {setIsReportAlertOpen(true)}}>REPORT</button>
                <button onClick={()=>{navigate(-1);}}>CLOSE</button>
            </div>
            <div>
                {/*라디오 내용 */}
                <div>{rdata ? rdata.boardContent : '로딩중'}</div>
            </div>
            <div>
                <button onClick={() => {handlePlay()}}>PLAY</button>
                <button disabled={repostActive} onClick={() => {handleRepost()}}>재송신하기</button>
            </div>
            <div className="reportAlert">
              {
                isReportAlertOpen && <Alert type={"report"} boardIndex={rdata.boardIndex} userIndex={rdata.fromMemberIndex}/>
              }
            </div>
        </div>
    );
}

/**
 * 별 신고하기 기능
 * @param {Object} data
 * @returns
 */
const reqStarReport = async (data) => {
    const URL = 'https://2eab5da4-08fb-4850-abed-0fd7f6b2bc4e.mock.pstmn.io';

    try {
        return await axios.post(`${URL}/board/report`, data, {
            header: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.log('asfddsafsaf');
        return {
            radioIndex: 1,
            boardIndex: 1,
            boardContent: '샘플 내용',
        };
    }
};

export default Modal;
