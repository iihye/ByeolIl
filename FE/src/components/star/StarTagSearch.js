import React, { useEffect, useState } from "react";
import axios from "axios";

// 추후 카드 형식으로 나오게 css 변경
// 추후 input 창 위에 tag가 올라가게 css 변경
// 유효성 검사 다시 꼼꼼하게

function StarTagSearch() {
  const [tag, setTag] = useState("");
  const [tagSearchData, setTagSearchData] = useState([]);
  const [replaceTag, setReplaceTag] = useState("");

  const handleTag = (e) => {
    setTag(e.target.value);
  };

  const handleList = (e) => {
    setTag(" ");
    setTagSearchData([]);
    setReplaceTag("");
  };

  const fetchData = async (tag) => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/search?tag=${encodeURIComponent(tag)}`)
      .then((response) => {
        console.log(response.data);
        setTagSearchData(response.data);
      })
      .catch((e) => console.log(e));
  };

  const activeSearch = (e) => {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    activeButton();
  };

  const activeButton = () => {
    if (tag === "") return;

    const specialRegExp = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

    const testedTag = specialRegExp.test(tag) ? tag.replace(specialRegExp, "") : tag;

    setReplaceTag(testedTag.replace(/\s/g, ""));

    // 해시태그 모양 만들어주기
    setTag(" ");
  };

  useEffect(() => {
    if (replaceTag !== "") {
      fetchData(replaceTag);

      const reverseData = [...tagSearchData].reverse();
      setTagSearchData(reverseData);
    }
  }, [replaceTag]);

  return (
    <div className="tagSearch" style={{ zIndex: 5 }}>
      <div className="searchArea">
        <input name="tagSearch" value={tag} onChange={handleTag} onKeyDown={(e) => activeSearch(e)} />
        {replaceTag && (
          <span
            style={{
              margin: "4px",
              padding: "4px",
              border: "1px solid #ccc",
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
      <div className="resultArea">
        {tagSearchData &&
          tagSearchData.map((it) => (
            <li key={it.boardIndex}>
              {it.boardInputDate}&nbsp;{it.boardContent}&nbsp;
              {it.hash}
            </li>
          ))}
      </div>
    </div>
  );
}

export default StarTagSearch;
