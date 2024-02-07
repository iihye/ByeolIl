import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { filterState, listState } from 'components/atom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
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

function List() {
    const [listData, setListData] = useRecoilState(listState);
    const filterData = useRecoilValue(filterState);
    const [memberIndex, setMemberIndex] = useState(
        Number(localStorage.getItem('memberIndex'))
    );
    const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
    const isStarDetailOpen = useRecoilValue(isStarDetailOpenState);

    const token = localStorage.getItem('token') ?? '';

    useEffect(() => {
        setMemberIndex(Number(localStorage.getItem('memberIndex')));
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
                    setListData(response.data);
                })
                .catch((e) => console.log(e));
        };
        fetchData();
    }, [memberIndex]);

    // 검색 결과와 일치하는 값을 렌더링
    return (
        <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center">
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
                        <TableHeader>
                            <TableRow className="font-['Pre-Bold'] bg-white text-m ">
                                <TableHead className="text-center w-3/12">
                                    일기 등록일
                                </TableHead>
                                <TableHead className="text-center w-2/12">
                                    지정일
                                </TableHead>
                                <TableHead className="text-center">
                                    일기 내용
                                </TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filterData.map((it) => (
                                <>
                                    <TableRow
                                        className="font-['Pre-Light'] text-center"
                                        key={it.boardIndex}
                                    >
                                        <TableCell>{it.boardRegTime}</TableCell>
                                        <TableCell>
                                            {it.boardInputDate}
                                        </TableCell>
                                        <TableCell
                                            onClick={() =>
                                                onDetail(
                                                    it.boardIndex,
                                                    it.memberIndex
                                                )
                                            }
                                        >
                                            {it.boardContent}
                                        </TableCell>
                                        <TableCell>
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
                </CardContent>
                <SearchBar filterKey="boardContent" />
            </Card>
        </div>
    );
}

export default List;
