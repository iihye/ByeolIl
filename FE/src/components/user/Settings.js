import React, { useState } from 'react';
import axios from 'axios';
import { userIndexState } from '../atom';
import { useRecoilValue } from 'recoil';

function Settings() {
    const options = [
        { name: '흐린', value: 'OLD' },
        { name: '아련한', value: 'OLD' },
        { name: '어렴풋한', value: 'OLD' },
    ];

    const [settingValue, setSettingValue] = useState('');
    const userIndexValue = useRecoilValue(userIndexState);

    // userIndex, options value는 실제 API 완성되면 수정
    const handleOption = (e) => {
        axios
            .put(
                `${process.env.REACT_APP_API_URL}/member`,
                {
                    memberIndex: userIndexValue,
                    memberRadioStatus: e.target.value,
                },
                {
                    headers: {
                        token: localStorage.getItem('token') ?? '',
                    },
                }
            )
            .then((response) => {
                const result =
                    response.data.message === 'success' &&
                    response.status === 200
                        ? '변경 성공'
                        : '변경 실패';
                setSettingValue(result);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div className="Settings">
            <div>환경설정</div>
            <div>
                {options.map((option) => {
                    return (
                        <button onClick={handleOption} value={option.value}>
                            {option.name}
                        </button>
                    );
                })}
                <div>{settingValue}</div>
            </div>
        </div>
    );
}

export default Settings;
