import Modal from "../reusable/Modal";

/**
 * starIndex : 별 번호
 */
function StarDetail({ starIndex }) {
  return <Modal type={"star"} starIndex={starIndex} />;
}

export default StarDetail;
