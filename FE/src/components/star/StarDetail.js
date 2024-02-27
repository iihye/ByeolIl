import Modal from '../reusable/Modal';

/**
 * starIndex : 별 번호
 */
function StarDetail(props) {
    return (
        <Modal
            type={'star'}
            starIndex={props.starIndex}
            userIndex={Number(props.userIndex)}
            location={props.location}
        />
    );
}

export default StarDetail;
