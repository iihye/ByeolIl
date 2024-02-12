import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { FaSearch } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router';

// 추후 카드 형식으로 나오게 css 변경
// 추후 input 창 위에 tag가 올라가게 css 변경
// 유효성 검사 다시 꼼꼼하게

function StarTagSearch() {
    const [tag, setTag] = useState('');
    const [tagSearchData, setTagSearchData] = useState([]);
    const [replaceTag, setReplaceTag] = useState('');

    const navigate = useNavigate();

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
                setTagSearchData(response.data);
            })
            .catch((e) => console.log(e));
    };

    const activeSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            activeButton();
        } else if (e.key === 'Backspace') {
            handleList();
        }
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

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();
            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                navigate(-1);
            }
        }

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    });

    return (
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
            <Card className=" w-cardContainer card-contain-style py-3">
                <div className="searchArea flex justify-between items-center search-input mx-auto my-3">
                    <div className="flex px-2">
                        {replaceTag && (
                            <span
                                className="text-black-sub flex items-center p-2"
                                onClick={handleList}
                            >
                                #{replaceTag}
                                <IoCloseSharp />
                            </span>
                        )}
                        <input
                            name="tagSearch"
                            value={tag}
                            onChange={handleTag}
                            onKeyDown={(e) => activeSearch(e)}
                            className=" text-black-sub my-3"
                        />
                    </div>

                    <FaSearch
                        size="20"
                        className="text-black-sub mx-3"
                        onClick={() => activeButton()}
                    />
                </div>
                <ScrollArea className=" h-96 overflow-auto">
                    <div className="grid grid-cols-3 justify-items-center gap-4">
                        {tagSearchData ? (
                            tagSearchData.length > 0 ? (
                                tagSearchData.map((it) => (
                                    <Card
                                        key={it.boardIndex}
                                        className="card-style h-80 w-64"
                                    >
                                        <div className="cards w-4/5 mx-auto ">
                                            <div className="cardInfo text-xs py-2 pl-1.5">
                                                작성일&nbsp;
                                                <strong>
                                                    {it.boardInputDate}
                                                </strong>
                                                &nbsp; | 작성자&nbsp;
                                                <strong>
                                                    {it.memberNickname}
                                                </strong>
                                            </div>
                                            <div className="cardContent py-2">
                                                {it.boardContent}
                                            </div>
                                            <div className="cardTag flex py-2">
                                                {it.hash.map((tag) => (
                                                    <div>#{tag}&nbsp;</div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div>검색 결과가 없습니다</div>
                            )
                        ) : null}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    );
}

export default StarTagSearch;
