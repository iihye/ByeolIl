import Alert from "../reusable/Alert";

function StarDeleteAlert(props) {
  return <Alert type={"delete"} boardIndex={props.boardIndex} userIndex={props.userIndex}/>;
}

export default StarDeleteAlert;
