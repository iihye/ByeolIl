import React, { useEffect } from 'react';
import SearchBar from './SearchBar';
import { filterState, listState, userIndexState } from 'components/atom';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';

function List() {
    const setListData = useSetRecoilState(listState);
    const filterData = useRecoilValue(filterState);
    const memberIndex = useRecoilValue(userIndexState);

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
                    </li>
                ))}
            </div>
        </div>
    );
}

export default List;
