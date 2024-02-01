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

export const isStarRegistOpenState = atom({
    key: 'isStarRegistOpen',
    default: -1,
});

export const isStarDetailOpenState = atom({
    key: 'isStarDetailOpen',
    default: [],
})