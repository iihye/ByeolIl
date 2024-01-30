import { atom } from 'recoil';

export const userIndexState = atom({
    key: 'userIndexState',
    default: '',
});

export const userInfoState = atom({
    key: 'userInfoState',
    default: {
        memberAlarmStatus: 'ACCEPT',
        memberBanDate: null,
        memberBirth: [],
        memberDeletedYN: 'N',
        memberEmail: '',
        memberId: '',
        memberName: '',
        memberNickName: '',
        memberPlatform: '',
        memberRadioStatus: 'OLDEST',
        memberRegDate: [],
    },
});

export const filterState = atom({
    key: 'filterState',
    default: [],
});

// API로 받아온 전체 데이터를 관리하는 atom
export const listState = atom({
    key: 'listState',
    default: [],
});
