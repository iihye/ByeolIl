import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { listState, filterState } from 'components/atom';
import { useRecoilState, useRecoilValue } from 'recoil';
import SearchBar from '../reusable/SearchBar';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';

function StarFavorList() {
    const token = localStorage.getItem('token');
    const [memberIndex, setMemberIndex] = useState(
        localStorage.getItem('memberIndex')
    );

    const [listData, setListData] = useRecoilState(listState);
    const filterData = useRecoilValue(filterState);

    useEffect(() => {
        setMemberIndex(localStorage.getItem('memberIndex'));
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/board/like/${memberIndex}`,
                    {
                        headers: {
                            token: token,
                        },
                    }
                );
                setListData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [token, memberIndex]);

    console.log(filterData);

    return (
        <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center">
            <Card className=" w-cardContainer card-contain-style py-3">
                <div className="searchArea flex justify-between items-center search-input mx-auto my-3">
                    <div className="flex px-2">
                        <SearchBar filterKey="boardContent" />
                    </div>
                </div>
                <ScrollArea className=" h-96 overflow-auto">
                    <div className="grid grid-cols-3 justify-items-center gap-4">
                        {filterData.length > 0 ? (
                            filterData.map((it) => (
                                <Card
                                    key={it.boardIndex}
                                    className="card-style h-80 w-64 relative"
                                >
                                    <div className="cards w-4/5 mx-auto ">
                                        <div className="cardInfo text-xs py-2 pl-1.5">
                                            작성일&nbsp;
                                            <strong>{it.boardInputDate}</strong>
                                            &nbsp; | 작성자&nbsp;
                                            <strong>{it.memberNickname}</strong>
                                        </div>
                                        <div className="cardContent py-2">
                                            {it.boardContent}
                                        </div>
                                        <div className="absolute bottom-0 w-10/12 mb-3">
                                            <div className="cardTag flex py-2 ">
                                                {it.hash.map((tag) => (
                                                    <div>#{tag}&nbsp;</div>
                                                ))}
                                            </div>
                                            <div className="cardLike flex justify-end">
                                                <FaHeart
                                                    size="24"
                                                    className="mr-1.5"
                                                />
                                                {it.boardHeart}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div>일치하는 결과가 없습니다</div>
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    );
}

export default StarFavorList;
