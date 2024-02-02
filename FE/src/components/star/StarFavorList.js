import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StarFavorList() {
    const token = localStorage.getItem('token');
    const [memberIndex, setMemberIndex] = useState(
        localStorage.getItem('memberIndex')
    );
    const [likeList, setLikeList] = useState([]);

    useEffect(() => {
        setMemberIndex(localStorage.getItem('memberIndex'));
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/board/like/${memberIndex}`,
                    {
                        headers: {
                            token: token,
                        },
                    }
                );
                console.log(response.data.BoardListResponseDtoList);
                setLikeList(response.data.BoardListResponseDtoList);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [token, memberIndex]);

    return (
        <div>
            {likeList.map((it) => (
                <div>
                    {it.boardInputDate}
                    {it.boardRegTime}
                    {it.boardContent}
                    <div>좋아요 개수: {it.boardHeart}</div>
                </div>
            ))}
        </div>
    );
}

export default StarFavorList;
