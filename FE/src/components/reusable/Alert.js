import { useEffect, useRef, useState } from "react";
import { isDeleteAlertOpenState, isReportAlertOpenState, isStarDetailOpenState, isPwCheckOpenState } from "components/atom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import "./Alert.css";


// type: 'report', 'PWCheck', 'delete', 'block'
function Alert(props) {
  const alertTypes = {
    block: <Block />,
    delete: <Delete boardIndex={props.boardIndex} userIndex={props.userIndex} />,
    PWCheck: <InputAlert type={props.type} />,
    report: <InputAlert type={props.type} boardIndex={props.boardIndex} userIndex={props.userIndex} />,
  };

  return (
    <div className="alert" style={{ border: "1px solid black" }}>
      {alertTypes[props.type]}
    </div>
  );
}

// Input 요소를 가진 alert
function InputAlert(props) {
  const input = useRef(null);
 
  const setIsReportAlertOpen = useSetRecoilState(isReportAlertOpenState);
  const setIsPwCheckOpenState = useSetRecoilState(isPwCheckOpenState);
 
  useEffect(() => {
    // Enter 키 입력으로 input 내용 처리하기
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    };
 
    input.current.addEventListener("keydown", handleEnter);
  }, []);

  const toEnter = {
    PWCheck: "비밀번호를",
    report: "신고 내용을",
  };

  const buttonValue = {
    PWCheck: "입력",
    report: "신고",
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
          token: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  };

  const handlePWChange = (inputData) => {
    /* 1. 비밀번호 일치하는지 체크 */
    const PWData = {
      memberPass: inputData
    }
    axios.post(`${process.env.REACT_APP_API_URL}/member/check/pass`, PWData,{
      headers: {
        token: localStorage.getItem("token"),
      },
    }).then((response) => {
      console.log(response.data);
      if(response.data.message === "success") setIsPwCheckOpenState(false);
      else alert("비밀번호가 틀렸습니다!")
    })

  };

  // 비밀번호 입력 / 신고 요청
  const handleSubmit = () => {
    // Input 공백 체크
    const emptyCheck = (input) => {
      return input.trim();
    };

    const inputData = input.current.value;

    if (!emptyCheck(inputData)) {
      alert(`${toEnter[props.type]} 입력해주세요!`);
      return;
    }

    if (buttonValue[props.type] === "신고") {
      handleReport(inputData);
    } else if (buttonValue[props.type] === "입력") {
      handlePWChange(inputData);
    }
  };

  const handleClose = () => {
    setIsReportAlertOpen(false);
  };

  return (
    <>
      <div>{toEnter[props.type]} 입력해주세요.</div>
      <div>
        <input ref={input} />
      </div>
      <div>
        <button
          onClick={() => {
            handleSubmit();
          }}
        >
          {buttonValue[props.type]}
        </button>
        <button
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

function Delete(props) {
  const setIsDeleteAlertOpen = useSetRecoilState(isDeleteAlertOpenState);
  const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);

  const handleDelete = async () => {
    const data = {
      boardIndex: props.boardIndex,
      memberIndex: props.userIndex,
    };

    await axios
      .put(`${process.env.REACT_APP_API_URL}/board/delete`, data, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.map.response === "success") {
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
      <div>
        별이 빛을 잃고 말거에요.
        <br />
        정말로.. 삭제할까요?
      </div>
      <div>
        <button
          onClick={() => {
            handleDelete();
          }}
        >
          삭제
        </button>
        <button
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
    memberRole: "Ban",
    memberBanDate: "2024-01-26",
  });
  const [dueDate, setDueDate] = useState("");

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
        차단 해제일 : {`${dueDate && dueDate.getFullYear()}년 ${dueDate && dueDate.getMonth() + 1}월 ${dueDate && dueDate.getDate()}일`}
      </div>
    </>
  );
}

export default Alert;
