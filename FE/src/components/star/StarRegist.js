import { useEffect, useRef, useState, forwardRef } from "react";
import { isAddedStar, starsState, curPageState } from "components/user/UserSpace";
import { isStarDetailOpenState, isStarRegistOpenState, isStarModifyOpenState, renewStarDetailState } from "components/atom";
import axios from "axios";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaFileImage, FaRegFileImage } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { Calendar } from "@/components/ui/calendar";

const fileListState = atom({
  key: "fileList",
  default: [],
});

function StarRegist(props) {
  const curPage = useRecoilValue(curPageState);
  const setStars = useSetRecoilState(starsState);
  const setIsStarRegistOpen = useSetRecoilState(isStarRegistOpenState);
  const setIsStarModifyOpen = useSetRecoilState(isStarModifyOpenState);
  const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);

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

  const handleRegist = async (fileList) => {
    if (contentRef.current.value.trim() === "") {
      alert("공백 입력했어요");
      return;
    }

    const files = [...fileList];

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
              setIsStarDetailOpen([boardIndex, writerIndex]);
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
    <div className="star-regist-container absolute flex justify-center top-0 left-0 w-full h-full items-center font-['Pretendard'] bg-modal-outside">
      <div>{/* <ImagePreviewArea /> */}</div>
      <div className="star-regist bg-modal-bg text-black-sub flex-row rounded p-3 w-96">
        <div className="star-regist-middle">
          <div className="flex justify-between items-center mb-2">
            <DateArea ref={dateRef} type={type} />
            <AccessRangeArea ref={accessRangeRef} preBoard={preBoard} />
          </div>
          <textarea className="bg-alert-bg rounded-lg w-full h-44 resize-none p-2 border text-white-sub" ref={contentRef} placeholder="일기 내용을 입력해주세요." />
        </div>
        {<HashtagArea hashtagSet={hashtagSet} preBoard={preBoard} type={type} />}
        <div className="relative">
          <FileUploadArea ref={fileRef} />
          <Buttons buttonValue={buttonValue} type={type} handleRegist={handleRegist} handleClose={handleClose} />
        </div>
      </div>
    </div>
  );
}

function Buttons(props) {
  const fileList = useRecoilValue(fileListState);

  const buttonValue = props.buttonValue;
  const type = props.type;
  const handleRegist = props.handleRegist;
  const handleClose = props.handleClose;

  return (
    <div className="flex absolute right-0 top-0">
      <button
        className="h-8 w-14 px-2 shadow-md"
        onClick={() => {
          handleRegist(fileList);
        }}
      >
        {buttonValue[type]}
      </button>
      <button className="h-8 w-14 ml-2 shadow-md" onClick={handleClose}>
        닫기
      </button>
    </div>
  );
}

const FileUploadArea = forwardRef((props, ref) => {
  const [fileList, setFileList] = useRecoilState(fileListState);

  useEffect(() => {
    return () => {
      setFileList([]);
    };
  }, []);

  function limitFileCnt(e, imageFileCnt, videoFileCnt) {
    const [maxImageCnt, maxVideoCnt] = [5, 1];

    const [remainImageFileCnt, remainVideoFileCnt] = [maxImageCnt - imageFileCnt, maxVideoCnt - videoFileCnt];

    let msg = "";
    if (remainImageFileCnt < 0) {
      msg += "이미지 파일은 최대 5개 까지 첨부 가능합니다.\n";
    }

    if (remainVideoFileCnt < 0) {
      msg += "비디오 파일은 최대 1개 까지 첨부 가능합니다.";
    }

    if (msg !== "") {
      alert(msg);
      // IE에서 호환성 문제 있음
      return false;
    }
    return true;
  }

  function limitFileVolume(e, imageFileList, videoFileList) {
    const imageLimit = 1024 ** 2 * 5; // 5MB
    const videoLimit = 1024 ** 2 * 100; // 100MB
    console.log(imageFileList, videoFileList);

    const imageSizeCheck = [...imageFileList].some((it) => it.size > imageLimit);
    const videoSizeCheck = [...videoFileList].some((it) => it.size > videoLimit);

    if (imageSizeCheck || videoSizeCheck) {
      return false;
    }
    return true;
  }

  function handleFileChange(e) {
    const fileMap = new Map();
    [...fileList].forEach((it) => fileMap.set(it.name, it));
    [...ref.current.files].forEach((it) => fileMap.set(it.name, it));
    if (e.dataTransfer) {
      [...e.dataTransfer.files].forEach((it) => fileMap.set(it.name, it));
    }

    const uploadFileList = [...fileMap.values()];

    const imageFileList = [...uploadFileList].filter((it) => it.type.split("/")[0] === "image");
    const videoFileList = [...uploadFileList].filter((it) => it.type.split("/")[0] === "video");

    // 파일 개수 제한 체크
    const fileCntCheckRes = limitFileCnt(e, imageFileList.length, videoFileList.length);
    const fileVolumeCheckRes = limitFileVolume(e, imageFileList, videoFileList);
    if (fileCntCheckRes && fileVolumeCheckRes) {
      setFileList([...uploadFileList]);
    }
    ref.current.value = "";
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFileChange(e);
  }

  function handleClick() {
    ref.current.click();
  }

  return (
    <>
      <div className="flex h-8">
        <input className="absolute w-0 h-0 p-0 border-0 overflow-hidden" type="file" id="file" multiple onChange={handleFileChange} ref={ref} />
        <label className="text-white-sub flex items-center  hover:text-white hover:cursor-pointer" for="file">
          <FaRegFileImage />
          <div className="ml-1">파일 첨부</div>
        </label>
      </div>
      <div className="mt-3 border border-dashed text-white-sub h-40 flex justify-center items-center text-center hover:cursor-pointer" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleClick}>
        {fileList.length === 0 ? (
          <div className="hover:text-white">
            <FaFileImage className="w-full text-5xl" />
            <div className="text-lg mt-2 text-center">드래그하여 파일을 업로드해주세요.</div>
            <div>이미지 파일 5개 / 영상 파일 1개</div>
          </div>
        ) : (
          <FileList classList="w-full h-full" />
        )}
      </div>
    </>
  );
});

function FileList() {
  const [fileList, setFileList] = useRecoilState(fileListState);

  function handleClick(e, index) {
    e.stopPropagation();

    const tmp = [...fileList];
    tmp.splice(index, 1);
    setFileList(tmp);
  }
  return (
    <div className="text-left w-full h-full ml-3">
      {fileList.map((it, index) => (
        <div className="flex items-center" key={index}>
          <div>- {it.name}</div>
          <div className="ml-1 mt-1 hover:cursor-pointer text-red-500 hover:text-red-400" onClick={(e) => handleClick(e, index)}>
            <MdOutlineCancel />
          </div>
        </div>
      ))}
    </div>
  );
}

function ImagePreviewArea() {
  const fileList = useRecoilValue(fileListState);
  console.log(fileList);
  return <div>{fileList.length > 0 ? fileList.map((it, index) => <div>{it}</div>) : null}</div>;
}

function DateArea() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();

  useEffect(() => {
    if (date) {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
      setDay(date.getDate());
    }
  }, [date]);

  const handleCalander = (e) => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return (
    <div className="text-white-sub text-2xl mb-1 relative hover:text-white hover:cursor-pointer">
      <div onClick={handleCalander} className="flex items-center">
        <div className="mr-1">{`${year}년 ${month}월 ${day}일`}</div>
        <div>
          <HiOutlinePencilSquare />
        </div>
      </div>
      {isCalendarOpen && <Calendar className={"absolute p-1 top-10 bg-black-sub border border-white-sub rounded z-10"} mode="single" selected={date} onSelect={setDate} />}
    </div>
  );
}

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
