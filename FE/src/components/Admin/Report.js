import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Report() {
    const [reportData, setReportData] = useState([]);
    const [boardData, setBoardData] = useState([]);

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

        //  boardIndex를 매개변수로 넘겨 일치하는 데이터 받아오기

        const fetchBoardData = async () => {
            Promise.all(
                reportData.map(async (it) => {
                    return await axios
                        .get(
                            `https://d9434a94-4844-4787-a437-ceb2559ee35c.mock.pstmn.io/board/${it.boardIndex}`
                        )
                        .then((response) => {
                            setBoardData(response.data);
                        });
                })
            );
        };

        fetchBoardData();
    }, []);

    return (
        <div className="Report">
            {reportData.map((it) => (
                <li key={it.reportIndex}>
                    {it.reportInputDate}
                    {it.userNickname}
                    {it.reportContent}
                </li>
            ))}
        </div>
    );
}

export default Report;
