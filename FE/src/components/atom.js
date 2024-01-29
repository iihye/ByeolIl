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
