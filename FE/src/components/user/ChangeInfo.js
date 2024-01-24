import React, { useRef, useState } from "react";

// - 닉네임, 비밀번호만 수정할 수 있다.
// - 사용자는 회원정보 수정 페이지로 이동할 때 비밀번호를 다시 확인하는 절차를 거친다.
//  ⇒ 소셜 로그인 유저의 경우에는?????

export default function ChangeInfo() {
 // 초기값 - 아이디, 닉네임, 비밀번호, 비밀번호확인, 이메일, 생년월일 -> 기존값을 받아온다.
 const id = useRef("");
 const name = useRef("");
 const password = useRef("");
 const passwordConfirm = useRef("");
 const email = useRef("");
 const birth = useRef("");

 // 오류메세지 상태 저장
 const [idMessage, setIdMessage] = useState("");
 const [nameMessage, setNameMessage] = useState("");
 const [passwordMessage, setPasswordMessage] = useState("");
 const [passwordConfirmMessage, setPasswordConfirmMessage] =
   useState("");
 const [emailMessage, setEmailMessage] = useState("");
 const [birthMessage, setBirthMessage] = useState("");

 // 유효성 검사
 const [isId, setIsId] = useState(false);
 const [isname, setIsName] = useState(false);
 const [isPassword, setIsPassword] = useState(false);
 const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
 const [isEmail, setIsEmail] = useState(false);
 const [isBirth, setIsBirth] = useState(false);

const onChangeId = () => {
   const idRegExp = /^[a-z0-9]{4,20}$/;
   if (!idRegExp.test(id.current.value)) {
     setIdMessage("4-15사이 대소문자 또는 숫자만 입력해 주세요!");
     setIsId(false);
   } else {
     setIdMessage("사용가능한 아이디 입니다.");
     setIsId(true);
   }
 };

 const onChangeName = () => {
  const nameRegExp = /^[가-힣a-zA-Z0-9]{2,10}$/;
   if (!nameRegExp.test(name.current.value)) {
     setNameMessage("2-10사이 한글 영문 숫자만 입력가능!");
     setIsName(false);
   } else {
     setNameMessage("사용가능한 닉네임 입니다.");
     setIsName(true);
   }
 };

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
 const onChangeEmail = () => {
   const emailRegExp =
     /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

   if (!emailRegExp.test(email.current.value)) {
     setEmailMessage("이메일의 형식이 올바르지 않습니다!");
     setIsEmail(false);
   } else { 
     setEmailMessage("사용 가능한 이메일 입니다.");
     setIsEmail(true);
   }
 };
  const onChangeBirth = () => {
  const dateRegex = /^\d{4}\d{2}\d{2}$/; //? YYYYMMDD 형식의 정규식
  const dateRegex2 = /^\d{4}-\d{2}-\d{2}$/; //? YYYY-MM-DD 형식의 정규식
  const dateRegex3 = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/; //? 230613 kty YYYYMMDD 각 자리에 유효한 생년월일인지 확인
  const dateRegex4 = /^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[01])$/; //? 230613 kty YYYY-MM-DD 각 자리에 유효한 생년월일인지 확인
  
  if (dateRegex.test(birth.current.value) || dateRegex2.test(birth.current.value)) {
    if (dateRegex3.test(birth.current.value) || dateRegex4.test(birth.current.value)) {
      setBirthMessage("유효한 생년월일입니다.")
      setIsBirth(true);
    } else {
      setBirthMessage("유효하지 않은 생년월일입니다.")
      setIsBirth(false);
    }
  } else {
    {
      setBirthMessage("유효하지 않은 생년월일입니다.")
      setIsBirth(false);
    }
  }
};

//아이디 중복체크
//닉네임 중복체크
//이메일 중복체크 및 이메일 인증 
// 중복체크 및 인증 완료시 회원가입 완료


console.log("redering!"); // 렌더링 빈도 테스트
 return (
   <>
     <h3>회원가입</h3>
     <div className="form">
       <div className="form-el">
         <label htmlFor="id">*아이디</label> <br />
         <input id="id" name="id" ref={id} onBlur={onChangeId} />
         <p className="message"> {idMessage} </p>
       </div>
       <div className="form-el">  
         <label htmlFor="name">*닉네임</label> <br />
         <input id="name" name="name" ref={name} onBlur={onChangeName} />
         <p className="message">{nameMessage}</p>
       </div>
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
       <div className="form-el">
         <label htmlFor="email">*이메일</label> <br />
         <input
           id="email"
           name="name"
           ref={email}
           onBlur={onChangeEmail}
         />
         <p className="message">{emailMessage}</p>
       </div>
       <div className="form-el">
         <label htmlFor="birth">*생년월일</label> <br />
         <input
          placeholder="YYYYMMDD"
           id="birth"
           name="birth"
           ref={birth}
           onBlur={onChangeBirth}
         />
         <p className="message">{birthMessage}</p>
       </div> 
       <br />
       <button type="submit" disabled={!(isId && isname && isPassword && isPasswordConfirm && isEmail && isBirth)}>수정하기</button>
     </div>
   </>
 );
};
