// type: 'report', 'PWCheck', 'delete', 'block'
function Alert({ type }) {
  return (
    <div className="alert">
      {type === "block" ? <Block /> : null}
      {type === "delete" ? <Delete /> : null}
      {type === "PWCheck" || type === "report" ? <InputAlert type={type} /> : null}
    </div>
  );
}

function InputAlert({ type }) {
  const toEnter = type === "PWCheck" ? "비밀번호를" : "신고 내용을";
  const button = type === "PWCheck" ? "입력" : "신고";

  return (
    <>
      <div>{toEnter} 입력해주세요.</div>
      <div>
        <input />
      </div>
      <div>
        <button>{button}</button>
        <button>취소</button>
      </div>
    </>
  );
}

function Delete() {
  return (
    <>
      <div>
        별이 빛을 잃고 말거에요.
        <br />
        정말로.. 삭제할까요?
      </div>
      <div>
        <button>삭제</button>
        <button>취소</button>
      </div>
    </>
  );
}

function Block() {
  return (
    <>
      <div>
        <button>CLOSE</button>
      </div>
      <div>
        차단된 사용자입니다.
        <br />
        차단 해제일 : n년 n월 n일
      </div>
    </>
  );
}
// type: 'report', 'PWCheck', 'delete', 'block'

export default Alert;
