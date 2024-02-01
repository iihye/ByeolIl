import { useEffect, useState } from "react";
import StarReplyListItem from "./StarReplyListItem";
import axios from "axios";

function StarReplyList(props) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    console.log(props);
    const fetchData = async () => {
      await axios.get(`${process.env.REACT_APP_API_URL}/comment/${props.boardIndex}`)
      .then((res) => setData(res.data))
      .catch((error) => console.log(error));
    }
    fetchData();
    console.log(data);
  }, [])

  return (
    <div className="star-reply-list" style={{ border: "1px solid black", margin: "5px", overflowY: "scroll", height: "100px" }}>
      {data.map((reply, index) => (
        <StarReplyListItem reply={reply} key={index} />
      ))}
    </div>
  );
}

export default StarReplyList;
