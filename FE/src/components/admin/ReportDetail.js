import React, { useEffect, useState } from "react";
import axios from "axios";
import { reportModalState } from "components/atom";
import { useSetRecoilState } from "recoil";

// props가 자주 변경되기 때문에 React.memo 사용이 부적절하다고 생각하여 넣지 않았음
// function ReportDetail(props) {
//     const [boardDetail, setBoardDetail] = useState('');
//     const setReportModalState = useSetRecoilState(reportModalState);

//     useEffect(() => {
//         axios
//             .get(
//                 `https://d9434a94-4844-4787-a437-ceb2559ee35c.mock.pstmn.io/board/${props.boardIndex}`
//             )
//             .then((response) => {
//                 setBoardDetail(response.data);
//             });
//     }, [props]);

//     return (
//         <div className="ReportDetail">
//             <div style={{ border: '1px solid' }}>
//                 {boardDetail &&
//                     boardDetail.map((it) => (
//                         <>
//                             {it.boardRegTime}
//                             {it.boardInputDate}
//                             {it.boardContent}
//                         </>
//                     ))}
//                 {props.reportContent}
//                 <button onClick={() => setReportModalState(false)}>닫기</button>
//             </div>
//         </div>
//     );
// }
import Modal from "../reusable/Modal";

/**
 *
 * reportInfo : ReportListResponseDto
 * @returns
 */
function ReportDetail(reportInfo) {
  // reportInfo : ReportListResponseDto

  // useEffect(() => {
  //     axios
  //         .get(
  //             `https://d9434a94-4844-4787-a437-ceb2559ee35c.mock.pstmn.io/board/${reportInfo.boardIndex}`
  //         )
  //         .then((response) => {
  //             setBoardDetail(response.data);
  //         });
  // }, [reportInfo]);

  return <Modal type={"report"} reportInfo={reportInfo} starIndex={reportInfo.boardIndex} />;
}

export default ReportDetail;
