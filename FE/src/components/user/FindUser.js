import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaUserCircle } from 'react-icons/fa';
import SearchBar from '../reusable/SearchBar';
import { filterState, listState } from 'components/atom';
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
            <Card className=" w-3/12 card-contain-style py-3">
                <div className="searchArea flex justify-between items-center search-input mx-auto my-3">
                    <div className="flex px-2">
                        <SearchBar filterKey="memberNickname" />
                    </div>
                </div>
                <ScrollArea className=" h-96 overflow-auto border">
                    <div className="userList">
                        {filterData.map((it) => (
                            <li
                                key={it.memberIndex}
                                className="flex justify-start p-1"
                            >
                                <FaUserCircle
                                    size="24"
                                    className="pr-2 text-btn-bg-hover"
                                />
                                {it.memberNickname}
                                <Link to={`/space/${it.memberIndex}`}>
                                    <button>이동하기</button>
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
