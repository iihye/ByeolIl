import { useEffect, useState } from "react";
import { renewReplyState } from "components/atom";
import { useRecoilValue } from "recoil";
import StarReplyListItem from "./StarReplyListItem";
import axios from "axios";

function StarReplyList(props) {
  const renewReply = useRecoilValue(renewReplyState);

  const [data, setData] = useState([]);

  const boardIndex = props.boardIndex;

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/comment/${boardIndex}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => console.log(error));
    };
    fetchData();
  }, [renewReply]);

  const handleRefresh = () => {
    const fetchData = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/comment/${boardIndex}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => console.log(error));
    };
    fetchData();
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div>댓글 ----</div>
        <button onClick={handleRefresh}>새로고침</button>
      </div>
      <div className="star-reply-list" style={{ border: "1px solid black", margin: "5px", overflowY: "scroll", height: "200px" }}>
        {data.map((reply, index) => (
          <StarReplyListItem reply={reply} key={index} boardIndex={boardIndex} />
        ))}
      </div>
    </>
  );
}

export default StarReplyList;
