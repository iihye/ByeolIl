import { useRef } from "react";
import axios from "axios";

/**
 *
 * @param {String} toFind ID or PW
 * @returns
 */
function Find({ toFind }) {
  const email = useRef();
  const ID = useRef();
  const membername = useRef();

  const handleClick = (toFind) => {
    if (toFind === "ID") {
      reqFindID();
    } else if (toFind === "PW") {
      reqFindPW();
    }
  };

  /**
   * ID 찾기 GET 요청
   */
  function reqFindID() {
    //이름과 메일을 알려주면 일치하는 아이디를 바로 넘겨준다.
  axios.get(`${process.env.REACT_APP_API_URL}/member/find/id?name=${membername.current.value}&email=${email.current.value}`)
  .then((response) => {alert(response.data)})
  }

  /**
  * PW 찾기 POST 요청
  */
  function reqFindPW() {
  //  /member/find/pass  // 이름 아이디 메일 알려주면 해당 메일로 비밀번호 전송
  const data = {
    "memberId":ID.current.value,
    "memberName":membername.current.value,
    "memberEmail":email.current.value,
  }

  axios.post(`${process.env.REACT_APP_API_URL}/member/find/pass`, data)
  .then((response) => {alert(response.data.message)})
  }

  return (
    <div>
      <div>{toFind === "ID" ? "아이디" : "비밀번호"} 찾기</div>
      <div>가입시 입력한 이메일을 입력해주세요.</div>
      <input ref={email} />
      <div>가입시 입력한 이름을 입력해주세요.</div>
      <input ref={membername}/>
      {toFind === "PW" ? <div>사용중인 아이디를 입력해주세요.</div> : null}
      {toFind === "PW" ? (
        <div>
          <input ref={ID} />
        </div>
      ) : null}
      <div>
        <button
          onClick={() => {
            handleClick(toFind);
          }}
        >
          인증하기
        </button>
      </div>
    </div>
  );
}

export default Find;
