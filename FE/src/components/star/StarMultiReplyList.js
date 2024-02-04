import { useRecoilValue } from "recoil";
import StarMultiReplyListItem from "./StarMultiReplyListItem";
import { renewReplyState } from "components/atom";

function StarMultiReplyList(props) {
  const multiReplyList = props.multiReplyList;

  return (
    <div className="star-multi-reply-list">
      {multiReplyList.map((it) => (
        <StarMultiReplyListItem reply={it} />
      ))}
    </div>
  );
}

export default StarMultiReplyList;
