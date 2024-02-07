import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";

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

                setFollowData(followResponse.data.result);
                setFollowerData(followerResponse.data.result);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <Card className="FollowList w-3/12 bg-modal-bg text-white-sub px-6 py-6 rounded-component">
            <CardHeader className="flex">
                <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">  
                    <AiOutlineUserAdd className="mr-1"/>
                    팔로우/팔로워 목록
                </CardTitle>
            </CardHeader>
            <div></div>
            <CardContent>
                <Tabs defaultValue={menuArr[0].name}>
                    <TabsList className="w-full bg-black-sub">
                        <TabsTrigger value={menuArr[0].name} className="w-full font-['Pre-Bold'] data-[state=active]:bg-background">{menuArr[0].name}</TabsTrigger>
                        <TabsTrigger value={menuArr[1].name} className="w-full font-['Pre-Bold'] data-[state=active]:bg-background">{menuArr[1].name}</TabsTrigger>
                    </TabsList>

                    <TabsContent value={menuArr[0].name}>
                        <ul className="font-['Pre-Light'] text-m py-1 mb-2">
                            {menuArr[0].content.map((user, index) => (
                                <li key={index} className="flex justify-start p-1">
                                    <FaUserCircle size="24" className="pr-2 text-btn-bg-hover"/>
                                    <p>{user.memberName}</p>
                                </li>
                            ))}
                        </ul>
                    </TabsContent>

                    <TabsContent value={menuArr[1].name}>
                        <ul className="font-['Pre-Light'] text-m py-1 mb-2">
                            {menuArr[1].content.map((user, index) => (
                                <li key={index} className="flex justify-start p-1">
                                    <FaUserCircle size="24" className="pr-2 text-btn-bg-hover"/>
                                    <p>{user.memberName}</p>
                                </li>
                            ))}
                            
                        </ul>
                    </TabsContent>
                </Tabs>

                {/* <div className="FollowList">
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
                </div> */}
            </CardContent>
        </Card>
    );
}

export default FollowList;
