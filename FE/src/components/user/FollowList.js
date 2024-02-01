import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

function FollowList() {
    const [currentTab, setCurrentTab] = useState(0);
    const [followData, setFollowData] = useState([]);
    const [followerData, setFollowerData] = useState([]);

    const loginIndex = localStorage.getItem('memberIndex');
    const loginToken = localStorage.getItem('token');

    const menuArr = useMemo(() => {
        // 데이터를 받은 후에 content를 설정
        const followContent = followData.map((it) => ({
            memberName: it.memberName,
            memberIndex: it.memberId,
        }));
        const followerContent = followerData.map((it) => ({
            memberName: it.memberName,
            memberIndex: it.memberId,
        }));

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
                        `${process.env.REACT_APP_API_URL}/follow/following/${loginIndex}`,
                        {
                            headers: {
                                token: loginToken,
                            },
                        }
                    ),

                    axios.get(
                        `${process.env.REACT_APP_API_URL}/follow/follower/${loginIndex}`,
                        {
                            headers: {
                                token: loginToken,
                            },
                        }
                    ),
                ]);
                console.log(followResponse);
                console.log(followerResponse);

                setFollowData(followResponse.data.result);
                setFollowerData(followerResponse.data.result);
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
                {menuArr[currentTab].content.map((user, index) => (
                    <li key={index}>
                        <p>{user.memberName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FollowList;
