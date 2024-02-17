import { atom } from 'recoil';

export const filterState = atom({
    key: 'filterState',
    default: [],
});

// 게시글 등록 모달
export const isStarRegistOpenState = atom({
    key: 'isStarRegistOpen',
    default: false,
});

// 게시글 수정 모달
export const isStarModifyOpenState = atom({
    key: 'isStarModifyOpen',
    default: false,
});

// 게시글 상세보기 모달
export const isStarDetailOpenState = atom({
    key: 'isStarDetailOpen',
    default: false,
});

// 게시글 삭제 알럿
export const isDeleteAlertOpenState = atom({
    key: 'isDeleteAlertOpen',
    default: false,
});

// 게시글 신고 알럿
export const isReportAlertOpenState = atom({
    key: 'isReportAlertOpen',
    default: false,
});

// 신고 상세보기 알럿
export const reportModalState = atom({
    key: 'reportModalState',
    default: '',
});

// 현재 PW 확인 알럿
export const isPwCheckOpenState = atom({
    key: 'isPwCheckOpenState',
    default: true,
});

// 댓글 리렌더링 atom
export const renewReplyState = atom({
    key: 'renewReply',
    default: false,
});

// 회원 정보 수정
export const isChangeInfoOpenState = atom({
    key: 'isChangeInfoOpen',
    default: false,
});

// 나의 별 목록
export const isMyStarListOpenState = atom({
    key: 'isMyStarListOpen',
    default: false,
});

// 좋아하는 별 목록
export const isFavorListOpenState = atom({
    key: 'isFavorListOpen',
    default: false,
});

// 팔로우/팔로워 목록
export const isFollowListOpenState = atom({
    key: 'isFollowListOpen',
    default: false,
});

// 다른 우주 찾기
export const isFindUserOpenState = atom({
    key: 'isFindUserOpen',
    default: false,
});

// 태그로 별 찾기
export const isTagSearchOpenState = atom({
    key: 'isTagSearchOpen',
    default: false,
});

// 환경 설정
export const isSettingOpenState = atom({
    key: 'isSettingOpen',
    default: false,
});

// 알림 상세보기
export const isAlarmDetailState = atom({
    key: 'isAlarmDeatil',
    default: false,
});

// 신고목록
export const isReportOpenState = atom({
    key: 'isReportOpen',
    default: false,
});

// 게시글 없는 유저 알림말
export const isGuideCommentOpenState = atom({
    key: 'isGuideCommentOpen',
    default: false,
});

// 신고 상세보기
export const isReportDetailOpenState = atom({
    key: 'isReportDetailOpen',
    default: '',
});

// 의견 보내기
export const isOpinionOpenState = atom({
    key: 'isOpinionOpen',
    default: false,
});

export const isAlarmOpenState = atom({
    key: 'isAlarmOpen',
    default: false,
});

// 별자리 정보
export const isConstellationInfoOpenState = atom({
    key: "isConstellationInfoOpen",
    default: false,
});
