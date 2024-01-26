import React, { useRef, useState } from "react";

// 사이드바에-> 소셜로그인회원은 안되고 일반로그인회원은 비밀번호 수정 버튼 있다. -> 
// PWCheck를 먼저 가고 -> PWCheck에서 비밀번호 검사-> 검사 통과시에 ChangeInfo에 연결.
// 비밀번호만 수정할 수 있다.

export default function ChangeInfo() {
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

 return (
   <>
     <h3>비밀번호 수정</h3>
     <div className="form">
       <div className="form-el">
         <label htmlFor="password">*비밀번호</label> <br />
         <input
           id="password"
           name="password"
           ref={password}
           onBlur={onChangePassword}
         />
         <p className="message">{passwordMessage}</p>
       </div>
       <div className="form-el">
         <label htmlFor="passwordConfirm">*비밀번호확인</label> <br />
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
   </>
 );
};
