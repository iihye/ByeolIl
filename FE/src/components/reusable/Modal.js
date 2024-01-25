import axios from "axios";
import { useEffect, useState } from "react";

// type: "radio", "star", "report"
function Modal({ type, starIndex, reportInfo }) {
  return <div style={{ border: "1px solid black", margin: "5px" }}>{type === "radio" ? <RadioContent /> : <StarContent type={type} starIndex={starIndex} reportInfo={reportInfo} />}</div>;
}

function StarContent({ type, starIndex, reportInfo }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async (starIndex) => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/board/${starIndex}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((err) => {
          console.log(err, "에러 발생으로 인해 더미 데이터가 출력됩니다.");
          // dummy data : api 요청 제한 걸려서 임시로 넣어둠,, 테스트용
          const data = {
            boardRegTime: "2888-88-88 88:88:88.88888",
            boardInputDate: "2099-99-99",
            boardContent: "더미내용",
            boardMedia: ["이미지 링크1", "이미지 링크2"],
            boardAccess: "OPEN",
            boardLike: 3,
            hashContent: ["해시태그1 ", "해시태그2 ", "해시태그3 "],
          };
          setData(data);
        });
    };

    fetchData();
  }, []);

  const deleteStar = async () => {
    await axios
      .put(`${process.env.REACT_APP_API_URL}}/board`) // 참고해서 다시 작성
      .then((response) => console.log(response.data))
      .catch((e) => console.log(e));
  };

  return (
    <div className="modal">
      {/* 최상단 */}
      <div style={{ display: "flex" }}>
        {/* 지정일 */}
        <div>{data ? `${data.boardInputDate.split("-")[0]}년 ${data.boardInputDate.split("-")[1]}월 ${data.boardInputDate.split("-")[2]}일` : "로딩중"}</div>
        {/* 작성일(수정일) */}
        <div>{data ? `${data.boardRegTime.split(" ")[0].split("-")[0]}년 ${data.boardRegTime.split(" ")[0].split("-")[1]}월 ${data.boardRegTime.split(" ")[0].split("-")[2]}일` : "로딩중"}</div>
      </div>
      <div>
        {/* 이미지 영역 */}
        <div style={{ display: "flex" }}>{data && data.boardMedia.map((i, index) => <div>이미지 {index}</div>)}</div>
        {/* 게시글 내용 */}
        <div>{data ? data.boardContent : "로딩중"}</div>
      </div>
      <div>
        {/* 해시태그 */}
        <div style={{ display: "flex" }}>
          {data
            ? data.hashContent.map((i, idx) => {
                return <div key={idx}>{i}</div>;
              })
            : "로딩중"}
        </div>
      </div>
      {type === "report" ? <div>{reportInfo && reportInfo.reportContent}</div> : null}
      <div>{/* 댓글 영역 */}</div>
      {type === "star" ? (
        <div>
          {/* 댓글 작성 영역 */}
          <input />
          <button>등록</button>
        </div>
      ) : null}
      <div>
        {/* 최하단 */}
        {type === "star" ? (
          <>
            <button>LIKE</button>
            <button>REPORT</button>
            <button
              onClick={() => {
                deleteStar();
              }}
            >
              DELETE
            </button>
            <button>MODIFY</button>
          </>
        ) : (
          <button>차단</button>
        )}
        <button>CLOSE</button>
      </div>
    </div>
  );
}

function RadioContent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // 추후 env URL로 대체
      const URL = "https://2eab5da4-08fb-4850-abed-0fd7f6b2bc4e.mock.pstmn.io";

      await axios
        .get(`${URL}/radio`)
        .then((response) => {
          setData(response.data);
        })
        .catch((err) => {
          console.log(err, "에러 발생으로 인해 더미 데이터가 출력됩니다.");
          // dummy data : api 요청 제한 걸려서 임시로 넣어둠,, 테스트용
          const data = {
            radioIndex: 1,
            boardIndex: 1,
            boardContent: "더미 데이터",
            boardInputDate: "2099-99-99",
          };
          setData(data);
        });
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        {/*라디오 모달 상단 헤더 */}
        <div>{data ? `${data.boardInputDate.split("-")[0]}년 ${data.boardInputDate.split("-")[1]}월 ${data.boardInputDate.split("-")[2]}일의 기록...` : "로딩중"}</div>
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

const reqStarReport = async (data) => {
  const URL = "https://2eab5da4-08fb-4850-abed-0fd7f6b2bc4e.mock.pstmn.io";

  try {
    return await axios.post(`${URL}/board/report`, data, { header: { "Content-Type": "application/json" } });
  } catch (err) {
    console.log("asfddsafsaf");
    return {
      radioIndex: 1,
      boardIndex: 1,
      boardContent: "샘플 내용",
    };
  }
};

export default Modal;
