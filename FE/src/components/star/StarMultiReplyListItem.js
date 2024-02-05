import axios from "axios";
import { renewReplyState } from "components/atom";
import { useRecoilState } from "recoil";

function StarMultiReplyListItem(props) {
  const [renewReply, setRenewReply] = useRecoilState(renewReplyState);

  const reply = props.reply;
  const loginUserIndex = Number(JSON.parse(atob(localStorage.getItem("token").split(" ")[1].split(".")[1])).sub);

  const isWriter = () => {
    return loginUserIndex === reply.memberIndex;
  };

  const handleDelete = async () => {
    const data = {
      multicommentIndex: reply.multiCommentIndex,
      memberIndex: loginUserIndex,
    };
    console.log(data);
    await axios
      .delete(`${process.env.REACT_APP_API_URL}/multicomment/`, {
        headers: {
          token: localStorage.getItem("token"),
        },
        data: data,
      })
      .then((response) => {
        if (response.data.map.response === "success") {
          setRenewReply(!renewReply);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="star-reply-list-item" style={{ border: "1px solid black", margin: "5px", marginLeft: "15px" }}>
      <div style={{ display: "flex" }}>
        <div>{reply.memberIndex}번 유저</div>
        <div>{reply.multiCommentRegdate}</div>
      </div>
      <div style={{ display: "flex" }}>
        <div>{reply.multiCommentContent}</div>
        {isWriter() ? <button onClick={handleDelete}>댓글 삭제</button> : null}
      </div>
    </div>
  );
}

export default StarMultiReplyListItem;
