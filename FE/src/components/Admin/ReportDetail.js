import Modal from "../reusable/Modal";

/**
 *
 * reportInfo : ReportListResponseDto
 * @returns
 */
function ReportDetail(
  {
    /* reportInfo */
  }
) {
  // reportInfo : ReportListResponseDto
  const reportInfo = {
    reportIndex: 1,
    boardIndex: 1,
    userNickname: "유저닉네임",
    reportContent: "신고 내용",
    reportInputDate: "신고 날짜",
  };
  return <Modal type={"report"} starIndex={reportInfo.boardIndex} reportInfo={reportInfo} />;
}

export default ReportDetail;
