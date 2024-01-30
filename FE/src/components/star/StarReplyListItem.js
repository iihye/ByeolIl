import { useRef, useState } from "react";
import StarMultiReplyList from "./StarMultiReplyList";

function StarReplyListItem({ reply }) {
  const [multiReply, setMultiReply] = useState(false);

  return (
    <div className="star-reply-list-item" style={{ border: "1px solid black", margin: "5px" }}>
      <div style={{ display: "flex" }}>
        <div>{reply.user_index}번 유저</div>
        <div>{reply.comment_reg_time}</div>
      </div>
      <div>
        <div>{reply.comment_content}</div>
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
