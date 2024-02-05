import { useEffect, useRef, useState, forwardRef } from "react";
import { isAddedStar, starsState, curPageState } from "components/user/UserSpace";
import { isStarDetailOpenState, isStarRegistOpenState, isStarModifyOpenState, renewStarDetailState } from "components/atom";
import axios from "axios";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import "./star.css";

const imageListState = atom({
  key: "imageList",
  default: [],
});

function StarRegist(props) {
  const [renewStarDetail, setRenewStarDetail] = useRecoilState(renewStarDetailState);
  const curPage = useRecoilValue(curPageState);
  const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
  const setStars = useSetRecoilState(starsState);
  const setIsStarRegistOpen = useSetRecoilState(isStarRegistOpenState);
  const setIsStarModifyOpen = useSetRecoilState(isStarModifyOpenState);
  const [imageList, setImageList] = useRecoilState(imageListState);
  const [media, setMedia] = useState([]);
  const [inputDate, setInputDate] = useState();

  const accessRangeRef = useRef();
  const dateRef = useRef();
  const contentRef = useRef();
  const fileRef = useRef();

  const type = props.type;
  const location = props.location;
  const writerIndex = props.writerIndex;
  const boardIndex = props.boardIndex;
  const preBoard = props.preBoard;

  const buttonValue = {
    regist: "등록",
    modify: "수정",
  };

  const hashtagSet = new Set();

  useEffect(() => {
    if (type === "modify") {
      contentRef.current.value = preBoard.boardContent;
    }
  }, []);

  const handleRegist = async () => {
    if (contentRef.current.value.trim() === "") {
      alert("공백 입력했어요");
      return;
    }

    const files = fileRef.current.files;

    const formData = new FormData();

    // 파일 담기
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    // 해쉬태그 데이터 Set -> Array
    const hashContent = [];
    hashtagSet.forEach((it) => hashContent.push(it));
    if (type === "regist") {
      const data = {
        memberIndex: writerIndex,
        boardContent: contentRef.current.value,
        boardInputDate: "2024-01-23",
        mediaContent: [],
        boardLocation: location,
        boardAccess: accessRangeRef.current.value,
        boardDeleteYN: "N",
        hashContent: hashContent,
      };

      const dataDto = JSON.stringify(data);
      let requestDtoBlob = new Blob([dataDto], { type: "application/json" });

      formData.append("requestDto", requestDtoBlob);
      console.log(formData);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/board`, formData, {
          header: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          alert("게시글 작성 성공");

          const res = await axios.get(`${process.env.REACT_APP_API_URL}/board/star/${writerIndex}`, {
            header: {
              token: localStorage.getItem("token") ?? "",
            },
            params: {
              page: curPage ?? 0,
            },
          });

          isAddedStar.clear();
          res.data.BoardListResponseDtoList.forEach((star) => isAddedStar.set(star.boardLocation, star));
          setStars(res.data);
          handleClose();
        } else {
          console.log(response.data);
          alert("게시글 작성 실패");
        }
      } catch (error) {
        console.log(error);
      }
    } else if (type === "modify") {
      const inputDate = "2024-02-02";
      const data = {
        boardIndex: boardIndex,
        memberIndex: writerIndex,
        boardInputDate: inputDate,
        boardContent: contentRef.current.value,
        boardMedia: ["새 이미지 경로1", "새 이미지 경로2"],
        boardAccess: accessRangeRef.current.value,
      };

      try {
        await axios
          .put(`${process.env.REACT_APP_API_URL}/board`, data, {
            headers: {
              token: localStorage.getItem("token"),
            },
          })
          .then((response) => {
            if (response.status === 200) {
              setRenewStarDetail(!renewStarDetail);
              handleClose();
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFileChange = (e) => {
    // // 개수 제한
    // const maxFileCnt = 5;
    // const uploadFileList = fileRef.current.files;
    // const attachedFileCnt = uploadFileList.length;
    // const remainFileCnt = maxFileCnt - attachedFileCnt;
    // const imgUrlList = [...imageList];
    // console.log(uploadFileList);
    // for (let i = 0; i < uploadFileList.length; i++) {
    //   const imgURL = URL.createObjectURL(uploadFileList[i]);
    //   imgUrlList.push(imgURL);
    // }
    // if (remainFileCnt < 0) {
    //   alert(`첨부파일은 ${maxFileCnt}개를 넘길 수 없습니다.`);
    //   imgUrlList.slice(0, maxFileCnt);
    // }
    // console.log("파일첨부완료");
    // setImageList(imgUrlList);
    // 용량 제한
  };

  const handleClose = () => {
    if (type === "regist") {
      setIsStarRegistOpen(false);
    } else if (type === "modify") {
      setIsStarModifyOpen(false);
    }
  };

  return (
    <div className="star-regist-container">
      <div className="star-regist" style={{ border: "1px solid black" }}>
        <div className="star-regist-top">
          {/* 최상단 */}
          <DateArea ref={dateRef} type={type} />
          <AccessRangeArea ref={accessRangeRef} preBoard={preBoard} />
        </div>
        <div className="star-regist-middle">
          {/* 글 작성 영역 */}
          <ImagePreviewArea />
          <textarea ref={contentRef} />
        </div>
        <div>{<HashtagArea hashtagSet={hashtagSet} preBoard={preBoard} type={type} />}</div>
        <div>
          <input type="file" multiple onChange={handleFileChange} ref={fileRef} />
          <button onClick={handleRegist}>{buttonValue[type]}</button>
          <button onClick={handleClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

function ImagePreviewArea() {
  const imageList = useRecoilValue(imageListState);
  console.log(imageList);
  return <div>{imageList.length > 0 ? imageList.map((it, index) => <div>{it}</div>) : null}</div>;
}

const DateArea = forwardRef((props, ref) => {
  const handleCalander = () => {};

  return <div onClick={handleCalander}>날짜</div>;
});

const AccessRangeArea = forwardRef((props, ref) => {
  return (
    <div style={{ display: "flex" }}>
      <div>공개 범위</div>
      <select name="access" ref={ref} defaultValue={props.preBoard && props.preBoard.boardAccess}>
        <option value="OPEN">전체 공개</option>
        <option value="PARTOPEN">친구 공개</option>
        <option value="NOOPEN">비공개</option>
      </select>
    </div>
  );
});

const HashtagArea = (props) => {
  const input = useRef();
  const [hashtagList, setHashtagList] = useState([]);

  useEffect(() => {
    if (props.preBoard) {
      setHashtagList(props.preBoard.hashContent);
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.code === "Enter" || e.code === "Space") {
      // 한글 문자 두번씩 입력되는 오류 방지하기 위해 추가
      if (e.nativeEvent.isComposing) return;

      // 문자열 파싱 및 input value 비우기
      const value = input.current.value.trim();
      input.current.value = null;

      // 공백 해시태그 추가 방지
      if (value === "") return;

      // Set에 저장되어 있는지 체크
      if (!props.hashtagSet.has(value)) {
        // 새로운 값일 때

        // Set에 해시태그 값 저장
        props.hashtagSet.add(value);

        // 해시태그 리스트 갱신
        const tmp = [...hashtagList];
        tmp.push(value);
        setHashtagList(tmp);
      }
      input.current.value = null;
    }
  };

  const handleRemoveHashtag = (val, index) => {
    let tmp = [...hashtagList];
    tmp.splice(index, 1);
    setHashtagList(tmp);

    props.hashtagSet.delete(val);
  };

  return (
    <div style={{ display: "flex" }}>
      {hashtagList.map((it, index) => (
        <div key={index} style={{ border: "1px solid black", margin: "0 3px" }} onClick={() => handleRemoveHashtag(it, index)}>
          {it}
        </div>
      ))}
      {props.type === "regist" && hashtagList.length < 10 && <input ref={input} type="text" style={{ width: "70px" }} onKeyDown={handleKeyDown}></input>}
    </div>
  );
};

export default StarRegist;
