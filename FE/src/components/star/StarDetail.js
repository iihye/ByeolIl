import Modal from "../reusable/Modal";

/**
 * starIndex : 별 번호
 */
function StarDetail(props) {
  return <Modal type={"star"} starIndex={props.starIndex} userIndex={props.userIndex} />;
}

export default StarDetail;
