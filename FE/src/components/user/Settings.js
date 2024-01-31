import React, { useState } from 'react';
import axios from 'axios';

function Settings() {
    const options = [
        { name: '흐린', value: 'OLD' },
        { name: '아련한', value: 'OLDER' },
        { name: '어렴풋한', value: 'OLDEST' },
    ];

    const [settingValue, setSettingValue] = useState('');
    const memberIndex = localStorage.getItem('memberIndex');

    const handleOption = (e) => {
        axios
            .put(
                `${process.env.REACT_APP_API_URL}/member`,
                {
                    memberIndex: memberIndex,
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
