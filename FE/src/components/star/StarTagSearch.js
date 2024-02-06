import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// 추후 카드 형식으로 나오게 css 변경
// 추후 input 창 위에 tag가 올라가게 css 변경
// 유효성 검사 다시 꼼꼼하게

function StarTagSearch() {
    const [tag, setTag] = useState('');
    const [tagSearchData, setTagSearchData] = useState([]);
    const [replaceTag, setReplaceTag] = useState('');

    const handleTag = (e) => {
        setTag(e.target.value);
    };

    const handleList = () => {
        setTag(' ');
        setTagSearchData([]);
        setReplaceTag('');
    };

    const fetchData = async (tag) => {
        await axios
            .get(
                `${
                    process.env.REACT_APP_API_URL
                }/search?tag=${encodeURIComponent(tag)}`
            )
            .then((response) => {
                console.log(response.data);
                setTagSearchData(response.data);
            })
            .catch((e) => console.log(e));
    };

    const activeSearch = (e) => {
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        activeButton();
    };

    const activeButton = () => {
        if (tag === '') return;

        const specialRegExp = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

        const testedTag = specialRegExp.test(tag)
            ? tag.replace(specialRegExp, '')
            : tag;

        setReplaceTag(testedTag.replace(/\s/g, ''));

        // 해시태그 모양 만들어주기
        setTag(' ');
    };

    useEffect(() => {
        if (replaceTag !== '') {
            fetchData(replaceTag);

            const reverseData = [...tagSearchData].reverse();
            setTagSearchData(reverseData);
        }
    }, [replaceTag]);

    return (
        <Card className=" w-cardContainer card-style opacity-50">
            <div className="searchArea flex justify-center py-5">
                <input
                    name="tagSearch"
                    value={tag}
                    onChange={handleTag}
                    onKeyDown={(e) => activeSearch(e)}
                    className="search-input text-black-sub"
                />

                {replaceTag && (
                    <span
                        style={{
                            border: '1px solid #ccc',
                        }}
                        onClick={handleList}
                    >
                        #{replaceTag}
                    </span>
                )}
                <button name="searchButton" onClick={() => activeButton()}>
                    찾기
                </button>
            </div>
            <ScrollArea className=" h-96 overflow-auto ">
                <div className="grid grid-cols-3 justify-items-center gap-4">
                    {tagSearchData &&
                        tagSearchData.map((it) => (
                            <Card
                                key={it.boardIndex}
                                className="card-style h-80 w-64 opacity-15  "
                            >
                                {it.boardInputDate}&nbsp;{it.boardContent}
                                &nbsp;
                                {it.hash}
                            </Card>
                        ))}
                </div>

                <ScrollBar />
            </ScrollArea>
        </Card>
    );
}

export default StarTagSearch;
