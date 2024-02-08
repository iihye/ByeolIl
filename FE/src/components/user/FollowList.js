import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";

function FollowList() {
  const [currentTab, setCurrentTab] = useState(0);
  const [followData, setFollowData] = useState([]);
  const [followerData, setFollowerData] = useState([]);

  const loginIndex = localStorage.getItem("memberIndex");
  const loginToken = localStorage.getItem("token");

  const navigate = useNavigate();

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
      { name: "팔로우", content: followContent },
      { name: "팔로워", content: followerContent },
    ];
  }, [followData, followerData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [followResponse, followerResponse] = await axios.all([
          axios.get(`${process.env.REACT_APP_API_URL}/follow/following/${loginIndex}`, {
            headers: {
              token: loginToken,
            },
          }),

          axios.get(`${process.env.REACT_APP_API_URL}/follow/follower/${loginIndex}`, {
            headers: {
              token: loginToken,
            },
          }),
        ]);

        setFollowData(followResponse.data.result);
        setFollowerData(followerResponse.data.result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    function handleClick(e) {
      e.stopPropagation();

      const check = [...e.target.classList].some((it) => it === "outside");
      if (check) {
        navigate(-1);
      }
    }

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  });

  return (
    <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
      <Card className="FollowList w-3/12 bg-modal-bg text-white-sub px-6 py-6 rounded-component">
        <CardHeader className="flex">
          <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
            <AiOutlineUserAdd className="mr-1" />
            팔로우/팔로워 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={menuArr[currentTab].name}>
            <TabsList className="w-full bg-black-sub">
              {menuArr.map((menu, index) => (
                <TabsTrigger key={index} value={menu.name} className="w-full font-['Pre-Bold'] data-[state=active]:bg-background" onClick={() => setCurrentTab(index)}>
                  {menu.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {menuArr.map((menu, index) => (
              <TabsContent key={index} value={menu.name}>
                <ScrollArea className="font-['Pre-Light'] text-m py-1 mb-2 h-52">
                  {menu.content.map((user, userIndex) => (
                    <li key={userIndex} className="flex justify-start p-1">
                      <FaUserCircle size="24" className="pr-2 text-btn-bg-hover" />
                      <p>{user.memberName}</p>
                    </li>
                  ))}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default FollowList;
