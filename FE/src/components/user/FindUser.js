import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { listState } from '../reusable/List';
import SearchBar, { filterState } from '../reusable/SearchBar';
import axios from 'axios';

function FindUser() {
    const setListData = useSetRecoilState(listState);
    const filterData = useRecoilValue(filterState);

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(
                    'https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/search?user=2'
                )
                .then((response) => {
                    setListData(response.data);
                })
                .catch((e) => console.log(e));
        };

        fetchData();
    }, []);

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
