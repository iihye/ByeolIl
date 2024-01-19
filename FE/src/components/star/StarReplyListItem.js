function StarReplyListItem({ reply }) {
  return (
    <div className="star-reply-list-item" style={{ border: "1px solid black", margin: "5px" }}>
      <div style={{ display: "flex" }}>
        <div>{reply.user_index}번 유저</div>
        <div>{reply.comment_reg_time}</div>
      </div>
      <div>
        <div>{reply.comment_content}</div>
      </div>
      <div>답글달기</div>
    </div>
  );
}

export default StarReplyListItem;
