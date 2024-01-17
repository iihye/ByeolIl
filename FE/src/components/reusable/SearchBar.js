import React, { useState, useEffect } from 'react';
import {atom, useRecoilValue, useSetRecoilState} from "recoil";
import {listState} from "./List";

export const filterState=atom({
    key: "filterState",
    default: [],
})


function SearchBar() {
    const [searchValue, setSearchValue] = useState("");
    const setFilterData = useSetRecoilState(filterState);
    const listItems=useRecoilValue(listState);

    const handleSearchValue = (e) => {
        setSearchValue(e.target.value); 
    };

    // 검색 결과와 일치하는 결과만 가져옴
    useEffect(() => {
        const filterContents = listItems.filter((it) =>
            it.boardContent
                .toLocaleLowerCase()
                .replace(/\s/g, '')
                .includes(searchValue.toLocaleLowerCase().replace(/\s/g, ''))
        );

        // 필터링이 완료된 후에 상태를 업데이트
        setFilterData(filterContents);
    }, [searchValue, listItems]);

    return (
        <div className="searchBar">
            <input value={searchValue} onChange={handleSearchValue} />
        </div>
    );
}

export default SearchBar;
