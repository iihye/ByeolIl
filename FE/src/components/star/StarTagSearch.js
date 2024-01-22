import React, { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';

// 추후 카드 형식으로 나오게 css 변경
const dummyData = [
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
        boardIndex: 3,
        userIndex: 1,
        boardRegTime: '2014-01-02',
        boardInputTime: '2014-01-02',
        boardContent: '조회한 글입니다3',
        boardLocation: 1,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: ['밥', '저녁', '싸피'],
    },
    {
        boardIndex: 4,
        userIndex: 2,
        boardRegTime: '2014-01-04',
        boardInputTime: '2014-01-04',
        boardContent: '조회한 글입니다4',
        boardLocation: 2,
        boardAccess: 'OPEN',
        boardLike: 4,
        tagContent: ['오운완', '운동', '일기'],
    },
    {
        boardIndex: 5,
        userIndex: 1,
        boardRegTime: '2014-01-02',
        boardInputTime: '2014-01-02',
        boardContent: '조회한 글입니다5',
        boardLocation: 1,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: ['밥', '저녁', '싸피'],
    },
    {
        boardIndex: 6,
        userIndex: 2,
        boardRegTime: '2014-01-04',
        boardInputTime: '2014-01-04',
        boardContent: '조회한 글입니다6',
        boardLocation: 2,
        boardAccess: 'OPEN',
        boardLike: 4,
        tagContent: ['오운완', '운동', '일기'],
    },
    {
        boardIndex: 7,
        userIndex: 1,
        boardRegTime: '2014-01-02',
        boardInputTime: '2014-01-02',
        boardContent: '조회한 글입니다7',
        boardLocation: 1,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: ['밥', '저녁', '싸피'],
    },
    {
        boardIndex: 8,
        userIndex: 2,
        boardRegTime: '2014-01-04',
        boardInputTime: '2014-01-04',
        boardContent: '조회한 글입니다8',
        boardLocation: 2,
        boardAccess: 'OPEN',
        boardLike: 4,
        tagContent: ['오운완', '운동', '일기'],
    },
    {
        boardIndex: 9,
        userIndex: 1,
        boardRegTime: '2014-01-02',
        boardInputTime: '2014-01-02',
        boardContent: '조회한 글입니다9',
        boardLocation: 1,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: ['밥', '저녁', '싸피'],
    },
    {
        boardIndex: 10,
        userIndex: 2,
        boardRegTime: '2014-01-04',
        boardInputTime: '2014-01-04',
        boardContent: '조회한 글입니다10',
        boardLocation: 2,
        boardAccess: 'OPEN',
        boardLike: 4,
        tagContent: ['오운완', '운동', '일기'],
    },
    {
        boardIndex: 11,
        userIndex: 1,
        boardRegTime: '2014-01-02',
        boardInputTime: '2014-01-02',
        boardContent: '조회한 글입니다11',
        boardLocation: 1,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: ['밥', '저녁', '싸피'],
    },
    {
        boardIndex: 12,
        userIndex: 2,
        boardRegTime: '2014-01-04',
        boardInputTime: '2014-01-04',
        boardContent: '조회한 글입니다12',
        boardLocation: 2,
        boardAccess: 'OPEN',
        boardLike: 4,
        tagContent: ['오운완', '운동', '일기'],
    },
    {
        boardIndex: 13,
        userIndex: 1,
        boardRegTime: '2014-01-02',
        boardInputTime: '2014-01-02',
        boardContent: '조회한 글입니다13',
        boardLocation: 1,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: ['밥', '저녁', '싸피'],
    },
    {
        boardIndex: 14,
        userIndex: 2,
        boardRegTime: '2014-01-04',
        boardInputTime: '2014-01-04',
        boardContent: '조회한 글입니다14',
        boardLocation: 2,
        boardAccess: 'OPEN',
        boardLike: 4,
        tagContent: ['오운완', '운동', '일기'],
    },
];

function StarTagSearch() {
    const tagRef = useRef('');
    const [tagSearchData, setTagSearchData] = useState([]);
    const [replaceTag, setReplaceTag] = useState('');

    // const fetchData = async (tag) => {
    //     await axios
    //         .get
    //         `https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/search?tag=${encodeURIComponent(
    //             tag
    //         )}`
    //         ()
    //         .then((response) => {
    //             setTagSearchData(dummyData);
    //         })
    //         .catch((e) => console.log(e));
    // };

    const activeSearch = (e) => {
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        activeButton();
    };

    const activeButton = () => {
        const tag = tagRef.current?.value;
        if (tag === '') return;

        const regExp = /^[a-z|A-Z|가-힣|ㄱ-ㅎ|ㅏ-ㅣ|0-9| \t|]+$/g;
        const specialRegExp = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

        if (regExp.test(tag)) {
            const testedTag = specialRegExp.test(tag)
                ? tag.replace(specialRegExp, '')
                : tag;

            console.log(testedTag);
            setReplaceTag(testedTag.replace(/\s/g, ''));
        }

        // fetchData(replaceTag);
        const reverseData = [...dummyData].reverse();
        setTagSearchData(reverseData);

        // 해시태그 모양 만들어주기
        tagRef.current.value = '';
    };

    return (
        <div className="tagSearch">
            <div className="searchArea">
                <input
                    name="tagSearch"
                    ref={tagRef}
                    onKeyDown={(e) => activeSearch(e)}
                />
                {replaceTag && (
                    <span
                        style={{
                            margin: '4px',
                            padding: '4px',
                            border: '1px solid #ccc',
                        }}
                    >
                        #{replaceTag}
                    </span>
                )}
                <button name="searchButton" onClick={(e) => activeButton()}>
                    찾기
                </button>
            </div>
            <div className="resultArea">
                {tagSearchData.map((it) => (
                    <li key={it.boardIndex}>
                        {it.boardInputTime}&nbsp;{it.boardContent}&nbsp;
                        {it.tagContent}
                    </li>
                ))}
            </div>
        </div>
    );
}

export default StarTagSearch;
