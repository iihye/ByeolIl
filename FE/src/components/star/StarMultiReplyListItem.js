import axios from "axios";
import { renewReplyState } from "components/atom";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { FaDeleteLeft } from "react-icons/fa6";

function StarMultiReplyListItem(props) {
    const [renewReply, setRenewReply] = useRecoilState(renewReplyState);

    const reply = props.reply;
    const loginUserIndex = Number(JSON.parse(atob(sessionStorage.getItem("token").split(" ")[1].split(".")[1])).sub);
    const multiCommentRegdate = reply.multiCommentRegdate;
    const [printedTime, setPrintedTime] = useState();
    const now = new Date();

    useEffect(() => {
        timeCheck();
    }, [props]);

    function timeCheck() {
        if (multiCommentRegdate.length !== 7) return;

        const ymd = multiCommentRegdate.splice(0, 3).join(",");
        const hm = multiCommentRegdate.splice(0, 2).join(":");

        const regTime = new Date(ymd + " " + hm);
        const diff = 1000 * 60;
        const timeDiff = Math.round((now - regTime) / diff);

        let returnDate = `${regTime.getFullYear()}년 ${regTime.getMonth()}월 ${regTime.getDate()}일`;

        if (timeDiff === 0) {
            returnDate = "방금 전";
        } else if (timeDiff < 60) {
            returnDate = `${timeDiff}분 전`;
        } else if (timeDiff < 1440) {
            returnDate = `${Math.round(timeDiff / 60)}시간 전`;
        }

        setPrintedTime(returnDate);
    }

    const isWriter = () => {
        return loginUserIndex === reply.memberIndex;
    };

    const handleDelete = async () => {
        const data = {
            multicommentIndex: reply.multiCommentIndex,
            memberIndex: loginUserIndex,
        };

        await axios
            .delete(`${process.env.REACT_APP_API_URL}/multicomment/`, {
                headers: {
                    token: sessionStorage.getItem("token"),
                },
                data: data,
            })
            .then((response) => {
                if (response.data.map.response === "success") {
                    setRenewReply(!renewReply);
                }
                console.log("sdf");
            })
            .catch((e) => console.log(e));
    };

    return (
        <div className="star-reply-list-item ml-4 p-1">
            <div className="flex items-end">
                <div className="text-xl">{reply.memberNickname}</div>
                <div className="ml-2">{printedTime}</div>
            </div>
            <div style={{ display: "flex" }}>
                <div>{reply.multiCommentContent}</div>
                {isWriter() ? (
                    <div className="ml-2 text-lg hover:cursor-pointer text-red-300" onClick={handleDelete}>
                        <FaDeleteLeft />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default StarMultiReplyListItem;
