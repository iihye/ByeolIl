import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userIndexState } from 'components/atom';
import { useRecoilValue } from 'recoil';

// 추후 에러핸들링 필요
// onClose, get에서 유저 인덱스로 변경

function Alarm() {
    const [alarmData, setAlarmData] = useState([]);
    const userIndex = useRecoilValue(userIndexState);

    console.log('유저 인덱스', userIndex);

    const navigate = useNavigate();
    const moveBoardDetail = (boardIndex) => {
        navigate(`/space/starDetail/${boardIndex}`);
    };

    const CloseButton = ({ onClose, alarmIndex }) => (
        <div className="alarmClose">
            <button onClick={() => onClose(alarmIndex)}>X</button>
        </div>
    );

    const onClose = (index) => {
        const alarmInfo = {
            alarmIndex: index,
            memberIndex: userIndex,
        };

        axios
            .post(`${process.env.REACT_APP_API_URL}/alarm/check`, alarmInfo)
            .then(
                setAlarmData(alarmData.filter((it) => it.alarmIndex !== index))
            )
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(`${process.env.REACT_APP_API_URL}/alarm/list/${userIndex}`)
                .then((response) => {
                    console.log(response.data.result);
                    setAlarmData(response.data.result);
                })
                .catch((e) => console.log(e, userIndex));
        };

        fetchData();
    }, [userIndex]);

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
                                    <CloseButton
                                        onClose={onClose}
                                        alarmIndex={it.alarmIndex}
                                    />
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
                                    <CloseButton
                                        onClose={onClose}
                                        alarmIndex={it.alarmIndex}
                                    />
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
                                    <CloseButton
                                        onClose={onClose}
                                        alarmIndex={it.alarmIndex}
                                    />
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
