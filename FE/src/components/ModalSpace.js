import { useRecoilValue } from "recoil";
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
        </>
    );
}

function StarRegistArea() {
    const isStarRegistOpen = useRecoilValue(isStarRegistOpenState);

    return (
        <>
            {isStarRegistOpen && (
                <StarRegist type={"regist"} location={isStarRegistOpen[0]} writerIndex={isStarRegistOpen[1]} />
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

    return <>{isStarDetailOpen && <StarDetail starIndex={isStarDetailOpen[0]} userIndex={isStarDetailOpen[1]} />}</>;
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

export default ModalSpace;
