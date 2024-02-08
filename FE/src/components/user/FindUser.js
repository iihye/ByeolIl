import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaUserCircle } from 'react-icons/fa';
import SearchBar from '../reusable/SearchBar';
import { filterState, listState } from 'components/atom';
import { TbHomeMove } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import axios from 'axios';

// 유저 검색 기능
function FindUser() {
    const setListData = useSetRecoilState(listState);
    const listValue = useRecoilValue(listState);
    const filterData = useRecoilValue(filterState);
    const userToken = localStorage.getItem('token') ?? '';

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
                    setListData(response.data);
                })
                .catch((e) => console.log(e.response));
        };

        fetchData();
    }, []);

    // 검색 결과와 일치하는 유저 닉네임 렌더링
    return (
        <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center">
            <Card className=" w-1/5 card-contain-style py-3 ">
                <div className="searchArea flex justify-between items-center search-input w-72 mx-auto my-3">
                    <div className="px-2">
                        <SearchBar filterKey="memberNickname" />
                    </div>
                </div>
                <ScrollArea className=" h-96 overflow-auto mx-7">
                    <div className="userList">
                        {filterData.map((it) => (
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
            </Card>
        </div>
    );
}

export default FindUser;
