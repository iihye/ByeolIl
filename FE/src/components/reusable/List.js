import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { filterState, isMyStarListOpenState } from 'components/atom';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { isStarDetailOpenState } from 'components/atom';
import axios from 'axios';
import StarDetail from 'components/star/StarDetail';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { WiStars } from 'react-icons/wi';
import { useNavigate } from 'react-router';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaSearch } from 'react-icons/fa';

function List() {
    const resetList = useResetRecoilState(filterState);
    const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
    const setIsMyStarListOpen = useSetRecoilState(isMyStarListOpenState);

    const filterData = useRecoilValue(filterState);
    const isStarDetailOpen = useRecoilValue(isStarDetailOpenState);

    const [listData, setListData] = useState('');
    const [memberIndex, setMemberIndex] = useState(
        Number(sessionStorage.getItem('memberIndex'))
    );

    const token = sessionStorage.getItem('token') ?? '';

    useEffect(() => {
        setMemberIndex(Number(sessionStorage.getItem('memberIndex')));
    }, [token]);

    const deleteStar = (boardIndex, memberIndex) => {
        const data = { boardIndex: boardIndex, memberIndex: memberIndex };

        axios
            .put(`${process.env.REACT_APP_API_URL}/board/delete`, data, {
                headers: {
                    token: token,
                },
            })
            .then(() => {
                setListData((currentListData) =>
                    currentListData.filter((it) => it.boardIndex !== boardIndex)
                );
            })
            .catch((error) => console.log(error));
    };

    const onDetail = (boardIndex, memberIndex) => {
        setIsStarDetailOpen([boardIndex, memberIndex]);
        return (
            <div>
                {isStarDetailOpen.length !== 0 && (
                    <StarDetail
                        startIndex={boardIndex}
                        userIndex={memberIndex}
                    />
                )}
            </div>
        );
    };

    // 리스트 전체 값 불러오기
    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(
                    `${process.env.REACT_APP_API_URL}/board/list/${memberIndex}`
                )
                .then((response) => {
                    resetList();
                    setListData(response.data);
                })
                .catch((e) => console.log(e));
        };
        fetchData();
    }, [memberIndex]);

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();

            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                setIsMyStarListOpen(false);
            }
        }

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    });

    // 검색 결과와 일치하는 값을 렌더링
    return (
        <div className="outside w-full h-full absolute bg-modal-outside top-0 left-0 flex justify-center items-center z-10">
            <Card className="Report w-8/12 bg-modal-bg text-white-sub px-6 py-6 rounded-component">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                        <WiStars className="mr-1" />
                        나의 별 목록
                    </CardTitle>
                </CardHeader>
                <div></div>
                <CardContent>
                    <Table className="Star-List">
                        <TableHeader className="sticky top-0 bg-secondary">
                            <TableRow className="font-['Pre-Bold'] bg-white text-m ">
                                <TableHead className="text-center w-2/12">
                                    일기 날짜
                                </TableHead>
                                <TableHead className="text-center">
                                    일기 내용
                                </TableHead>
                                <TableHead className="text-center w-2/12">
                                    일기 삭제
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                    <ScrollArea className="h-96 ">
                        <Table>
                            <TableBody>
                                {filterData &&
                                    filterData.map((it) => (
                                        <>
                                            <TableRow
                                                className="font-['Pre-Light']"
                                                key={it.boardIndex}
                                            >
                                                <TableCell className="text-center w-2/12">
                                                    {it.boardInputDate}
                                                </TableCell>
                                                <TableCell
                                                    className="text-center"
                                                    onClick={() =>
                                                        onDetail(
                                                            it.boardIndex,
                                                            it.memberIndex
                                                        )
                                                    }
                                                >
                                                     {it.boardContent.substring(0,20).concat(it.boardContent.length > 20 ? "..." : "")}
                                                </TableCell>
                                                <TableCell className="text-center w-2/12">
                                                    <button
                                                        onClick={() =>
                                                            deleteStar(
                                                                it.boardIndex,
                                                                it.memberIndex
                                                            )
                                                        }
                                                        className="bg-modal-bg w-6/12"
                                                    >
                                                        X
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))}
                                <TableRow></TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
                <div className="searchArea flex justify-between items-center search-input w-96 mt-2 mr-2 left-0 ml-auto">
                    <div className="px-2">
                        <SearchBar
                            filterKey="boardContent"
                            listItems={listData}
                        />
                    </div>
                    <FaSearch size="20" className="text-black-sub mx-3" />
                </div>
            </Card>
        </div>
    );
}

export default List;
