import { atom } from "recoil";

export const filterState = atom({
  key: "filterState",
  default: [],
});

// API로 받아온 전체 데이터를 관리하는 atom
export const listState = atom({
  key: "listState",
  default: [],
});

// 게시글 등록 모달
export const isStarRegistOpenState = atom({
  key: "isStarRegistOpen",
  default: false,
});

// 게시글 수정 모달
export const isStarModifyOpenState = atom({
  key: "isStarModifyOpen",
  default: false,
});

// 게시글 수정 후 Detail 리렌더링
export const renewStarDetailState = atom({
  key: "renewStarDetail",
  default: false,
});

// 게시글 상세보기 모달
export const isStarDetailOpenState = atom({
  key: "isStarDetailOpen",
  default: false,
});

// 게시글 삭제 알럿
export const isDeleteAlertOpenState = atom({
  key: "isDeleteAlertOpen",
  default: false,
});

// 게시글 신고 알럿
export const isReportAlertOpenState = atom({
  key: "isReportAlertOpen",
  default: false,
});

// 신고 상세보기 알럿
export const reportModalState = atom({
  key: "reportModalState",
  default: "",
});

// 댓글 리렌더링 atom
export const renderReplyState = atom({
  key: "renderReply",
  default: false,
});
