import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { filterState, isStarDetailOpenState } from 'components/atom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import SearchBar from '../reusable/SearchBar';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router';

function StarFavorList() {
    const token = sessionStorage.getItem('token');
    const [listData, setListData] = useState('');
    const [memberIndex, setMemberIndex] = useState(
        sessionStorage.getItem('memberIndex')
    );
    const [starDetailState, setStarDetailState] = useRecoilState(
        isStarDetailOpenState
    );
    const resetList = useResetRecoilState(filterState);
    const filterData = useRecoilValue(filterState);

    const navigate = useNavigate();

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
                resetList();
                setListData(
                    response.data.filter((item) => item.boardAccess === 'OPEN')
                );
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [token, memberIndex]);

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

    console.log(filterData);

    return (
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center bg-modal-outside z-10">
            <Card className=" w-cardContainer card-contain-style py-3">
                <div className="searchArea flex justify-between items-center search-input mx-auto my-3">
                    <div className="flex px-2">
                        <SearchBar
                            filterKey="boardContent"
                            listItems={listData}
                        />
                    </div>
                </div>
                <ScrollArea className=" h-96 overflow-auto">
                    <div className="grid grid-cols-3 justify-items-center gap-4">
                        {filterData ? (
                            filterData.length > 0 ? (
                                filterData.map((it) => (
                                    <Card
                                        key={it.boardIndex}
                                        className="card-style h-80 w-64 relative"
                                        onClick={() =>
                                            setStarDetailState([
                                                it.boardIndex,
                                                it.memberIndex,
                                            ])
                                        }
                                    >
                                        <div className="cards w-4/5 mx-auto ">
                                            <div className="cardInfo text-xs py-2 pl-1.5">
                                                작성일&nbsp;
                                                <strong>
                                                    {it.boardInputDate}
                                                </strong>
                                                &nbsp; | 작성자&nbsp;
                                                <strong>
                                                    {it.memberNickname}
                                                </strong>
                                            </div>
                                            <div className="cardContent py-2">
                                                {it.boardContent}
                                            </div>
                                            <div className="absolute bottom-0 w-10/12 mb-3">
                                                <div className="cardTag flex py-2 ">
                                                    {it.hash
                                                        ? it.hash.length > 0
                                                            ? it.hash.map(
                                                                  (tag) => (
                                                                      <div>
                                                                          #{tag}
                                                                          &nbsp;
                                                                      </div>
                                                                  )
                                                              )
                                                            : null
                                                        : null}
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
                            )
                        ) : null}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    );
}

export default StarFavorList;
