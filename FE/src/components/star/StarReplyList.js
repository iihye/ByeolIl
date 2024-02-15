import { useEffect, useRef, useState } from "react";
import { renewReplyState } from "components/atom";
import { useRecoilValue } from "recoil";
import StarReplyListItem from "./StarReplyListItem";
import axios from "axios";
import { IoMdRefresh } from "react-icons/io";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoRocket } from "react-icons/go";

function StarReplyList(props) {
    const renewReply = useRecoilValue(renewReplyState);

    const [data, setData] = useState([]);

    const replyListRef = useRef();

    const isWriter = props.isWriter;
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
            <div className="flex justify-between items-center text-white-sub text-xl gap-2 mt-2 mb-1 ml-1 w-96">
                <div className="flex">
                    <div className="mr-1">댓글 목록</div>
                    <IoMdRefresh
                        className="my-1 hover:cursor-pointer flex"
                        onClick={handleRefresh}
                    />
                </div>
                <div className="flex w-32 justify-center">
                    <div className="flex items-center hover:hover text-white-sub relative overflow-hidden ">
                        {isWriter() ? (
                            <div
                                className="flex items-center"
                                onClick={props.handleRadio}
                            >
                                <div className="mr-2">라디오 송신</div>
                                <GoRocket />
                            </div>
                        ) : null}

                        <div
                            className="w-full h-full absolute  bg-black-sub"
                            style={{ right: "-8rem" }}
                        ></div>
                    </div>
                </div>
            </div>
            <ScrollArea className="h-52 w-96 relative border border-white-sub rounded-xl bg-alert-bg text-white-sub p-2">
                <div className="star-reply-list  " ref={replyListRef}>
                    {data[0] ? (
                        [...data].map((reply, index) => (
                            <StarReplyListItem
                                reply={reply}
                                key={index}
                                boardIndex={boardIndex}
                            />
                        ))
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
