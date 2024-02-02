import { useEffect, useState } from "react";
import { renderReplyState } from "components/atom";
import { useRecoilValue } from "recoil";
import StarReplyListItem from "./StarReplyListItem";
import axios from "axios";

function StarReplyList(props) {
  const [data, setData] = useState([]);
  const renderReply = useRecoilValue(renderReplyState);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${process.env.REACT_APP_API_URL}/comment/${props.boardIndex}`)
      .then((res) => {setData(res.data)
        console.log(res.data);
      })
      .catch((error) => console.log(error));
    }
    fetchData();
  }, [renderReply])

  return (
    <>
      <div>댓글 ----</div>
      <div className="star-reply-list" style={{ border: "1px solid black", margin: "5px", overflowY: "scroll", height: "50px" }}>
        {data.map((reply, index) => (
          <StarReplyListItem reply={reply} key={index} />
        ))}
      </div>
    </>
  );
}

export default StarReplyList;
