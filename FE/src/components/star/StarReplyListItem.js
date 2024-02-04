import { useRef, useState } from "react";
import StarMultiReplyList from "./StarMultiReplyList";
import axios from "axios";
import { useRecoilState } from "recoil";
import { renewReplyState } from "components/atom";

function StarReplyListItem(props) {
  const [renewReply, setRenewReply] = useRecoilState(renewReplyState);

  const [multiReply, setMultiReply] = useState(false);
  const [multiReplyList, setMultiReplyList] = useState(props.reply.multiComments);

  const commentIndex = props.reply.commentIndex;
  const writerIndex = props.reply.memberIndex;
  const commentRegDate = props.reply.commentRegdate;
  const commentContent = props.reply.commentContent;
  const multiComments = props.reply.multiComments;
  console.log(props);
  const loginUserIndex = Number(JSON.parse(atob(localStorage.getItem("token").split(" ")[1].split(".")[1])).sub);

  const isWriter = () => {
    console.log(writerIndex, loginUserIndex);
    return writerIndex === loginUserIndex;
  };

  const handleDelete = async () => {
    const data = {
      commentIndex: commentIndex,
      memberIndex: writerIndex,
    };

    await axios
      .delete(`${process.env.REACT_APP_API_URL}/comment/`, {
        header: {
          token: localStorage.getItem("token"),
        },
        data: { ...data },
      })
      .then((response) => {
        if (response.data.map.response === "success") {
          setRenewReply(!renewReply);
        }
      });
  };

  return (
    <div className="star-reply-list-item" style={{ border: "1px solid black", margin: "5px" }}>
      <div style={{ display: "flex" }}>
        <div>{commentIndex}번 유저</div>
        <div>{commentRegDate}</div>
      </div>
      <div style={{ display: "flex" }}>
        <div>{commentContent}</div>
        <div>{isWriter() ? <button onClick={handleDelete}>댓글 삭제</button> : null}</div>
      </div>
      {!multiReply && (
        <div
          onClick={() => {
            setMultiReply(true);
          }}
        >
          답글달기
        </div>
      )}
      <StarMultiReplyList multiReplyList={multiReplyList} />
      {multiReply && <MultiReplyInput setMultiReply={setMultiReply} />}
    </div>
  );
}

function MultiReplyInput(props) {
  const input = useRef(null);
  const handleMultiReplyQuit = () => {
    props.setMultiReply(false);
  };
  const handleMultiReplySubmit = async () => {
    const data = {
      commentIndex: 1, // 코멘트번호?
      boardIndex: 1, // 글 번호
      memberIndex: 1, // 작성자
      commentContent: "답댓글입니다", // 대댓글 내용
    };

    await axios
      .post(`${process.env.REACT_APP_API_URL}/multicomment/`, data, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.map.response === "success") {
          props.setMultiReply(false);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      └ <input ref={input} />
      <button
        onClick={() => {
          handleMultiReplyQuit();
        }}
      >
        취소
      </button>
      <button
        onClick={() => {
          handleMultiReplySubmit();
        }}
      >
        등록
      </button>
    </div>
  );
}

export default StarReplyListItem;
