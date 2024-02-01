import { useRef, useState } from "react";
import StarMultiReplyList from "./StarMultiReplyList";

function StarReplyListItem(props) {
  const [multiReply, setMultiReply] = useState(false);
  console.log(props.reply);
  
  const handleDelete = async () => {
    /* 댓글 작성자 체크 */  

    // await axios.
  }

  return (
    <div className="star-reply-list-item" style={{ border: "1px solid black", margin: "5px" }}>
      <div style={{ display: "flex" }}>
        <div>{props.reply.userIndex}번 유저</div>
        <div>{props.reply.commentRegTime}</div>
      </div>
      <div style={{display: "flex"}}>
        <div>{props.reply.commentContent}</div>
        <div>
          <button onClick={handleDelete}>댓글 삭제</button>
        </div>
      </div>
      <div onClick={() => {setMultiReply(!multiReply)}}>답글달기</div>
      <StarMultiReplyList/>
      {
        multiReply && <MultiReplyInput setMultiReply={setMultiReply}/>
      }
    </div>
  );
}

function MultiReplyInput(props){
  const input = useRef(null);
  const handleMultiReplyQuit = () => {props.setMultiReply(false)}
  const handleMultiReplySubmit = () => {}

  return (
    <div>
      └ <input ref={input}/>
      <button onClick={() => {handleMultiReplyQuit()}}>취소</button>
      <button onClick={() => {handleMultiReplySubmit()}}>등록</button>
    </div>
  )
}

export default StarReplyListItem;
