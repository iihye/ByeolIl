import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
    isStarRegistOpenState,
    isStarModifyOpenState,
    isStarDetailOpenState,
    isDeleteAlertOpenState,
    isReportAlertOpenState,
    reportModalState,
    isChangeInfoOpenState,
    isMyStarListOpenState,
    isFavorListOpenState,
    isFollowListOpenState,
    isFindUserOpenState,
    isTagSearchOpenState,
    isSettingOpenState,
    isReportOpenState,
    isGuideCommentOpenState,
    isOpinionOpenState,
    isConstellationInfoOpenState,
    isAlarmOpenState,
} from "./atom";
import StarRegist from "./star/StarRegist";
import StarDetail from "./star/StarDetail";
import ChangeInfo from "./user/ChangeInfo";
import List from "./reusable/List";
import StarFavorList from "./star/StarFavorList";
import FollowList from "./user/FollowList";
import FindUser from "./user/FindUser";
import StarTagSearch from "./star/StarTagSearch";
import Settings from "./user/Settings";
import Report from "./admin/Report";
import { GuideComment } from "./user/UserSpace";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { constellationInfo } from "data";
import Alarm from "./user/Alarm";

function ModalSpace() {
    return (
        <>
            <StarRegistArea />
            <StarDetailArea />
            <StarModifyArea />
            <ChangeInfoArea />
            <MyStarListArea />
            <FavorListArea />
            <FollowListArea />
            <FindUserArea />
            <TagSearchArea />
            <SettingArea />
            <ReportArea />
            {/* <GuideCommentArea /> */}
            <OpinionArea />
            <ConstellationInfoArea />
            <AlarmArea />
        </>
    );
}

function StarRegistArea() {
    const isStarRegistOpen = useRecoilValue(isStarRegistOpenState);

    return (
        <>
            {isStarRegistOpen && (
                <StarRegist
                    type={"regist"}
                    location={isStarRegistOpen[0]}
                    writerIndex={isStarRegistOpen[1]}
                />
            )}
        </>
    );
}

function StarModifyArea() {
    // [data, starIndex, location. loginUserIndex]
    const isStarModifyOpen = useRecoilValue(isStarModifyOpenState);

    return (
        <>
            {isStarModifyOpen && (
                <StarRegist
                    type={"modify"}
                    preBoard={isStarModifyOpen[0]}
                    boardIndex={isStarModifyOpen[1]}
                    location={isStarModifyOpen[2]}
                    writerIndex={isStarModifyOpen[3]}
                />
            )}
        </>
    );
}

function StarDetailArea() {
    const isStarDetailOpen = useRecoilValue(isStarDetailOpenState);

    return (
        <>
            {isStarDetailOpen && (
                <StarDetail
                    starIndex={isStarDetailOpen[0]}
                    userIndex={isStarDetailOpen[1]}
                />
            )}
        </>
    );
}

function ChangeInfoArea() {
    const isChangeInfoOpen = useRecoilValue(isChangeInfoOpenState);

    return <>{isChangeInfoOpen && <ChangeInfo />}</>;
}

function MyStarListArea() {
    const isMyStarListOpen = useRecoilValue(isMyStarListOpenState);

    return <>{isMyStarListOpen && <List />}</>;
}

function FavorListArea() {
    const isFavorListOpen = useRecoilValue(isFavorListOpenState);

    return <>{isFavorListOpen && <StarFavorList />}</>;
}

function FollowListArea() {
    const isFollowListOpen = useRecoilValue(isFollowListOpenState);

    return <>{isFollowListOpen && <FollowList />}</>;
}

function FindUserArea() {
    const isFindUserOpen = useRecoilValue(isFindUserOpenState);

    return <>{isFindUserOpen && <FindUser />}</>;
}

function TagSearchArea() {
    const isTagSearchOpen = useRecoilValue(isTagSearchOpenState);

    return <>{isTagSearchOpen && <StarTagSearch />}</>;
}

function SettingArea() {
    const isSettingOpen = useRecoilValue(isSettingOpenState);

    return <>{isSettingOpen && <Settings />}</>;
}

function ReportArea() {
    const isReportOpen = useRecoilValue(isReportOpenState);
    return <>{isReportOpen && <Report />}</>;
}

function AlarmArea() {
    const isAlarmOpen = useRecoilValue(isAlarmOpenState);
    return <>{isAlarmOpen && <Alarm />}</>;
}

// function GuideCommentArea() {
//     const isGuideCommentOpen = useRecoilValue(isGuideCommentOpenState);
//     return <>{isGuideCommentOpen && <GuideComment />}</>;
// }

function OpinionArea() {
    const isOpinionOpen = useRecoilValue(isOpinionOpenState);

    return <>{isOpinionOpen && <OpinionAlert />}</>;
}

function OpinionAlert() {
    const [isOpinionOpen, setIsOpinionOpen] =
        useRecoilState(isOpinionOpenState);

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();
            const check = [...e.target.classList].some(
                (it) => it === "outside"
            );
            if (check) {
                if (input.current.value.length > 0) {
                    swal({
                        title: "창을 닫을까요?",
                        text: "작성 중인 내용을 잃을 수 있어요!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            setIsOpinionOpen(false);
                        }
                    });
                } else {
                    setIsOpinionOpen(false);
                }
            }
        }

        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);
    const input = useRef();
    async function handleSubmit() {
        const data = {
            memberIndex: isOpinionOpen,
            opinionText: input.current.value.trim(),
        };

        await axios
            .post(`${process.env.REACT_APP_API_URL}/opinion/add`, data, {
                headers: {
                    token: sessionStorage.getItem("token"),
                },
            })
            .then((response) => {
                console.log(response);
                swal({
                    title: "의견 전송 완료",
                    text: "소중한 의견 감사드립니다!",
                    icon: "success",
                }).then(() => setIsOpinionOpen(false));
            })
            .catch((error) => console.log(error));
    }
    function handleClose() {
        if (input.current.value.length > 0) {
            swal({
                title: "창을 닫을까요?",
                text: "작성 중인 내용을 잃을 수 있어요!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    setIsOpinionOpen(false);
                }
            });
        } else {
            setIsOpinionOpen(false);
        }
    }

    return (
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
            <div className="w-auto h-auto p-4 bg-alert-bg rounded-xl text-white-sub shadow-xl font-['Pretendard'] text-center">
                <div>의견 보내기</div>
                <div className="text-lg text-center mb-3">
                    "별일" 서비스는 어떠신가요?
                </div>
                <div className="flex justify-center mb-3">
                    <textarea
                        className="bg-transparent rounded-lg p-2 h-28 w-80 resize-none border border-gray-300"
                        maxLength="80"
                        ref={input}
                    />
                </div>
                <div className="flex justify-center gap-5 px-28">
                    <button
                        className="h-8 px-2"
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        보내기
                    </button>
                    <button
                        className="h-8 px-2"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConstellationInfoArea() {
    const isConstellationInfoOpen = useRecoilValue(
        isConstellationInfoOpenState
    );
    const [name, setName] = useState();
    const ref = useRef();

    useEffect(() => {
        if (isConstellationInfoOpen !== false) {
            setName(constellationInfo[isConstellationInfoOpen]);
        }
    }, [isConstellationInfoOpen]);

    return (
        <div className="absolute bottom-10 left-0 w-full h-fit  text-white-sub  flex justify-center items-center animate-fade-in font-['Star'] text-4xl">
            <div
                className={`transition-all duration-300 ${
                    isConstellationInfoOpen !== false
                        ? "opacity-100"
                        : "opacity-0"
                }`}
                ref={ref}
            >
                {name + " 자리"}
            </div>
        </div>
    );
}
export default ModalSpace;
