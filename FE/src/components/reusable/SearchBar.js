import React, { useState, useEffect } from 'react';
import axios from "axios";

function SearchBar() {
    const [searchValue, setSearchValue] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [dummyItems, setDummyItems]=useState([]);

    const handleSearchValue = (e) => {
        setSearchValue(e.target.value); 
    };

    // 추후 url https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/board/list/{userIndex}로 변경, 의존성 배열에 userIndex 넣기
    useEffect(()=>{

        const fetchData=async()=>{
            await axios.get("https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/board/list/1")
            .then((response)=>{
            setDummyItems(response.data);
            setFilterData(response.data)
        }).catch((e)=>console.log(e));
        }
        fetchData();

    },[])

    useEffect(() => {
        const filterContents = dummyItems.filter((it) =>
            it.boardContent
                .toLocaleLowerCase()
                .replace(/\s/g, '')
                .includes(searchValue.toLocaleLowerCase().replace(/\s/g, ''))
        );

        // 필터링이 완료된 후에 상태를 업데이트
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
