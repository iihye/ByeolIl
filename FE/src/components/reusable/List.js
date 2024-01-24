import React, { useEffect } from "react";
import SearchBar, { filterState } from "./SearchBar";
import { atom, useSetRecoilState, useRecoilValue } from "recoil";
import axios from "axios";

// API로 받아온 전체 데이터를 관리하는 atom
export const listState = atom({
  key: "listState",
  default: [],
});

function List() {
  const setListData = useSetRecoilState(listState);
  const filterData = useRecoilValue(filterState);

  // 추후 url https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/board/list/{userIndex}로 변경, 의존성 배열에 userIndex 넣기
  // 리스트 전체 값 불러오기
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/board/list/1")
        .then((response) => {
          setListData(response.data);
        })
        .catch((e) => console.log(e));
    };
    fetchData();
  }, []);

  // 검색 결과와 일치하는 값을 렌더링
  return (
    <div className="reusableList" style={{ border: "1px solid blue" }}>
      <SearchBar filterKey="boardContent" />
      <div className="searchList">
        {filterData.map((it) => (
          <li key={it.boardIndex} style={{ border: "1px solid" }}>
            {it.boardRegTime}&nbsp;{it.boardInputTime}&nbsp;
            {it.boardContent}
          </li>
        ))}
      </div>
    </div>
  );
}

export default List;
