import { useEffect, useRef, useState, forwardRef } from "react";
import { isAddedStar, starsState, curPageState } from "components/user/UserSpace";
import { isStarDetailOpenState, isStarRegistOpenState, isStarModifyOpenState, renewStarDetailState } from "components/atom";
import axios from "axios";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import "./star.css";
import Find from "components/reusable/Find";

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

    function handleClick(e) {
      e.stopPropagation();
      const check = [...e.target.classList].some((it) => it === "star-regist-container");
      if (check) {
        handleClose();
      }
    }

    function handleKeydown(e) {
      if (e.key === "Escape") {
        setIsStarRegistOpen(false);
      }
    }

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeydown);
    };
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

  function handleClose() {
    if (type === "regist") {
      setIsStarRegistOpen(false);
    } else if (type === "modify") {
      setIsStarModifyOpen(false);
    }
  }

  return (
    <div className="star-regist-container absolute flex justify-center top-0 left-0 w-full h-full items-center font-['Pretendard']">
      <div>
        <ImagePreviewArea />
      </div>
      <div className="star-regist bg-modal-bg text-black-sub flex-row rounded p-3 w-96">
        <div className="star-regist-middle">
          <div className="flex justify-between items-center mb-2">
            <DateArea ref={dateRef} type={type} />
            <AccessRangeArea ref={accessRangeRef} preBoard={preBoard} />
          </div>
          <textarea className="bg-alert-bg rounded-lg w-full h-44 resize-none p-2 border text-white-sub" ref={contentRef} placeholder="일기 내용을 입력해주세요." />
        </div>
        {<HashtagArea hashtagSet={hashtagSet} preBoard={preBoard} type={type} />}
        <div className="flex justify-between">
          <FileUploadArea ref={fileRef} />
          <div className="flex">
            <button className="h-8 w-14 px-2 shadow-md" onClick={handleRegist}>
              {buttonValue[type]}
            </button>
            <button className="h-8 w-14 ml-2 shadow-md" onClick={handleClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const FileUploadArea = forwardRef((props, ref) => {
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

  return <input className="w-20" type="file" multiple onChange={handleFileChange} ref={ref} />;
});

function ImagePreviewArea() {
  const imageList = useRecoilValue(imageListState);
  console.log(imageList);
  return <div>{imageList.length > 0 ? imageList.map((it, index) => <div>{it}</div>) : null}</div>;
}

const DateArea = forwardRef((props, ref) => {
  const [date, setDate] = useState(new Date());
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();

  useEffect(() => {
    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDate();
    console.log(year);
  }, [date]);

  const handleCalander = () => {};

  return (
    <div onClick={handleCalander} className="text-white-sub text-2xl mb-1">
      <span className="hover:text-white hover:cursor-pointer">{`${year}년 ${month}월 ${day}일`}</span>
      <span className="text-lg">의 기록</span>
    </div>
  );
});

const AccessRangeArea = forwardRef((props, ref) => {
  return (
    <div>
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
    <>
      <div className="flex items-center flex-wrap mb-2">
        {hashtagList.map((it, index) => (
          <div className="text-white-sub mr-3 hover:text-white hover:cursor-pointer flex items-center h-6" key={index} onClick={() => handleRemoveHashtag(it, index)}>
            <span className="mr-1">#</span>
            <span>{it}</span>
          </div>
        ))}
        {props.type === "regist" && hashtagList.length < 10 && (
          <div className="flex items-center h-6 text-white-sub">
            <span className="text-white-sub mr-1 text-xl">#</span>
            <input className="rounded-none mr-3 my-1 w-20" ref={input} type="text" onKeyDown={handleKeyDown} placeholder="해시태그"></input>
          </div>
        )}
      </div>
    </>
  );
};

export default StarRegist;
