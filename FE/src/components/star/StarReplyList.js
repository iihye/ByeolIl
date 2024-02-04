import { useEffect, useState } from "react";
import { renewReplyState } from "components/atom";
import { useRecoilValue } from "recoil";
import StarReplyListItem from "./StarReplyListItem";
import axios from "axios";

function StarReplyList(props) {
  const [data, setData] = useState([]);
  const renewReply = useRecoilValue(renewReplyState);
  console.log("댓글 목록 렌더링");

  useEffect(() => {
    console.log("댓글 목록 가져오기");
    const fetchData = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/comment/${props.boardIndex}`)
        .then((res) => {
          setData(res.data);
          console.log(res.data);
        })
        .catch((error) => console.log(error));
    };
    fetchData();
  }, [renewReply]);

  return (
    <>
      <div>댓글 ----</div>
      <div className="star-reply-list" style={{ border: "1px solid black", margin: "5px", overflowY: "scroll", height: "100px" }}>
        {data.map((reply, index) => (
          <StarReplyListItem reply={reply} key={index} />
        ))}
      </div>
    </>
  );
}

export default StarReplyList;
