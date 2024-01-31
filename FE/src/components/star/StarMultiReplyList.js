import StarMultiReplyListItem from "./StarMultiReplyListItem";

function StarMultiReplyList(){
    const multiReplyList = [];

    return (
        <div className="star-multi-reply-list"> 
            {
                multiReplyList.map((it) => <StarMultiReplyListItem reply={it}/>)
            }
        </div>
    )
}

export default StarMultiReplyList;