import Modal from '../reusable/Modal';

/**
 * starIndex : 별 번호
 */
function StarDetail(props) {
  return (
    <div>
      <Modal type={"star"} starIndex={props.starIndex} userIndex={props.userIndex} location={props.location}/>
    </div>
  )
}

export default StarDetail;
