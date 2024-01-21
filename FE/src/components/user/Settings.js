import React, { useState } from 'react';
import axios from 'axios';

function Settings() {
    const options = [
        { name: '흐린', value: 'OLD' },
        { name: '아련한', value: 'OLD' },
        { name: '어렴풋한', value: 'OLD' },
    ];

    const [settingValue, setSettingValue] = useState('');

    // userIndex, options value는 실제 API 완성되면 수정
    const handleOption = (e) => {
        axios
            .put('https://7e030bec-d09a-467e-93a6-3b1848ed02c4.mock.pstmn.io/user/setting', {
                userIndex: '1',
                userRadio: e.target.value,
            })
            .then((response) => {
                const result =
                    response.data.response === 'success' && response.status === 200 ? '변경 성공' : '변경 실패';
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
