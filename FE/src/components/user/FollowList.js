import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

function FollowList() {
    const [currentTab, setCurrentTab] = useState(0);
    const [followData, setFollowData] = useState([]);
    const [followerData, setFollowerData] = useState([]);

    const menuArr = useMemo(() => {
        // 데이터를 받은 후에 content를 설정
        const followContent = followData.map((it) => it.memberName);
        const followerContent = followerData.map((it) => it.memberName);

        return [
            { name: '팔로우', content: followContent },
            { name: '팔로워', content: followerContent },
        ];
    }, [followData, followerData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [followResponse, followerResponse] = await axios.all([
                    axios.get(
                        `${process.env.REACT_APP_API_URL}/follow/following/1`
                    ),
                    axios.get(
                        `${process.env.REACT_APP_API_URL}/follow/follower/1`
                    ),
                    {
                        headers: {
                            token: localStorage.getItem('token') ?? '',
                        },
                    },
                ]);

                setFollowData(followResponse.data.result);
                setFollowerData(followerResponse.data.result);
            } catch (error) {
                console.error(error.response.status);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="FollowList">
            {menuArr.map((data, index) => (
                <div key={index}>
                    <button
                        onClick={() => setCurrentTab(index)}
                        className={
                            currentTab === index ? 'currentFocusedTab' : 'Tab'
                        }
                    >
                        {data.name}
                    </button>
                </div>
            ))}
            <ul>
                {menuArr[currentTab].content.map((userName, index) => (
                    <li key={index}>
                        <p>{userName}</p>
                        {/* <button>언팔로우</button> */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FollowList;
