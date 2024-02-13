import { useEffect, useRef, useState } from "react";
import { renewReplyState } from "components/atom";
import { useRecoilValue } from "recoil";
import StarReplyListItem from "./StarReplyListItem";
import axios from "axios";
import { IoMdRefresh } from "react-icons/io";
import { ScrollArea } from "@/components/ui/scroll-area";

function StarReplyList(props) {
  const renewReply = useRecoilValue(renewReplyState);

  const [data, setData] = useState([]);

  const replyListRef = useRef();

  const boardIndex = props.boardIndex;

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/comment/${boardIndex}`)
        .then((res) => {
          replyListRef.current.scrollTo({
            top: 0,
            left: 0,
          });
          console.log(res.data);
          setData(res.data.reverse());
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
          const newData = [...res.data.reverse()];
          setData(newData);
        })
        .catch((error) => console.log(error));
    };
    fetchData();
  };

  return (
    <>
      <div className="flex items-center text-white-sub text-xl gap-2 mt-2 mb-1 ml-1 w-96">
        <div>댓글 목록</div>
        <IoMdRefresh className="my-1 hover:cursor-pointer flex" onClick={handleRefresh} />
      </div>
      <ScrollArea className="h-52 w-96 relative border border-white-sub rounded-xl bg-alert-bg text-white-sub">
        <div className="star-reply-list  " ref={replyListRef}>
          {data[0] ? (
            [...data].map((reply, index) => <StarReplyListItem reply={reply} key={index} boardIndex={boardIndex} />)
          ) : (
            <div className="flex absolute top-0 bottom-0 left-0 right-0 justify-center items-center h-full">
              <div>등록된 댓글이 없습니다.</div>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}

export default StarReplyList;
