import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    filterState,
    isFavorListOpenState,
    isStarDetailOpenState,
} from 'components/atom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import SearchBar from '../reusable/SearchBar';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { FaSearch } from 'react-icons/fa';
import { LuFolderHeart } from 'react-icons/lu';
import { FaRegFaceSadTear } from 'react-icons/fa6';

function StarFavorList() {
    const token = sessionStorage.getItem('token');
    const resetIsFavorListOpen = useResetRecoilState(isFavorListOpenState);
    const [listData, setListData] = useState('');
    const [followingList, setFollowingList] = useState([]);
    const [memberIndex, setMemberIndex] = useState(
        sessionStorage.getItem('memberIndex')
    );
    const [starDetailState, setStarDetailState] = useRecoilState(
        isStarDetailOpenState
    );
    const resetList = useResetRecoilState(filterState);
    const filterData = useRecoilValue(filterState);

    useEffect(() => {
        const getFollowList = async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/follow/following/${memberIndex}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            const memberIndexes =
                response && response.data.result.map((it) => it.memberIndex);
            setFollowingList(memberIndexes);
        };

        getFollowList();
    }, [token, memberIndex]);

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
                    response.data.filter(
                        (item) =>
                            item.boardAccess === 'OPEN' ||
                            (followingList.includes(item.memberIndex) &&
                                item.boardAccess === 'PARTOPEN')
                    )
                );
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [followingList]);

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();

            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                resetIsFavorListOpen();
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
            <Card className=" w-cardContainer card-contain-style px-6 py-6 ">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl">
                        <LuFolderHeart className="mr-1" />
                        좋아하는 별 목록
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="searchArea flex justify-between items-center search-input mx-auto my-6">
                        <div className="flex px-2">
                            <SearchBar
                                filterKey="boardContent"
                                listItems={listData}
                            />
                        </div>

                        <FaSearch size="20" className="text-black-sub mx-3" />
                    </div>
                    <ScrollArea className="Card-ScrollArea h-96 overflow-auto justify-center items-center">
                        <div className="grid grid-cols-3 justify-items-center gap-4">
                            {filterData?.length > 0 ? (
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
                                        <div className="cards w-4/5 mx-auto font-['Pre-Light']">
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
                                                <div className="cardTag flex py-2">
                                                    {it.hash?.length > 0
                                                        ? it.hash.map(
                                                              (tag) =>
                                                                  `#${tag} `
                                                          )
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
                                <div className="Card-ScrollArea-NonResult h-96 flex flex-col col-span-3 justify-center items-center">
                                    <FaRegFaceSadTear className="mr-1" />
                                    <div className="font-['Pre-Bold']">
                                        일치하는 결과가 없습니다
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

export default StarFavorList;
