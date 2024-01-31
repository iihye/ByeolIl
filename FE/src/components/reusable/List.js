import React, { useEffect } from 'react';
import SearchBar from './SearchBar';
import { filterState, listState, userIndexState } from 'components/atom';
import { useRecoilValue, useRecoilState } from 'recoil';
import axios from 'axios';

function List() {
    const [listData, setListData] = useRecoilState(listState);
    const filterData = useRecoilValue(filterState);
    const memberIndex = useRecoilValue(userIndexState);

    const deleteStar = (boardIndex, memberIndex) => {
        axios
            .delete(
                `${process.env.REACT_APP_API_URL}/board/`,
                {
                    data: {
                        boardIndex: boardIndex,
                        memberIndex: memberIndex,
                    },
                },
                {
                    headers: {
                        token: localStorage.getItem('token') ?? '',
                    },
                }
            )
            .then(() => {
                setListData((currentListData) =>
                    currentListData.filter((it) => it.boardIndex !== boardIndex)
                );
                console.log('삭제완료');
            })
            .catch((error) => console.log(error));
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
                    <li key={it.boardIndex} style={{ border: '1px solid' }}>
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
