import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarDetail from 'components/star/StarDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaUserPlus, FaComment, FaComments, FaRegBell } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { useRecoilState, useResetRecoilState } from 'recoil';
import {
    isAlarmDetailState,
    isStarDetailOpenState,
    isAlarmOpenState,
} from '../atom';

// 추후 에러핸들링 필요

function Alarm() {
    const [alarmData, setAlarmData] = useState([]);
    const [detailModal, setDetailModal] = useRecoilState(isAlarmDetailState);
    const [isStarDetailOpen, setIsStarDetailOpen] = useRecoilState(
        isStarDetailOpenState
    );
    const resetIsFavorListOpen = useResetRecoilState(isAlarmOpenState);
    const memberIndex = Number(sessionStorage.getItem('memberIndex'));
    const EventSource = EventSourcePolyfill || NativeEventSource;

    const navigate = useNavigate();

    const CloseButton = ({ onClose, alarmIndex }) => (
        <div className="alarmClose">
            <IoCloseSharp
                size="24"
                className="pl-2 text-btn-bg-hover"
                onClick={() => onClose(alarmIndex)}
            />
        </div>
    );

    const onClose = (index) => {
        const alarmInfo = {
            alarmIndex: index,
            memberIndex: memberIndex,
        };

        axios
            .post(`${process.env.REACT_APP_API_URL}/alarm/check`, alarmInfo)
            .then(
                setAlarmData((currentAlarmData) =>
                    currentAlarmData
                        .filter((it) => it.alarmIndex !== index)
                        .reverse()
                )
            )
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(
                    `${process.env.REACT_APP_API_URL}/alarm/list/${memberIndex}`
                )
                .then((response) => {
                    setAlarmData(response.data.result);
                })
                .catch((e) => console.log(e));
        };

        fetchData();
    }, []);

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();
            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                resetIsFavorListOpen();
            }
        }

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    alarmData && alarmData.reverse();

    return (
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
            <Card
                className="Alarm bg-modal-bg text-white-sub px-6 py-6 rounded-component"
                style={{ width: '480px' }}
            >
                <CardHeader className="flex">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                        <FaRegBell className="mr-1" />
                        알림
                    </CardTitle>
                </CardHeader>
                <div></div>
                <CardContent>
                    <ScrollArea className="h-52 font-['Pre-Light'] text-m py-1 px-1.5 pr-5">
                        {alarmData.map((it) => {
                            switch (it.alarmType) {
                                case 'FOLLOW':
                                    return (
                                        <div
                                            key={it.alarmIndex}
                                            className="flex justify-between text-m py-1"
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
                                            key={it.alarmIndex}
                                            className="flex justify-between text-m py-1"
                                        >
                                            <div
                                                className="flex"
                                                onClick={() =>
                                                    setIsStarDetailOpen([
                                                        it.boardIndex,
                                                        -2,
                                                    ])
                                                }
                                            >
                                                <FaComment
                                                    size="24"
                                                    className="pr-2 text-btn-bg-hover "
                                                />
                                                {it.fromMemberNickName}님이 내
                                                게시글에 댓글을 남겼습니다
                                            </div>
                                            <CloseButton
                                                onClose={onClose}
                                                alarmIndex={it.alarmIndex}
                                                className="mr-1"
                                            />
                                        </div>
                                    );
                                case 'MULTCMT':
                                    return (
                                        <div
                                            key={it.alarmIndex}
                                            className="flex justify-between text-m py-1"
                                        >
                                            <div
                                                className="flex"
                                                onClick={() =>
                                                    setIsStarDetailOpen([
                                                        it.boardIndex,
                                                        -2,
                                                    ])
                                                }
                                            >
                                                <FaComments
                                                    size="24"
                                                    className="pr-2 text-btn-bg-hover"
                                                />
                                                {it.fromMemberNickName}님이 내
                                                댓글에 답댓글을 남겼습니다
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
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

export default Alarm;
