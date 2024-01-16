import React, { useState, useEffect } from 'react';

const dummyItems = {
    data: [
        {
            boardIndex: 1,
            userIndex: 1,
            boardRegTime: '2014-01-02',
            boardInputTime: '2014-01-02',
            boardContent: '조회한 글입니다',
            boardLocation: 1,
            boardAccess: 'OPEN',
            boardLike: 3,
            tagContent: ['밥', '저녁', '싸피'],
        },
        {
            boardIndex: 2,
            userIndex: 2,
            boardRegTime: '2014-01-04',
            boardInputTime: '2014-01-04',
            boardContent: '조회한 글입니다2',
            boardLocation: 2,
            boardAccess: 'OPEN',
            boardLike: 4,
            tagContent: ['오운완', '운동', '일기'],
        },
        {
            boardIndex: 2,
            userIndex: 2,
            boardRegTime: '2014-01-04',
            boardInputTime: '2014-01-04',
            boardContent: '조회한 글입니다3',
            boardLocation: 2,
            boardAccess: 'OPEN',
            boardLike: 4,
            tagContent: ['오운완', '운동', '일기'],
        },
        {
            boardIndex: 3,
            userIndex: 2,
            boardRegTime: '2014-01-04',
            boardInputTime: '2014-01-04',
            boardContent: '내 이름은 김조회',
            boardLocation: 2,
            boardAccess: 'OPEN',
            boardLike: 4,
            tagContent: ['오운완', '운동', '일기'],
        },
        {
            boardIndex: 4,
            userIndex: 2,
            boardRegTime: '2014-01-04',
            boardInputTime: '2014-01-04',
            boardContent: '이것 도검색 해보시 지 마지막테스트',
            boardLocation: 2,
            boardAccess: 'OPEN',
            boardLike: 4,
            tagContent: ['오운완', '운동', '일기'],
        },
        {
            boardIndex: 5,
            userIndex: 2,
            boardRegTime: '2014-01-04',
            boardInputTime: '2014-01-04',
            boardContent: '문자가 길어지면 인식을 못하는걸까요?',
            boardLocation: 2,
            boardAccess: 'OPEN',
            boardLike: 4,
            tagContent: ['오운완', '운동', '일기'],
        },
        {
            boardIndex: 5,
            userIndex: 2,
            boardRegTime: '2014-01-04',
            boardInputTime: '2014-01-04',
            boardContent: 'hello hi',
            boardLocation: 2,
            boardAccess: 'OPEN',
            boardLike: 4,
            tagContent: ['오운완', '운동', '일기'],
        },
        {
            boardIndex: 5,
            userIndex: 2,
            boardRegTime: '2014-01-04',
            boardInputTime: '2014-01-04',
            boardContent: 'ohohoh',
            boardLocation: 2,
            boardAccess: 'OPEN',
            boardLike: 4,
            tagContent: ['오운완', '운동', '일기'],
        },
    ],
};

function SearchBar() {
    const [searchValue, setSearchValue] = useState('');
    const [filterData, setFilterData] = useState([]);

    const handleSearchValue = (e) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        const filterContents = dummyItems.data.filter((it) =>
            it.boardContent
                .toLocaleLowerCase()
                .replace(/\s/g, '')
                .includes(searchValue.toLocaleLowerCase().replace(/\s/g, ''))
        );

        console.log(filterData);

        // 필터링이 완료된 후에 상태를 업데이트합니다.
        setFilterData(filterContents);
    }, [searchValue]);

    return (
        <div className="searchBar">
            <input value={searchValue} onChange={handleSearchValue} />
            <div className="searchList">
                {filterData.map((it) => (
                    <li key={it.boardIndex}>
                        {it.boardRegTime}&nbsp;{it.boardInputTime}&nbsp;{it.boardContent}
                    </li>
                ))}
            </div>
        </div>
    );
}

export default SearchBar;
