import { atom } from 'recoil';

export const filterState = atom({
    key: 'filterState',
    default: [],
});

// API로 받아온 전체 데이터를 관리하는 atom
export const listState = atom({
    key: 'listState',
    default: [],
});

// 게시글 등록 모달
export const isStarRegistOpenState = atom({
    key: 'isStarRegistOpen',
    default: -1,
});

// 게시글 상세보기 모달
export const isStarDetailOpenState = atom({
    key: 'isStarDetailOpen',
    default: [],
})

// 게시글 삭제 알럿
export const isDeleteAlertOpenState = atom({
    key: "isDeleteAlertOpen",
    default: false,
  })
  
// 게시글 신고 알럿
export const isReportAlertOpenState = atom({
    key: "isReportAlertOpen",
    default: false,
})

// 댓글 리렌더링 atom
export const renderReplyState = atom({
    key: "renderReply",
    default: false,
})