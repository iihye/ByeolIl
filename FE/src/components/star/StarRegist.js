import { useEffect, useRef, useState, forwardRef } from "react";
import {
    isAddedStar,
    starsState,
    curPageState,
} from "components/user/UserSpace";
import {
    isStarDetailOpenState,
    isStarRegistOpenState,
    isStarModifyOpenState,
} from "components/atom";
import axios from "axios";
import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaFileImage, FaRegFileImage } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { Calendar } from "@/components/ui/calendar";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import swal from "sweetalert";
import { EXTENSION_IMAGE, EXTENSION_VIDEO } from "data";

const fileListState = atom({
    key: "fileList",
    default: [],
});

const accessRangeState = atom({
    key: "accessRange",
    default: "OPEN",
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

    const MAX_STAR_CNT = 209;

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
            const check = [...e.target.classList].some(
                (it) => it === "star-regist-container"
            );

            if (check) {
                handleClose();
            }
        }

        function handleKeydown(e) {
            if (e.key === "Escape") {
                handleClose();
            }
        }

        window.addEventListener("click", handleClick);
        window.addEventListener("keydown", handleKeydown);

        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    const handleRegist = async (event, fileList, accessRange) => {
        event.stopPropagation();
        if (contentRef.current.value.trim() === "") {
            swal({
                title: "공백을 입력했어요!",
                text: "공백 제거 후 다시 시도해주세요",
                icon: "warning",
            });

            return;
        }

        if (contentRef.current.value.length > 200) {
            swal({
                title: "내용의 길이가 200자를 초과했습니다!",
                text: "200자 미만의 글만 등록할 수 있어요.",
                icon: "warning",
            });

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
                boardInputDate: dateRef.current.innerText,
                mediaContent: [],
                boardLocation: curPage * MAX_STAR_CNT + location,
                boardAccess: accessRange,
                boardDeleteYN: "N",
                hashContent: hashContent,
            };

            // Object to Blob
            const dataDto = JSON.stringify(data);
            let requestDtoBlob = new Blob([dataDto], {
                type: "application/json",
            });

            formData.append("requestDto", requestDtoBlob);

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/board`,
                    formData,
                    {
                        header: {
                            token: sessionStorage.getItem("token"),
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.status === 200) {
                    swal({
                        title: "게시글 작성 성공!",
                        icon: "success",
                    });

                    const res = await axios.get(
                        `${process.env.REACT_APP_API_URL}/board/star/${writerIndex}`,
                        {
                            header: {
                                token: sessionStorage.getItem("token") ?? "",
                            },
                            params: {
                                page: curPage ?? 0,
                            },
                        }
                    );

                    isAddedStar.clear();
                    res.data.forEach((star) =>
                        isAddedStar.set(star.boardLocation, star)
                    );
                    setStars(res.data);
                    handleClose(false);
                } else {
                    swal({
                        title: "게시글 작성에 실패했어요",
                        text: "잠시 후 다시 시도해주세요",
                        icon: "error",
                    });
                }
            } catch (error) {
                console.log(error);
            }
        } else if (type === "modify") {
            const data = {
                boardIndex: boardIndex,
                memberIndex: writerIndex,
                boardInputDate: dateRef.current.innerText,
                boardContent: contentRef.current.value,
                boardMedia: [...preBoard.boardMedia],
                boardAccess: accessRange,
                boardHash: hashContent,
            };

            // Object to Blob
            const dataDto = JSON.stringify(data);
            let requestDtoBlob = new Blob([dataDto], {
                type: "application/json",
            });

            formData.append("requestDto", requestDtoBlob);

            try {
                await axios
                    .put(`${process.env.REACT_APP_API_URL}/board`, formData, {
                        headers: {
                            token: sessionStorage.getItem("token"),
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            swal({
                                title: "게시글 수정 성공!",
                                icon: "success",
                            });
                            setIsStarDetailOpen([boardIndex, writerIndex]);
                            handleClose(false);
                        }
                    });
            } catch (error) {
                console.log(error);
            }
        }
    };

    function handleClose(check) {
        if (check) {
            if (type === "regist") {
                if (contentRef.current.value.trim().length === 0) {
                    setIsStarRegistOpen(false);
                } else {
                    swal({
                        title: "창을 닫을까요?",
                        text: "작성중인 게시글이 지워집니다!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            setIsStarRegistOpen(false);
                        }
                    });
                }
            } else if (type === "modify") {
                if (contentRef.current.value.trim().length === 0) {
                    setIsStarModifyOpen(false);
                } else {
                    swal({
                        title: "창을 닫을까요?",
                        text: "작성중인 게시글이 지워집니다!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            setIsStarModifyOpen(false);
                        }
                    });
                }
            }
        } else if (!check) {
            if (type === "regist") {
                setIsStarRegistOpen(false);
            } else if (type === "modify") {
                setIsStarModifyOpen(false);
            }
        }
    }

    return (
        <div className="star-regist-container absolute flex justify-center top-0 left-0 w-full h-full items-center font-['Pretendard'] bg-modal-outside z-23">
            <div className="star-regist bg-modal-bg text-black-sub flex rounded p-3 w-fit">
                <ImagePreviewArea preBoard={preBoard} type={type} />
                <div>
                    <div className="star-regist-middle w-96">
                        <div className="flex justify-between items-center mb-2">
                            <DateArea ref={dateRef} type={type} />
                            <AccessRangeArea
                                ref={accessRangeRef}
                                preBoard={preBoard}
                            />
                        </div>
                        <ContentArea ref={contentRef} />
                    </div>
                    <HashtagArea
                        hashtagSet={hashtagSet}
                        preBoard={preBoard}
                        type={type}
                    />
                    <div className="relative">
                        <FileUploadArea
                            ref={fileRef}
                            type={type}
                            preBoard={preBoard}
                        />
                        <Buttons
                            buttonValue={buttonValue}
                            type={type}
                            handleRegist={handleRegist}
                            handleClose={() => handleClose(true)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const ContentArea = forwardRef((props, ref) => {
    const [contentLength, setContentLength] = useState(0);

    useEffect(() => {
        setContentLength(ref.current.value.length);
    }, []);

    return (
        <>
            <div className="relative bg-alert-bg rounded-lg w-full h-44 border text-white-sub">
                <textarea
                    className="w-full h-36 bg-transparent resize-none p-2 border-transparent outline-none"
                    style={{ outlineColor: "transparent" }}
                    ref={ref}
                    placeholder="일기 내용을 입력해주세요."
                    onChange={() => {
                        setContentLength(ref.current.value.length);
                    }}
                    maxLength={200}
                />

                <div className="absolute text-white-sub bottom-1 right-2">
                    {contentLength} / 200자
                </div>
            </div>
        </>
    );
});

function Buttons(props) {
    const fileList = useRecoilValue(fileListState);
    const accessRange = useRecoilValue(accessRangeState);

    const buttonValue = props.buttonValue;
    const type = props.type;
    const handleRegist = props.handleRegist;
    const handleClose = props.handleClose;

    return (
        <div className="flex absolute right-0 top-0">
            <button
                className="h-8 w-14 px-2 shadow-md"
                onClick={(e) => {
                    handleRegist(e, fileList, accessRange);
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
    const preBoard = props.preBoard;

    useEffect(() => {
        return () => {
            setFileList([]);
        };
    }, []);

    function limitFileCnt(e, imageFileCnt, videoFileCnt) {
        const [maxImageCnt, maxVideoCnt] = [5, 1];

        const [remainImageFileCnt, remainVideoFileCnt] = [
            maxImageCnt - imageFileCnt,
            maxVideoCnt - videoFileCnt,
        ];

        let msg = "";
        if (remainImageFileCnt < 0) {
            msg += "이미지 파일은 최대 5개 까지 첨부 가능합니다.\n";
        }

        if (remainVideoFileCnt < 0) {
            msg += "비디오 파일은 최대 1개 까지 첨부 가능합니다.";
        }

        if (msg !== "") {
            swal({
                title: msg,
                icon: "error",
            });

            // IE에서 호환성 문제 있음
            return false;
        }
        return true;
    }

    function limitFileVolume(e, imageFileList, videoFileList) {
        const imageLimit = 1024 ** 2 * 5; // 5MB
        const videoLimit = 1024 ** 2 * 100; // 100MB

        const imageSizeCheck = [...imageFileList].some(
            (it) => it.size > imageLimit
        );
        const videoSizeCheck = [...videoFileList].some(
            (it) => it.size > videoLimit
        );

        if (imageSizeCheck || videoSizeCheck) {
            return false;
        }
        return true;
    }

    function fileTypeCheck(file) {
        const type = file.type.split("/")[0];
        return type === "image" || type === "video";
    }

    function handleFileChange(e) {
        // fileMap :
        const fileMap = new Map();
        [...fileList].forEach((it) => fileMap.set(it.name, it));
        [...ref.current.files].forEach((it) => fileMap.set(it.name, it));

        // 드래그로 파일 업로드할 경우
        if (e.dataTransfer) {
            [...e.dataTransfer.files].forEach((it) => fileMap.set(it.name, it));
        }

        const uploadFileList = [...fileMap.values()];

        const imageFileList = [...uploadFileList].filter(
            (it) => it.type.split("/")[0] === "image"
        );
        const videoFileList = [...uploadFileList].filter(
            (it) => it.type.split("/")[0] === "video"
        );

        let imageFileCnt = imageFileList.length;
        let videoFileCnt = videoFileList.length;

        if (preBoard) {
            preBoard.boardMedia.forEach((it) => {
                const url = it.split(".");
                const type = url[url.length - 1];

                EXTENSION_IMAGE.forEach((it) => {
                    if (it === type) {
                        imageFileCnt++;
                    }
                });

                EXTENSION_VIDEO.forEach((it) => {
                    if (it === type) {
                        videoFileCnt++;
                    }
                });
            });
        }
        console.log(imageFileCnt, videoFileCnt);

        // 파일 유효성 체크
        const fileTypeCheckRes = uploadFileList.every((it) =>
            fileTypeCheck(it)
        );
        const fileCntCheckRes = limitFileCnt(e, imageFileCnt, videoFileCnt);
        const fileVolumeCheckRes = limitFileVolume(
            e,
            imageFileList,
            videoFileList
        );

        if (fileCntCheckRes && fileVolumeCheckRes && fileTypeCheckRes) {
            setFileList([...uploadFileList]);
        }

        let msg = "";

        if (!fileTypeCheckRes) {
            msg += "이미지, 비디오 파일만 업로드 가능합니다.\n";
        }
        if (!fileCntCheckRes) {
            msg += "파일 업로드 허용 개수를 초과했습니다.\n";
        }
        if (!fileVolumeCheckRes) {
            msg += "파일의 용량이 허용 용량을 초과했습니다..\n";
        }

        if (msg) {
            swal({
                title: msg,
                icon: "success",
            });
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
                <input
                    className="absolute w-0 h-0 p-0 border-0 overflow-hidden"
                    type="file"
                    id="file"
                    multiple
                    onChange={handleFileChange}
                    ref={ref}
                />
                <label
                    className="text-white-sub flex items-center  hover:text-white hover:cursor-pointer"
                    for="file"
                >
                    <FaRegFileImage />
                    <div className="ml-1">파일 첨부</div>
                </label>
            </div>
            <div
                className="mt-3 border border-dashed text-white-sub h-40 flex justify-center items-center text-center hover:cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {fileList.length === 0 ? (
                    <div className="hover:text-white">
                        <FaFileImage className="w-full text-5xl" />
                        <div className="text-lg mt-2 text-center">
                            드래그하여 파일을 업로드해주세요.
                        </div>
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
    const fileNames = fileList.map((it) => {
        const nameArray = it.name.split(".");
        const extension = nameArray[nameArray.length - 1];

        let fileName = "";
        for (
            let i = 0;
            i < Math.min(it.name.length - (extension.length + 1), 20);
            i++
        ) {
            fileName += it.name[i];
        }

        if (fileName.length < it.name.length - (extension.length + 1)) {
            fileName += "...";
        }

        fileName += `.${extension}`;

        return fileName;
    });

    function handleClick(e, index) {
        e.stopPropagation();

        const tmp = [...fileList];
        tmp.splice(index, 1);
        setFileList(tmp);
    }
    return (
        <div className="text-left w-full h-full px-2 py-x ">
            {fileNames.map((it, index) => (
                <div className="flex  items-center " key={index}>
                    <div className=" flex ">
                        <div>- </div>
                        <div>{it}</div>{" "}
                    </div>
                    <div
                        className="ml-1 mt-1 hover:cursor-pointer text-red-500 hover:text-red-400"
                        onClick={(e) => handleClick(e, index)}
                    >
                        <MdOutlineCancel />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ImagePreviewArea(props) {
    const fileList = useRecoilValue(fileListState);

    const [previewFileList, setPreviewFileList] = useState([]);
    const [curPage, setCurPage] = useState(0);
    const areaRef = useRef();

    const data = props.preBoard;

    useEffect(() => {
        const tmpList = [
            ...fileList.map((it) => {
                const url =
                    URL.createObjectURL(it) + "_" + it.type.split("/")[0];

                return url;
            }),
        ];

        if (props.type === "modify") {
            const existData = data.boardMedia.map((it) => {
                let extension;

                let url = it.split(".");
                let type = url[url.length - 1];

                if (EXTENSION_IMAGE.has(type)) {
                    extension = "image";
                }

                if (EXTENSION_VIDEO.has(type)) {
                    extension = "video";
                }

                return it + "_" + extension;
            });

            tmpList.splice(tmpList.length - 1, 0, ...existData);
        }

        setPreviewFileList(tmpList);
    }, [fileList]);

    useEffect(() => {
        if (areaRef.current) {
            areaRef.current.style.transform = `translateX(${-curPage * 32}rem)`;
        }
    }, [curPage]);

    function handleLeft() {
        if (curPage <= 0) return;
        setCurPage(curPage - 1);
    }

    function handleRight() {
        if (curPage >= previewFileList.length - 1) return;
        setCurPage(curPage + 1);
    }

    return (
        <>
            {fileList.length > 0 || (data && data.boardMedia.length > 0) ? (
                <div className="flex items-center top-12 rounded right-full p-5 mr-6 h-full bg-modal-bg">
                    <div className="flex relative overflow-hidden items-center w-pic">
                        <div
                            className="flex items-center h-pic transition-all"
                            ref={areaRef}
                        >
                            {previewFileList.map((it, index) => (
                                <div
                                    className="w-pic h-pic bg-black-sub flex items-center"
                                    key={index}
                                >
                                    {it.split("_")[1] === "image" ? (
                                        <img
                                            className="w-pic max-h-pic"
                                            src={it.split("_")[0]}
                                            key={index}
                                            alt="it"
                                        ></img>
                                    ) : null}
                                    {it.split("_")[1] === "video" ? (
                                        <video
                                            className="w-pic max-h-pic"
                                            src={it.split("_")[0]}
                                            controls
                                            autoPlay
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                        <FaChevronLeft
                            className="absolute left-0 h-20 w-8 mx-2 text-black-sub hover:text-black"
                            onClick={handleLeft}
                        />
                        <FaChevronRight
                            className="absolute right-0 h-20 w-8 mx-2 text-black-sub hover:text-black"
                            onClick={handleRight}
                        />
                    </div>
                </div>
            ) : null}
        </>
    );
}

const DateArea = forwardRef((props, ref) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [day, setDay] = useState();

    useEffect(() => {
        setYear(date.getFullYear());
        setMonth(date.getMonth() + 1);
        setDay(date.getDate());
        setIsCalendarOpen(false);
    }, [date]);

    const handleCalander = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    return (
        <div className="text-white-sub text-2xl mb-1 relative">
            <div
                onClick={handleCalander}
                className="flex items-center  hover:text-white hover:cursor-pointer"
            >
                <div className="mr-1">{`${year}년 ${month}월 ${day}일`}</div>
                <div className="hidden" ref={ref}>{`${year}-${
                    month >= 10 ? month : "0" + month
                }-${day >= 10 ? day : "0" + day}`}</div>
                <div>
                    <HiOutlinePencilSquare />
                </div>
            </div>
            {isCalendarOpen && (
                <Calendar
                    className={
                        "absolute p-1 top-10 bg-black-sub border border-white-sub rounded z-10"
                    }
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                />
            )}
        </div>
    );
});

const AccessRangeArea = forwardRef((props, ref) => {
    const setAccessReange = useSetRecoilState(accessRangeState);

    const [selectedRange, setSelectedRange] = useState(0);

    const accessRangeArr = ["전체 공개", "팔로워 공개", "비공개"];
    const accessRangeValueArr = ["OPEN", "PARTOPEN", "NOOPEN"];

    return (
        <div
            className="text-white-sub  hover:cursor-pointer relative w-24 text-center"
            onClick={() => {
                setSelectedRange((selectedRange + 1) % 3);
                setAccessReange(accessRangeValueArr[(selectedRange + 1) % 3]);
            }}
        >
            <div className="border border-white-sub p-1 rounded-lg ">
                {accessRangeArr.map((it, index) =>
                    selectedRange === index ? (
                        <div key={index} className="animate-fade-in">
                            {it}
                        </div>
                    ) : null
                )}
            </div>
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

            if (input.current.value.length > 10) {
                swal({
                    title: "해시태그의 길이는 10자를 초과할 수 없습니다.",
                    icon: "info",
                });
                return;
            }

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
            <div className="flex items-center flex-wrap mb-2 mt-1 w-96">
                {hashtagList.map((it, index) => (
                    <div
                        className="text-white-sub mr-3 hover:text-white hover:cursor-pointer flex items-center h-6"
                        key={index}
                        onClick={() => handleRemoveHashtag(it, index)}
                    >
                        <span className="mr-1">#</span>
                        <span>{it}</span>
                    </div>
                ))}
                {hashtagList.length < 10 && (
                    <div className="flex items-center h-6 text-white-sub">
                        <span className="text-white-sub mr-1 text-xl">#</span>
                        <input
                            className="rounded-none mr-3 my-1 w-32"
                            ref={input}
                            type="text"
                            onKeyDown={handleKeyDown}
                            placeholder="해시태그 10자 이하"
                            maxLength={10}
                        ></input>
                    </div>
                )}
            </div>
        </>
    );
};

export default StarRegist;
