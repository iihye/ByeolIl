import React, { useEffect, useState } from "react";
import axios from "axios";
import ReportDetail from "./ReportDetail";
import { useRecoilState } from "recoil";
import { reportModalState } from "components/atom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PiSiren } from "react-icons/pi";
import { useNavigate } from "react-router";

function Report() {
    const navigate = useNavigate();

    const [reportData, setReportData] = useState([]);
    const [boardContent, setBoardContent] = useState([]); // 게시글에서 boardContent만 뽑아옴
    const [boardIndex, setBoardIndex] = useState([]); // 게시글에서 boardIndex만 뽑아옴
    const [reportModal, setReportModal] = useRecoilState(reportModalState); // 항목 클릭시 기존 컴포넌트 위에 모달창 띄움

    const token = sessionStorage.getItem("token");

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
                            `${process.env.REACT_APP_API_URL}/board/${it.boardIndex}/${it.memberIndex}`
                        )
                    )
                );

                const newBoardContent = responses.map((res) => res.data.boardContent);

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

            const check = [...e.target.classList].some((it) => it === "outside");
            if (check) {
                navigate(-1);
            }
        }

        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
    });

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
                                <TableHead className="text-center w-2/12">닉네임</TableHead>
                                <TableHead className="text-center">신고내용</TableHead>
                                <TableHead className="text-center w-2/12">신고일</TableHead>
                                <TableHead className="text-center w-2/12">사용자 차단</TableHead>
                                <TableHead className="text-center w-2/12">게시글 확인</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reportData.length > 0 && boardContent.length > 0 ? (
                                reportData.map((it, index) => (
                                    <>
                                        {reportModal === it.boardIndex && (
                                            <ReportDetail
                                                boardIndex={it.boardIndex}
                                                reportContent={it.reportContent}
                                            />
                                        )}
                                        <TableRow
                                            className="font-['Pre-Light']"
                                            key={it.reportIndex}
                                        >
                                            <TableCell className="text-center">
                                                {it.memberNickname}
                                            </TableCell>
                                            {/* <TableCell>{boardContent[index]}</TableCell> */}
                                            <TableCell>{it.reportContent}</TableCell>
                                            <TableCell className="text-center">
                                                {it.reportRegdate}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <button className="bg-modal-bg w-3/5">
                                                    차단하기
                                                </button>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <button
                                                    className="bg-modal-bg w-6/12"
                                                    onClick={() => setReportModal(it.boardIndex)}
                                                >
                                                    글보기
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))
                            ) : (
                                <div className="font-['Pre-Light'] m-2 text-center">Loading...</div>
                            )}
                            <TableRow></TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        // <div className="Report">
        //     {reportData.length > 0 && boardContent.length > 0 ? (
        //         reportData.map((it, index) => (
        //             <>
        //                 {reportModal === it.boardIndex && (
        //                     <ReportDetail
        //                         boardIndex={it.boardIndex}
        //                         reportContent={it.reportContent}
        //                     />
        //                 )}
        //                 <li
        //                     key={it.reportIndex}
        //                     onClick={() => setReportModal(it.boardIndex)}
        //                 >
        //                     {boardContent[index]}&nbsp;
        //                     {it.reportRegdate}&nbsp;
        //                     {it.memberNickname}&nbsp;
        //                     {it.reportContent}&nbsp;
        //                 </li>
        //             </>
        //         ))
        //     ) : (
        //         <div>Loading...</div>
        //     )}
        // </div>
    );
}

export default Report;
