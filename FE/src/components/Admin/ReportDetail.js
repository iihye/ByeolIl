import React, { useEffect, useState } from 'react';
import axios from 'axios';

// props가 자주 변경되기 때문에 React.memo 사용이 부적절하다고 생각하여 넣지 않았음
function ReportDetail(props) {
    const [boardDetail, setBoardDetail] = useState('');

    useEffect(() => {
        axios
            .get(
                `https://d9434a94-4844-4787-a437-ceb2559ee35c.mock.pstmn.io/board/${props.boardIndex}`
            )
            .then((reponse) => {
                setBoardDetail(response.data);
            });
    }, [props]);

    return (
        <div className="ReportDetail">
            <div style={{ border: '1px' }}>{props.boardIndex}</div>
        </div>
    );
}

export default ReportDetail;
