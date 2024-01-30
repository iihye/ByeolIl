import React, { useRef, useState } from "react";
import PWCheck from "./PWCheckAlert";
import { useNavigate } from 'react-router-dom';


// Sidebar에서 회원정보 수정 버튼 누름 -> PWCheckAlert를 먼저 가서 비밀번호 검사
// -> 검사 통과시에 ChangeInfo에 연결. -> 소셜로그인 회원은 비밀번호 수정이 없고 닉네임 수정만 있다.
// -> 소셜로그인 회원은 비밀번호 수정이 없고 닉네임 수정만 있다.
// + 닉네임수정은 메인화면에서 "OO님의 우주" 옆에 수정 아이콘을 눌러서 바로 수정이 되는 기능도

export default function ChangeInfo() {
 // 모달창을 열기위해서 모달창을 여닫는 boolean 변수는 디폴트값 true
 const [isModalOpen, setIsModalOpen] = useState(true);

 // 패스워드, 패스워드확인 
 const password = useRef("");
 const passwordConfirm = useRef("");


 // 오류메세지 상태 저장
 const [passwordMessage, setPasswordMessage] = useState("");
 const [passwordConfirmMessage, setPasswordConfirmMessage] =
   useState("");


 // 유효성 검사
 const [isPassword, setIsPassword] = useState(false);
 const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);


 const onChangePassword = () => {
   const passwordRegExp =
     /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,25}$/;
   if (!passwordRegExp.test(password.current.value)) {
     setPasswordMessage(
       "숫자+영문자+특수문자 조합으로 8자리 이상 25자 이하로 입력해주세요!"
     );
     setIsPassword(false);
   } else {
     setPasswordMessage("안전한 비밀번호 입니다.");
     setIsPassword(true);
   }
 };
 const onChangePasswordConfirm = () => {
   if (password.current.value !== passwordConfirm.current.value) {
     setPasswordConfirmMessage("비밀번호가 똑같지 않아요!");
     setIsPasswordConfirm(false);
   } else {
     setPasswordConfirmMessage("똑같은 비밀번호를 입력했습니다.");
     setIsPasswordConfirm(true);
   }
 };

// 비밀번호 수정하는 axios 추가해야함


 return (
   <>
     {isModalOpen && (<PWCheck setIsModalOpen={setIsModalOpen}/>)}
     {!isModalOpen && 
     (<div className="changePW">
        <h3>비밀번호 수정</h3>
        <div className="form">
          <div className="form-el">
            <label htmlFor="password">*새로운 비밀번호</label> <br />
            <input
              id="password"
              name="password"
              ref={password}
              onBlur={onChangePassword}
            />
            <p className="message">{passwordMessage}</p>
          </div>
          <div className="form-el">
            <label htmlFor="passwordConfirm">*비밀번호 확인</label> <br />
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              ref={passwordConfirm}
              onBlur={onChangePasswordConfirm}
            />
            <p className="message">{passwordConfirmMessage}</p>
          </div>
          <br />
          <button type="submit" disabled={!(isPassword && isPasswordConfirm)}>수정하기</button>
        </div>
      </div>)}
   </>
 );
};
