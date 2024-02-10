import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaUserCircle } from 'react-icons/fa';
import SearchBar from '../reusable/SearchBar';
import { filterState, resetFilterState } from 'components/atom';
import { PiShootingStarLight } from 'react-icons/pi';
import { TbHomeMove } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 유저 검색 기능
function FindUser() {
    const [listData, setListData] = useState('');
    const filterData = useRecoilValue(filterState);
    const userToken = sessionStorage.getItem('token') ?? '';
    const resetList = useResetRecoilState(filterState);
    const navigate = useNavigate();

    // API로 유저 전체 리스트를 받아와서 listData 상태 변경
    useEffect(() => {
        if (userToken === null || userToken === undefined) {
            return;
        }
        const fetchData = async () => {
            await axios
                .get(`${process.env.REACT_APP_API_URL}/member/search/list`, {
                    headers: {
                        token: userToken,
                    },
                })
                .then((response) => {
                    resetList();
                    setListData(response.data);
                })
                .catch((e) => console.log(e.response));
        };
        fetchData();
    }, []);

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();

            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                navigate(-1);
            }
        }

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    });

    // 검색 결과와 일치하는 유저 닉네임 렌더링
    return (
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
            <Card className=" w-1/4 card-contain-style px-6 py-6 ">
                <CardHeader className="flex ">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8 ">
                        <PiShootingStarLight className="mr-1" />
                        다른 우주 찾기
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="searchArea flex justify-between items-center search-input w-72 mx-auto ">
                        <div className="px-2">
                            <SearchBar
                                filterKey="memberNickname"
                                listItems={listData}
                            />
                        </div>
                    </div>
                    <ScrollArea className=" h-96 overflow-auto mx-7 w-80 my-3">
                        <div className="userList">
                            {filterData &&
                                filterData.map((it) => (
                                    <li
                                        key={it.memberIndex}
                                        className="flex p-2 text-lg"
                                    >
                                        <FaUserCircle
                                            size="30"
                                            className="pr-2 text-btn-bg-hover"
                                        />
                                        {it.memberNickname}
                                        <Link to={`/space/${it.memberIndex}`}>
                                            <TbHomeMove className="size-7 mx-2">
                                                이동하기
                                            </TbHomeMove>
                                        </Link>
                                    </li>
                                ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

export default FindUser;
