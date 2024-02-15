import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportDetail from './ReportDetail';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { isReportOpenState, isReportDetailOpenState } from 'components/atom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PiSiren } from 'react-icons/pi';
import { useNavigate } from 'react-router';
import { ScrollArea } from '@/components/ui/scroll-area';
import swal from 'sweetalert';

function Report() {
    const navigate = useNavigate();

    const [reportData, setReportData] = useState([]);
    const [boardContent, setBoardContent] = useState([]); // 게시글에서 boardContent만 뽑아옴
    const [boardIndex, setBoardIndex] = useState([]); // 게시글에서 boardIndex만 뽑아옴
    const [isReportDetailOpen, setIsReportDetailOpen] = useRecoilState(
        isReportDetailOpenState
    ); // 항목 클릭시 기존 컴포넌트 위에 모달창 띄움
    const setIsReportOpen = useResetRecoilState(isReportOpenState);

    const token = sessionStorage.getItem('token');

    // 로그인 차단
    const handleBan = (memberIndex) => {
        swal({
            title: '정말로 차단하시겠습니까?',
            icon: 'warning',
        }).then(() => {
            axios
                .put(
                    `${process.env.REACT_APP_API_URL}/member/ban?index=${memberIndex}`,
                    {
                        headers: {
                            token: sessionStorage.getItem('token') ?? '',
                        },
                    }
                )
                .then(() => {
                    swal({
                        title: '7일 간 차단하였습니다🚨',
                        icon: 'warning',
                    });
                });
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(`${process.env.REACT_APP_API_URL}/board/adminlist`, {
                    headers: {
                        token: token,
                    },
                })
                .then((response) => setReportData(response.data))
                .catch((e) => e);
        };

        fetchData();
    }, []);

    //  boardIndex를 매개변수로 넘겨 일치하는 데이터 받아오기
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const responses = await Promise.all(
                    reportData.map((it) =>
                        axios.get(
                            `${process.env.REACT_APP_API_URL}/board/adminstar/${it.boardIndex}/${it.memberIndex}`
                        )
                    )
                );

                const newBoardContent = responses.map(
                    (res) => res.data.boardContent
                );

                const newBoardIndex = reportData.map((res) => res.boardIndex);

                setBoardContent(newBoardContent);
                setBoardIndex(newBoardIndex);
            } catch (error) {
                console.error(error);
            }
        };

        if (reportData.length > 0) {
            fetchBoardData();
        }
    }, [reportData]);

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();

            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                navigate(-1);
            }
        }

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    });

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();

            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                setIsReportOpen();
            }
        }

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
            <Card className="Report w-8/12 bg-modal-bg text-white-sub px-6 py-6 rounded-component">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                        <PiSiren className="mr-1" />
                        신고관리
                    </CardTitle>
                </CardHeader>
                <div></div>
                <CardContent>
                    <Table className="Report-Table">
                        <TableHeader>
                            <TableRow className="font-['Pre-Bold'] bg-white text-m ">
                                <TableHead className="text-center w-2/12">
                                    신고자
                                </TableHead>
                                <TableHead className="text-center w-2/12">
                                    작성자
                                </TableHead>
                                <TableHead className="text-center">
                                    신고내용
                                </TableHead>
                                <TableHead className="text-center w-1/12">
                                    신고일
                                </TableHead>
                                <TableHead className="text-center w-2/12">
                                    사용자 차단
                                </TableHead>
                                <TableHead className="text-center w-2/12">
                                    게시글 확인
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                    <ScrollArea className="h-96 ">
                        <Table>
                            <TableBody>
                                {reportData.length > 0 &&
                                boardContent.length > 0 ? (
                                    reportData.map((it, index) => (
                                        <>
                                            <TableRow
                                                className="font-['Pre-Light']"
                                                key={it.reportIndex}
                                            >
                                                <TableCell className="text-center w-2/12">
                                                    {it.memberNickname}
                                                </TableCell>
                                                <TableCell className="text-center w-2/12">
                                                    {it.banMemberNickName}
                                                </TableCell>
                                                <TableCell>
                                                    {it.reportContent}
                                                </TableCell>
                                                <TableCell className="text-center w-1/12">
                                                    {it.reportRegdate}
                                                </TableCell>
                                                <TableCell className="text-center w-2/12">
                                                    <button
                                                        className="bg-modal-bg w-3/5"
                                                        onClick={() => {
                                                            handleBan(
                                                                it.banMemberIndex
                                                            );
                                                        }}
                                                    >
                                                        차단하기
                                                    </button>
                                                </TableCell>
                                                <TableCell className="text-center w-2/12">
                                                    <button
                                                        className="bg-modal-bg w-6/12"
                                                        onClick={() =>
                                                            setIsReportDetailOpen(
                                                                [
                                                                    it.boardIndex,
                                                                    it.reportContent,
                                                                ]
                                                            )
                                                        }
                                                    >
                                                        글보기
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))
                                ) : (
                                    <div className="font-['Pre-Light'] m-2 text-center">
                                        Loading...
                                    </div>
                                )}
                                <TableRow></TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

export default Report;
