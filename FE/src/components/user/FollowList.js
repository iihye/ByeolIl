import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

function FollowList() {
    const [currentTab, setCurrentTab] = useState(0);
    const [followData, setFollowData] = useState([]);
    const [followerData, setFollowerData] = useState([]);

    const menuArr = useMemo(() => {
        // 데이터를 받은 후에 content를 설정
        const followContent = followData.map((it) => it.userName);
        const followerContent = followerData.map((it) => it.userName);

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
                        'https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/follow/following/1'
                    ),
                    axios.get(
                        'https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/follow/follower/2'
                    ),
                ]);

                setFollowData(followResponse.data);
                setFollowerData(followerResponse.data);
            } catch (error) {
                console.error(error);
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
                        <button>언팔로우</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FollowList;
