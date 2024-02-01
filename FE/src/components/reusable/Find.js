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

  const handleClick = (toFind) => {
    if (toFind === "ID") {
      reqFindID();
    } else if (toFind === "PW") {
      reqFindPW();
    }
  };

  return (
    <div>
      <div>{toFind === "ID" ? "아이디" : "비밀번호"} 찾기</div>
      <div>가입시 입력한 이메일을 입력해주세요.</div>
      <input ref={email} />
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

/**
 * ID 찾기 GET 요청
 */
function reqFindID() {
  // axios 요청 path: /user/getid
}

/**
 * PW 찾기 GET 요청
 */
function reqFindPW() {
  // axios 요청 path: /user/getpw
}

export default Find;
