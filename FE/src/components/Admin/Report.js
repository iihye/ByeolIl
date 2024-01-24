import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportDetail from './ReportDetail';
import { atom, useRecoilState } from 'recoil';

export const reportModalState = atom({
    key: 'reportModalState',
    default: false,
});

function Report() {
    const [reportData, setReportData] = useState([]);
    const [boardContent, setBoardContent] = useState([]); // 게시글에서 boardContent만 뽑아옴
    const [boardIndex, setBoardIndex] = useState([]); // 게시글에서 boardIndex만 뽑아옴
    const [reportModal, setReportModal] = useRecoilState(reportModalState); // 항목 클릭시 기존 컴포넌트 위에 모달창 띄움

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(
                    'https://d9434a94-4844-4787-a437-ceb2559ee35c.mock.pstmn.io//board/adminlist'
                )
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
                            `https://d9434a94-4844-4787-a437-ceb2559ee35c.mock.pstmn.io/board/${it.boardIndex}`
                        )
                    )
                );

                const newBoardContent = responses.map(
                    (res, index) => res.data[index].boardContent
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
                        {reportModal && (
                            <ReportDetail
                                boardIndex={boardIndex[index]}
                                reportContent={it.reportContent}
                            />
                        )}
                        <li
                            key={it.reportIndex}
                            onClick={() => setReportModal(true)}
                        >
                            {boardContent[index]}
                            {it.reportInputDate}
                            {it.userNickname}
                            {it.reportContent}
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
