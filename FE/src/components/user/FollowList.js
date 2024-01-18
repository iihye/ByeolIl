import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const menuArr = [
    { name: '팔로우', content: [] },
    { name: '팔로워', content: [] },
];

function FollowList() {
    const [currentTab, setCurrentTab] = useState(0);
    const [followData, setFollowData] = useState([]);
    const [followerData, setFollowerData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .all([
                    axios.get(
                        'https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/follow/following/1'
                    ),
                    axios.get(
                        'https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/follow/follower/2'
                    ),
                ])

                .then(
                    axios.spread((res1, res2) => {
                        setFollowData(res1.data);
                        setFollowerData(res2.data);
                    })
                )
                .catch((e) => {
                    console.log(e);
                });
        };

        fetchData();
    }, []);

    useEffect(() => {
        menuArr[0].content = [
            followData && followData.map((it) => it.userName),
        ];
        menuArr[1].content = [
            followerData && followerData.map((it) => it.userName),
        ];
    }, [followData, followerData]);

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
            <p>{menuArr[currentTab].content}</p>
        </div>
    );
}

export default FollowList;
