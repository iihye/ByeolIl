import { useEffect, useRef, useState } from "react";
import axios from "axios";

/*
1. 모달 컴포넌트 html 작성
2. 신고 내용, 비밀번호 입력 내용 공백 검사
*/

// type: 'report', 'PWCheck', 'delete', 'block'
function Alert({ type, boardIndex }) {
  const alertTypes = {
    block: <Block />,
    delete: <Delete boardIndex={boardIndex} />,
    PWCheck: <InputAlert type={type} />,
    report: <InputAlert type={type} />,
  };

  return (
    <div className="alert" style={{ border: "1px solid black" }}>
      {alertTypes[type]}
    </div>
  );
}

function InputAlert({ type }) {
  const input = useRef(null);

  const toEnter = {
    PWCheck: "비밀번호를",
    report: "신고 내용을",
  };
  const buttonValue = {
    PWCheck: "입력",
    report: "신고",
  };

  const URL = ""; // axios 요청 URL
  const reqReport = (inputData) => {
    const data = {
      boardIndex: "", // 게시글 번호
      userindex: "", // 유저 번호
      reportContent: inputData,
    };

    axios
      .post(`${URL}/board/report`, {}, { params: data })
      .then((res) => {
        /* 1. 신고 완료 모달 띄우기 */
        /* 2. 신고 완료 모달 닫기 */
        /* 3. 신고 내용 입력 모달 닫기 */
      })
      .catch((err) => console.log(err));
  };

  // 빈 내용 체크
  const emptyCheck = (input) => {
    return input.trim();
  };

  // 비밀번호 입력 / 신고 요청
  const handleSubmit = () => {
    const inputData = input.current.value;

    if (!emptyCheck(inputData)) {
      alert(`${toEnter[type]} 입력해주세요!`);
      return;
    }

    if (buttonValue[type] === "신고") {
      reqReport(inputData);
    } else if (buttonValue[type] === "입력") {
      /* 1. 비밀번호 일치하는지 체크 */
      /* 2. - 일치할 경우) 해당 모달 내리고 개인정보 수정 모달 띄우기 */
      /* 3. - 일치하지 않을 경우) '비밀번호가 일치하지 않습니다.' 띄우기 */
    }
  };

  useEffect(() => {
    // Enter 키 입력으로 input 내용 처리하기
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    };
    input.current.addEventListener("keydown", handleEnter);

    return () => {
      input.current.removeEventListener("keydown", handleEnter);
    };
  }, []);

  return (
    <>
      <div>{toEnter[type]} 입력해주세요.</div>
      <div>
        <input ref={input} />
      </div>
      <div>
        <button onClick={handleSubmit}>{buttonValue[type]}</button>
        <button
          onClick={() => {
            /* 모달 닫기 */
          }}
        >
          취소
        </button>
      </div>
    </>
  );
}

function Delete({ boardIndex }) {
  const reqStarDelete = () => {
    const data = {
      boardIndex: boardIndex,
      userIndex: "",
    };

    const URL = "";

    /* 게시글 삭제  요청 보내기 */
    /* - 게시글 정상 삭제시) 해당 alert 닫기 -> 게시글 modal 닫기*/
    /* - 게시글 삭제 실패시) 오류 모달 띄우기? */
  };

  return (
    <>
      <div>
        별이 빛을 잃고 말거에요.
        <br />
        정말로.. 삭제할까요?
      </div>
      <div>
        <button
          onClick={() => {
            /* 삭제 요청 */
          }}
        >
          삭제
        </button>
        <button
          onClick={() => {
            /* 모달 닫기 */
          }}
        >
          취소
        </button>
      </div>
    </>
  );
}

function Block() {
  /* 1. axios로 해당 사용자 차단 해제일 받아오기 */
  /* 2. 받아온 해제일 아래 alert에 채우기*/

  // 테스트 데이터
  const [userData, setUserData] = useState({
    memberRole: "Ban",
    memberBanDate: "2024-01-26",
  });
  const [dueDate, setDueDate] = useState("");

  // userData -> 로그인 직후에 유저 정보 받아오기
  // memberRole -> Ban일 경우 차단된 사용자
  // memberBanDate -> 차단 일자

  useEffect(() => {
    const date = new Date(userData.memberBanDate);
    setDueDate(new Date(date.setDate(date.getDate() + 7)));
    // api 개발 후 주석 해제할 예정
    // const fetchData = async () => {
    //   await axios
    //     .get(URL) // URL : API 요청 주소
    //     .then((response) => {
    //       setUserData(response.data);
    //     })
    //     .catch((e) => console.log(e));
    // };
    //   fetchData();
  }, []);

  return (
    <>
      <div>
        <button
          onClick={() => {
            /* 모달 닫기 */
          }}
        >
          CLOSE
        </button>
      </div>
      <div>
        차단된 사용자입니다.
        <br />
        차단 해제일 : {`${dueDate && dueDate.getFullYear()}년 ${dueDate && dueDate.getMonth() + 1}월 ${dueDate && dueDate.getDate()}일`}
      </div>
    </>
  );
}

export default Alert;
