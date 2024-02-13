import { useEffect, useRef, useState } from "react";
import StarMultiReplyList from "./StarMultiReplyList";
import axios from "axios";
import { useRecoilState } from "recoil";
import { renewReplyState } from "components/atom";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoArrowForwardCircle } from "react-icons/io5";

function StarReplyListItem(props) {
    const [renewReply, setRenewReply] = useRecoilState(renewReplyState);

    const [multiReply, setMultiReply] = useState(false);

    const now = new Date();
    const commentIndex = props.reply.commentIndex;
    const writerIndex = props.reply.memberIndex;
    const writerNickname = props.reply.memberNickname;
    const commentRegDate = props.reply.commentRegdate;
    const commentContent = props.reply.commentContent;
    const multiComments = props.reply.multiComments;
    const boardIndex = props.boardIndex;

    const loginUserIndex = Number(JSON.parse(atob(sessionStorage.getItem("token").split(" ")[1].split(".")[1])).sub);
    const [printedDate, setPrintedDate] = useState();

    useEffect(() => {
        timeCheck();
    }, [props]);

    function timeCheck() {
        if (commentRegDate.length !== 7) return;
        const ymd = commentRegDate.splice(0, 3).join(",");
        const hm = commentRegDate.splice(0, 2).join(":");

        const regTime = new Date(ymd + " " + hm);
        const diff = 1000 * 60;
        const timeDiff = Math.round((now - regTime) / diff);

        let returnDate = `${regTime.getFullYear()}년 ${regTime.getMonth() + 1}월 ${regTime.getDate()}일`;

        if (timeDiff === 0) {
            returnDate = "방금 전";
        } else if (timeDiff < 60) {
            returnDate = `${timeDiff}분 전`;
        } else if (timeDiff < 1440) {
            returnDate = `${Math.round(timeDiff / 60)}시간 전`;
        }
        console.log(returnDate);
        setPrintedDate(returnDate);
    }

    const isWriter = () => {
        return writerIndex === loginUserIndex;
    };

    const handleDelete = async () => {
        const data = {
            commentIndex: commentIndex,
            memberIndex: writerIndex,
        };

        await axios
            .delete(`${process.env.REACT_APP_API_URL}/comment`, {
                header: {
                    token: sessionStorage.getItem("token"),
                },

                data: data,
            })
            .then((response) => {
                if (response.data.map.response === "success") {
                    setRenewReply(!renewReply);
                }
            });
    };

    return (
        <div className="star-reply-list-item py-1 ml-1">
            <div className="flex items-end">
                <div className="text-xl font-['Pre-bold']">{writerNickname}</div>
                <div className="ml-2">{printedDate}</div>
            </div>
            <div style={{ display: "flex" }}>
                <div>{commentContent}</div>
                <div className="flex items-center">
                    {isWriter() ? (
                        <div className="ml-2 text-lg hover:cursor-pointer text-red-300" onClick={handleDelete}>
                            <FaDeleteLeft />
                        </div>
                    ) : null}
                </div>
            </div>
            {!multiReply && (
                <div
                    className="multi-comment-area text-xs hover:cursor-pointer"
                    onClick={() => {
                        setMultiReply(true);
                    }}
                >
                    답글달기
                </div>
            )}
            {multiReply && <MultiReplyInput setMultiReply={setMultiReply} loginUserIndex={loginUserIndex} {...props} />}
            <StarMultiReplyList multiReplyList={multiComments} />
        </div>
    );
}

function MultiReplyInput(props) {
    const [renewReply, setRenewReply] = useRecoilState(renewReplyState);

    const input = useRef(null);

    const boardIndex = props.boardIndex;
    const reply = props.reply;
    const setMultiReply = props.setMultiReply;
    const loginUserIndex = props.loginUserIndex;

    useEffect(() => {
        function handleClick(e) {
            const check = [...e.target.classList].some((it) => it === "multi-comment-area");
            if (!check) {
                handleMultiReplyQuit();
            }
        }
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);

    function handleMultiReplyQuit() {
        setMultiReply(false);
    }

    const handleMultiReplySubmit = async () => {
        const data = {
            commentIndex: reply.commentIndex, // 코멘트번호?
            boardIndex: boardIndex, // 글 번호
            memberIndex: loginUserIndex, // 작성자
            commentContent: input.current.value, // 대댓글 내용
        };

        await axios
            .post(`${process.env.REACT_APP_API_URL}/multicomment`, data, {
                headers: {
                    token: sessionStorage.getItem("token"),
                },
            })
            .then((response) => {
                if (response.data.map.response === "success") {
                    console.log(renewReply);
                    setMultiReply(false);
                    setRenewReply(!renewReply);
                }
            })
            .catch((error) => console.log(error));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleMultiReplySubmit();
        }
    };

    return (
        <div className="multi-comment-area flex items-center text-lg ">
            <div className="multi-comment-area mr-2">└</div>
            <input ref={input} onKeyDown={handleKeyDown} className="multi-comment-area w-full border-b rounded-none mr-3" />
            <button
                className="multi-comment-area w-16 ml-1"
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
