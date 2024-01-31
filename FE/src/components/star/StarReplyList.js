import StarReplyListItem from "./StarReplyListItem";

function StarReplyList() {
  // replys : 더미 댓글 리스트
  const replys = [];

  // 더미 댓글 생성
  for (let i = 0; i < 10; ++i) {
    replys[i] = {
      comment_index: i,
      board_index: 1,
      comment_reg_time: "2099-99-99",
      comment_content: `더미 댓글${i}`,
      user_index: i % 3,
    };
  }

  return (
    <div className="star-reply-list" style={{ border: "1px solid black", margin: "5px", overflowY: "scroll", height: "100px" }}>
      {replys.map((reply, index) => (
        <StarReplyListItem reply={reply} key={index} />
      ))}
    </div>
  );
}

export default StarReplyList;
