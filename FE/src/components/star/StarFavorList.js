import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StarFavorList() {
    const token = localStorage.getItem('token');
    const [memberIndex, setMemberIndex] = useState(
        localStorage.getItem('memberIndex')
    );

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
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [token, memberIndex]);
}

export default StarFavorList;
