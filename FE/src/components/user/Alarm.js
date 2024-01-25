import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Alarm() {
    const [alarmData, setAlarmData] = useState([]);

    const navigate = useNavigate();
    const moveBoardDetail = (receiveUserIndex, boardIndex) => {
        navigate(`/space/${receiveUserIndex}/starDetail/${boardIndex}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(
                    'https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/alarm/2'
                )
                .then((response) => {
                    console.log(response);
                    setAlarmData(response.data);
                })
                .catch((e) => console.log(e));
        };

        fetchData();
    }, []);

    // 알림 타입마다 다른 창이 떠야함
    // 추후 수정 - 알림 클릭시 해당 별 상세보기로 이동
    return (
        <div className="Alarm">
            <div>알림창</div>
            <div>
                {alarmData.map((it) => {
                    switch (it.alarmType) {
                        case 'FOLLOW':
                            return (
                                <div>
                                    {it.sendUserIndex}님이 나를 팔로우했습니다
                                </div>
                            );

                        case 'COMMENT':
                            return (
                                <div
                                    onClick={() =>
                                        moveBoardDetail(
                                            it.receiveUserIndex,
                                            it.boardIndex
                                        )
                                    }
                                >
                                    {it.sendUserIndex}님이 내 게시글에 댓글을
                                    남겼습니다
                                </div>
                            );
                        case 'MULTICOMMENT':
                            return (
                                <div
                                    onClick={moveBoardDetail(
                                        it.receiveUserIndex,
                                        it.boardIndex
                                    )}
                                >
                                    {it.sendUserIndex}님이 내 댓글에 답댓글을
                                    남겼습니다
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
}

export default Alarm;
