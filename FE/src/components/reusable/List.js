import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { filterState, listState } from 'components/atom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { isStarDetailOpenState } from 'components/atom';
import axios from 'axios';
import StarDetail from 'components/star/StarDetail';

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
                    setListData(response.data.BoardListResponseDtoList);
                })
                .catch((e) => console.log(e));
        };
        fetchData();
    }, [memberIndex]);

    // 검색 결과와 일치하는 값을 렌더링
    return (
        <div className="reusableList" style={{ border: '1px solid blue' }}>
            <SearchBar filterKey="boardContent" />
            <div className="searchList">
                {filterData.map((it) => (
                    <li
                        key={it.boardIndex}
                        style={{ border: '1px solid' }}
                        onClick={() => onDetail(it.boardIndex, it.memberIndex)}
                    >
                        {it.boardRegTime}&nbsp;{it.boardInputDate}&nbsp;
                        {it.boardContent}
                        <button
                            onClick={() =>
                                deleteStar(it.boardIndex, it.memberIndex)
                            }
                        >
                            X
                        </button>
                    </li>
                ))}
            </div>
        </div>
    );
}

export default List;
