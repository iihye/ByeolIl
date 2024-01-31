import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

// type: "radio", "star", "report"
function Modal({ type, reportInfo }) {
  return <div style={{ border: "1px solid black", margin: "5px" }}>{type === "radio" ? <RadioContent /> : <StarContent type={type} reportInfo={reportInfo} />}</div>;
}

function StarContent({ type,  reportInfo }) {
  const [data, setData] = useState(null);
  const params = useParams();
  const starIndex = params["star_id"];

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
          data.boardInputDate = data.boardInputDate.split('-');
          data.boardUpdateDate = data.boardUpdateDate.split(' ')[0].split('-');
  
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
  };

  const handleReport = () => {
    /* 신고 내용 입력 alert 출력 */
  };

  const handleModify = () => {
    /* 게시글 수정 화면 띄우기 */
  };

  const handleLike = () => {
    /* 게시글 좋아요 Req */
  };

  const handleRegistReply = () => {
    /* 댓글 작성 Req */
  };

  const handleBlock = () => {
    /* 정말 차단할까요 alert 띄우기 */
  }

  const handleClose = () => {
    /* 이전 페이지로 이동 */
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
      <div>{/* 댓글 리스트 영역 */}</div>
      {type === "star" ? (
        <div>
          {/* 댓글 작성 영역 : 비로그인시 출력 안되게*/}
          <input />
          <button onClick={() => {handleRegistReply();}}>등록</button>
        </div>
      ) : null}
      <div>
        {/* 최하단 */}
        {type === "star" ? (
          <>
            <button onClick={() => {handleLike();}}>LIKE</button>
            <button onClick={() => {handleReport();}}>REPORT</button>
            <button onClick={() => {handleDelete();}}>DELETE</button>
            <button onClick={() => {handleModify();}}>MODIFY</button>
          </>
        ) : (
          <button onClick={() => {handleBlock();}}>차단</button>
        )}
        <button onClick={()=>{handleClose();}}>CLOSE</button>
      </div>
    </div>
  );
}

function RadioContent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   await axios
    //     .get(`${process.env.REACT_APP_API_URL}/radio`)
    //     .then((response) => {
    //       setData(response.data);
    //     })
    //     .catch((err) => {
    //       console.log(err, "에러 발생으로 인해 더미 데이터가 출력됩니다.");
    //       // dummy data : api 요청 제한 걸려서 임시로 넣어둠,, 테스트용
    //       const data = {
    //         radioIndex: 1,
    //         boardIndex: 1,
    //         boardContent: "더미 데이터",
    //         boardInputDate: "2099-99-99",
    //       };
    //       setData(data);
    //     });
    // };
    // fetchData();
  }, []);

  const handleReport = () => {
    /* 신고 내용 입력 alert 출력 */
  }
  const handleClose = () => {
    /* 이전 페이지로 이동 */
  }
  const handlePlay = () => {
    /* 음성 파일 실행 */
  }
  const handleResend = () => {
    /* 라디오 송신 Req */
  }

  return (
    <div>
      <div>
        {/*라디오 모달 상단 헤더 */}
        <div>{data ? `${data.boardInputDate.split("-")[0]}년 ${data.boardInputDate.split("-")[1]}월 ${data.boardInputDate.split("-")[2]}일의 기록...` : "로딩중"}</div>
        <button onClick={() => {handleReport()}}>REPORT</button>
        <button onClick={() => {handleClose()}}>CLOSE</button>
      </div>
      <div>
        {/*라디오 내용 */}
        <div>{data ? data.boardContent : "로딩중"}</div>
      </div>
      <div>
        <button onClick={() => {handlePlay()}}>PLAY</button>
        <button onClick={() => {handleResend()}}>재송신하기</button>
      </div>
    </div>
  );
}

export default Modal;