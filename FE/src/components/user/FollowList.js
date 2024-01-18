import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const menuArr = [
    { name: '팔로우', content: [] },
    { name: '팔로워', content: [] },
];

function FollowList() {
    const [currentTab, setCurrentTab] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [followResponse, followerResponse] = await axios.all([
                    axios.get(
                        'https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/follow/following/1'
                    ),
                    axios.get(
                        'https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/follow/follower/2'
                    ),
                ]);

                // 데이터를 받은 후에 content를 설정
                menuArr[0].content = followResponse.data.map(
                    (it) => it.userName
                );
                menuArr[1].content = followerResponse.data.map(
                    (it) => it.userName
                );

                setCurrentTab(0);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="FollowList">
            {menuArr.map((data, index) => {
                return (
                    <div>
                        <button
                            key={index}
                            onClick={() => setCurrentTab(index)}
                            className={
                                currentTab === index
                                    ? 'currentFocused'
                                    : 'Focused'
                            }
                        >
                            {data.name}
                        </button>
                    </div>
                );
            })}
            <ul>
                {menuArr[currentTab].content.map((userName, index) => (
                    <li key={index}>
                        {userName} <button>팔로우하기</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FollowList;
