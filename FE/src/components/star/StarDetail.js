import Modal from '../reusable/Modal';

/**
 * starIndex : 별 번호
 */
function StarDetail(props) {
  return (
    <div>
      <Modal type={"star"} starIndex={props.starIndex} userIndex={props.userIndex} />
    </div>
  )
}

export default StarDetail;
