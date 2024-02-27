import Alert from "../reusable/Alert";

function StarReportAlert(props) {
  return <Alert type={"report"} boardIndex={props.boardIndex} userIndex={props.userIndex}/>;
}

export default StarReportAlert;
