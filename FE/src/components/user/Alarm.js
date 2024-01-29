import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 추후 에러핸들링 필요
// 추후 return 반복되는 부분 리팩토링 필요
function Alarm() {
    const [alarmData, setAlarmData] = useState([]);

    const navigate = useNavigate();
    const moveBoardDetail = (boardIndex) => {
        navigate(`/space/starDetail/${boardIndex}`);
    };

    const handleClose = (idx) => {
        const alarmInfo = {
            alarmIndex: idx,
            memberIndex: 1,
        };

        axios
            .post(`${process.env.REACT_APP_API_URL}/alarm/check`, alarmInfo)
            .then((response) => console.log(response, '삭제완료'))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(`${process.env.REACT_APP_API_URL}/alarm/list/1`)
                .then((response) => {
                    console.log(response.data.result);
                    setAlarmData(response.data.result);
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
                                <div key={it.alarmIndex}>
                                    {it.fromMemberNickName}님이 나를
                                    팔로우했습니다
                                    <div className="alarmClose">
                                        <button
                                            onClick={() =>
                                                handleClose(it.alarmIndex)
                                            }
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            );

                        case 'COMMENT':
                            return (
                                <div
                                    onClick={() =>
                                        moveBoardDetail(it.boardIndex)
                                    }
                                    key={it.alarmIndex}
                                >
                                    {it.fromMemberNickName}님이 내 게시글에
                                    댓글을 남겼습니다
                                    <div className="alarmClose">
                                        <button
                                            onClick={() =>
                                                handleClose(it.alarmIndex)
                                            }
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            );
                        case 'MULTICOMMENT':
                            return (
                                <div
                                    key={it.alarmIndex}
                                    onClick={moveBoardDetail(it.boardIndex)}
                                >
                                    {it.fromMemberNickName}님이 내 댓글에
                                    답댓글을 남겼습니다
                                    <div className="alarmClose">
                                        <button
                                            onClick={() =>
                                                handleClose(it.alarmIndex)
                                            }
                                        >
                                            X
                                        </button>
                                    </div>
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
