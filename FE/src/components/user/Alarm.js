import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import StarDetail from 'components/star/StarDetail';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FaUserPlus, FaComment, FaComments, FaRegBell } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';

// 추후 에러핸들링 필요
// onClose, get에서 유저 인덱스로 변경

function Alarm() {
    const [alarmData, setAlarmData] = useState([]);
    const [detailModal, setDetailModal] = useState(false);
    const [boardState, setBoardState] = useState('');
    const userIndex = Number(localStorage.getItem('memberIndex'));

    const ModalOpen = (boardIndex) => {
        setDetailModal(true);
        setBoardState(boardIndex);
    };

    const CloseButton = ({ onClose, alarmIndex }) => (
        <div className="alarmClose">
            <IoCloseSharp
                size="24"
                className="pl-2 text-btn-bg-hover"
                onClick={() => onClose(alarmIndex)}
            />
            {/* <button className="size-6" onClick={() => onClose(alarmIndex)}>X</button>  */}
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
                setAlarmData((currentAlarmData) =>
                    currentAlarmData.filter((it) => it.alarmIndex !== index)
                )
            )
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(`${process.env.REACT_APP_API_URL}/alarm/list/${userIndex}`)
                .then((response) => {
                    // console.log(response.data.result);
                    setAlarmData(response.data.result);
                })
                .catch((e) => console.log(e, userIndex));
        };

        fetchData();
    }, [userIndex]);

    // 알림 타입마다 다른 창이 떠야함
    // 추후 수정 - 알림 클릭시 해당 별 상세보기로 이동
    return (
        <Card className="Alarm w-3/12 bg-modal-bg text-white-sub px-6 py-6 rounded-component">
            <CardHeader>
                <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                    <FaRegBell className="mr-1" />
                    알림
                </CardTitle>
            </CardHeader>
            <div></div>
            <CardContent>
                {alarmData.map((it) => {
                    switch (it.alarmType) {
                        case 'FOLLOW':
                            return (
                                <div
                                    key={it.alarmIndex}
                                    className="flex justify-between font-['Pre-Light'] text-m py-1"
                                >
                                    <div className="flex">
                                        <FaUserPlus
                                            size="24"
                                            className="pr-2 text-btn-bg-hover"
                                        />
                                        {it.fromMemberNickName}님이 나를
                                        팔로우했습니다
                                    </div>
                                    <CloseButton
                                        onClose={onClose}
                                        alarmIndex={it.alarmIndex}
                                    />
                                </div>
                            );

                        case 'CMT':
                            return (
                                <div
                                    onClick={() => ModalOpen(it.boardIndex)}
                                    key={it.alarmIndex}
                                    className="flex justify-between font-['Pre-Light'] text-m py-1"
                                >
                                    <div className="flex">
                                        <FaComment
                                            size="24"
                                            className="pr-2 text-btn-bg-hover "
                                        />
                                        {it.fromMemberNickName}님이 내 게시글에
                                        댓글을 남겼습니다
                                    </div>
                                    <CloseButton
                                        onClose={onClose}
                                        alarmIndex={it.alarmIndex}
                                    />
                                    {detailModal &&
                                        boardState === it.boardIndex && (
                                            <div>
                                                {
                                                    <StarDetail
                                                        starIndex={
                                                            it.boardIndex
                                                        }
                                                    />
                                                }
                                            </div>
                                        )}
                                </div>
                            );
                        case 'MULTCMT':
                            return (
                                <div
                                    key={it.alarmIndex}
                                    onClick={() => ModalOpen(it.boardIndex)}
                                    className="flex justify-between font-['Pre-Light'] text-m py-1"
                                >
                                    <div className="flex">
                                        <FaComments
                                            size="24"
                                            className="pr-2 text-btn-bg-hover"
                                        />
                                        {it.fromMemberNickName}님이 내 댓글에
                                        답댓글을 남겼습니다
                                    </div>
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
            </CardContent>
        </Card>
    );
}

export default Alarm;
