import axios from "axios";
import { useEffect, useState } from "react";

/**
 *
 * @param {Number} radioIndex
 * @param {Number} starIndex
 * @returns
 */
function Modal({ starIndex }) {
  return <div>{starIndex ? <StarContent starIndex={starIndex} /> : <RadioContent />}</div>;
}

function StarContent({ starIndex }) {
  const [data, setData] = useState(null);

  /**
   * 별 상세정보 요청
   * @param {Number} starIndex
   * @returns
   */
  const reqStarInfo = async (starIndex) => {
    const URL = "https://2eab5da4-08fb-4850-abed-0fd7f6b2bc4e.mock.pstmn.io";

    try {
      return await axios.get(`${URL}/board/${starIndex}`);
    } catch (err) {
      console.log(err, "에러 발생으로 인해 더미 데이터가 출력됩니다.");
      // dummy data : api 요청 제한 걸려서 임시로 넣어둠,, 테스트용
      return {
        data: {
          boardInputDate: "2099-99-99",
          boardContent: "더미내용 로딩중",
          boardPicture: "더미 로딩중",
          boardAccess: "OPEN",
          boardLike: 3,
          hashContent: ["더미1 로딩중", "더미2 로딩중", "더미3 로딩중"],
        },
      };
    }
  };

  useEffect(() => {
    reqStarInfo(starIndex).then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="modal">
      <div>
        {/* 최상단 */}
        <div>{data && data.boardInputDate}</div>
        {/* <div>{data && data.boardRegDate}</div> */}
      </div>
      <div>
        {/* 게시글 내용 */}
        <div>{data && data.boardContent}</div>
      </div>
      <div>
        {/* 해시태그 */}
        <div>
          {data &&
            data.hashContent.map((i, idx) => {
              return <div key={idx}>{i}</div>;
            })}
        </div>
      </div>
      <div>{/* 댓글 영역 */}</div>
      <div>
        {/* 댓글 작성 영역 */}
        <input />
        <button>등록</button>
      </div>
      <div>
        {/* 최하단 */}
        <button>LIKE</button>
        <button>REPORT</button>
        <button>DELETE</button>
        <button>MODIFY</button>
        <button>CLOSE</button>
      </div>
    </div>
  );
}

function RadioContent() {
  const [data, setData] = useState(null);

  /**
   * 라디오 수신 정보 요청
   * @returns
   */
  const reqRadioInfo = async () => {
    const URL = "https://2eab5da4-08fb-4850-abed-0fd7f6b2bc4e.mock.pstmn.io";

    try {
      return await axios.get(`${URL}/radio`);
    } catch (err) {
      console.log(err, "에러 발생으로 인해 더미 데이터가 출력됩니다.");
      // dummy data : api 요청 제한 걸려서 임시로 넣어둠,, 테스트용
      return {
        data: {
          radioIndex: 1,
          boardIndex: 1,
          boardContent: "더미 데이터 로딩중",
        },
      };
    }
  };

  useEffect(() => {
    reqRadioInfo().then((res) => {
      setData(res.data);
    });
  }, []);

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

/**
 * 별 신고하기 기능
 * @param {Object} data
 * @returns
 */
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
