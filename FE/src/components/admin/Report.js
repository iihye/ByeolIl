import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportDetail from './ReportDetail';
import { useRecoilState } from 'recoil';
import { reportModalState } from 'components/atom';

function Report() {
    const [reportData, setReportData] = useState([]);
    const [boardContent, setBoardContent] = useState([]); // 게시글에서 boardContent만 뽑아옴
    const [boardIndex, setBoardIndex] = useState([]); // 게시글에서 boardIndex만 뽑아옴
    const [reportModal, setReportModal] = useRecoilState(reportModalState); // 항목 클릭시 기존 컴포넌트 위에 모달창 띄움

    const token = localStorage.getItem('token');

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

    return (
        <div className="Report">
            {reportData.length > 0 && boardContent.length > 0 ? (
                reportData.map((it, index) => (
                    <>
                        {reportModal === it.boardIndex && (
                            <ReportDetail
                                boardIndex={it.boardIndex}
                                reportContent={it.reportContent}
                            />
                        )}
                        <li
                            key={it.reportIndex}
                            onClick={() => setReportModal(it.boardIndex)}
                        >
                            {boardContent[index]}&nbsp;
                            {it.reportRegdate}&nbsp;
                            {it.memberNickname}&nbsp;
                            {it.reportContent}&nbsp;
                        </li>
                    </>
                ))
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Report;
