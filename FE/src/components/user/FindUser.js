import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { listState } from '../reusable/List';
import SearchBar, { filterState } from '../reusable/SearchBar';
import axios from 'axios';

// 유저 검색 기능
function FindUser() {
    const setListData = useSetRecoilState(listState);
    const filterData = useRecoilValue(filterState);

    // API로 유저 전체 리스트를 받아와서 listData 상태 변경
    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(`${process.env.REACT_APP_API_URL}/member/search/list`)
                .then((response) => {
                    setListData(response.data);
                })
                .catch((e) => console.log(e.response.status));
        };

        fetchData();
    }, []);

    // 검색 결과와 일치하는 유저 닉네임 렌더링
    return (
        <div className="findUser">
            <SearchBar filterKey="userNickName" />
            <div className="userList">
                {filterData.map((it) => (
                    <li key={it.userIndex} style={{ border: '1px solid' }}>
                        {it.userNickName}
                        <button>이동하기</button>
                    </li>
                ))}
            </div>
        </div>
    );
}

export default FindUser;
