import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Report() {
    const [reportData, setReportData] = useState([]);
    const [boardContent, setBoardContent] = useState([]); // 게시글에서 boardContent만 뽑아옴

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
                    reportData.map(async (it) => {
                        const response = await axios.get(
                            `https://d9434a94-4844-4787-a437-ceb2559ee35c.mock.pstmn.io/board/${it.boardIndex}`
                        );

                        return response.data.boardContent;
                    })
                );
                console.log(responses);
                setBoardContent(responses);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBoardData();
    }, [reportData]);

    console.log(boardContent);

    return (
        <div className="Report">
            {reportData.length > 0 && boardContent.length > 0 ? (
                reportData.map((it, index) => (
                    <li key={it.reportIndex}>
                        {boardContent[index]}
                        {it.reportInputDate}
                        {it.userNickname}
                        {it.reportContent}
                    </li>
                ))
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Report;
