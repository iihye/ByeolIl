import { useRef, useState } from "react";
import StarMultiReplyList from "./StarMultiReplyList";
import axios from "axios";

function StarReplyListItem(props) {
  const [multiReply, setMultiReply] = useState(false);
  const [multiReplyList, setMultiReplyList] = useState(props.reply.multiComments);
  
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
      {
        !multiReply && <div onClick={() => {setMultiReply(true)}}>답글달기</div>
      }
      <StarMultiReplyList multiReplyList={multiReplyList}/>
      {
        multiReply && <MultiReplyInput setMultiReply={setMultiReply}/>
      }
    </div>
  );
}

function MultiReplyInput(props){
  const input = useRef(null);
  const handleMultiReplyQuit = () => {props.setMultiReply(false)}
  const handleMultiReplySubmit = async () => {
    const data = {
      "commentIndex": 1,
      "boardIndex": 1,
      "memberIndex": 1,
      "commentContent": "답댓글입니다"
    }

    await axios.post(`${process.env.REACT_APP_API_URL}/multicomment/`,data,
    {
      headers: {
        token: localStorage.getItem('token'),
      },
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error))
  }

  return (
    <div>
      └ <input ref={input}/>
      <button onClick={() => {handleMultiReplyQuit()}}>취소</button>
      <button onClick={() => {handleMultiReplySubmit()}}>등록</button>
    </div>
  )
}

export default StarReplyListItem;
