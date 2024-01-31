import Modal from "../reusable/Modal";

/**
 *
 * reportInfo : ReportListResponseDto
 * @returns
 */
function ReportDetail({ reportInfo }) {
  // reportInfo : ReportListResponseDto

  return <Modal type={"report"} starIndex={reportInfo.boardIndex} reportInfo={reportInfo} />;
}

export default ReportDetail;
