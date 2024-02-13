import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil';
import { filterState, resetFilterState } from 'components/atom';

// useDebounce를 이용하여 상태가 변경될 때마다 화면이 깜빡이는 이슈 해결
const useDebounce = (value, delay) => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debounceValue;
};

function SearchBar({ filterKey, listItems }) {
    const [searchValue, setSearchValue] = useState(''); // 검색창에 입력되는 값
    const setFilterData = useSetRecoilState(filterState); // 필터링된 값
    const resetList = useResetRecoilState(filterState);

    const debouncedSearchValue = useDebounce(searchValue, 150);

    const handleSearchValue = (e) => {
        setSearchValue(e.target.value);
    };

    // 검색 결과 필터링. filterKey에 따라 대상 데이터가 변경됨
    useEffect(() => {
        const filterContents =
            listItems &&
            listItems.filter((it) =>
                it[filterKey]
                    ?.toLocaleLowerCase()
                    .replace(/\s/g, '')
                    .includes(
                        debouncedSearchValue
                            .toLocaleLowerCase()
                            .replace(/\s/g, '')
                    )
            );

        // 필터링이 완료된 후에 상태를 업데이트
        resetList();
        setFilterData(filterContents);
    }, [debouncedSearchValue, listItems]);

    return (
        <div className="searchBar">
            <input
                value={searchValue}
                onChange={handleSearchValue}
                className=" text-black-sub my-3 font-['Pre-Bold']"
                placeholder={
                    filterKey === 'memberNickname'
                        ? '닉네임을 입력해주세요'
                        : '내용을 입력해주세요'
                }
            />
        </div>
    );
}

export default SearchBar;
