import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import SearchBar from '../reusable/SearchBar';
import { filterState, listState } from 'components/atom';
import { Link } from 'react-router-dom';
import axios from 'axios';

// 유저 검색 기능
function FindUser() {
    console.log('들어왔음');
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
            <SearchBar filterKey="memberNickname" />
            <div className="userList">
                {filterData.map((it) => (
                    <li key={it.memberIndex}>
                        {it.memberNickname}
                        <Link to={`/space/${it.memberIndex}`}>
                            <button>이동하기</button>
                        </Link>
                    </li>
                ))}
            </div>
        </div>
    );
}

export default FindUser;
