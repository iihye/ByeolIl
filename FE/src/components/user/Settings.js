import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiRadioFill } from 'react-icons/pi';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router';

function Settings() {
    const navigate = useNavigate();

    const options = [
        { name: '흐린', value: 'OLD' },
        { name: '아련한', value: 'OLDER' },
        { name: '어렴풋한', value: 'OLDEST' },
    ];

    const [settingValue, setSettingValue] = useState('');
    const memberIndex = sessionStorage.getItem('memberIndex');
    const userToken = sessionStorage.getItem('token');

    // 슬라이더 값에 따른 처리 함수
    const handleSliderChange = (valueArray) => {
        const sliderValue = valueArray[0]; // 슬라이더는 하나의 값만 반환
        const selectedOption = options[sliderValue]; // 슬라이더 값에 해당하는 옵션 선택

        axios
            .put(
                `${process.env.REACT_APP_API_URL}/member`,
                {
                    memberIndex: memberIndex,
                    memberRadioStatus: selectedOption.value,
                },
                {
                    headers: {
                        token: userToken,
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
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();

            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                navigate(-1);
            }
        }

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [navigate]);

    return (
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
            <Card className="Settings w-3/12 bg-modal-bg text-white-sub px-6 py-6 rounded-component">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                        <IoSettingsOutline className="mr-1" />
                        환경설정
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex font-['Pre-bold'] mb-2">
                        <PiRadioFill
                            size="24"
                            className="pr-2 text-btn-bg-hover"
                        />
                        라디오 수신 범위 설정
                    </div>
                    <div className="flex justify-between pl-2 pr-2 mb-2">
                        <div className="w-1/6 mr-2 font-['Pre-bold']">최근</div>
                        <Slider
                            className="Settings-Slider flex-grow"
                            defaultValue={[0]} // 기본값을 options 배열의 첫 번째 요소에 맞춤
                            max={options.length - 1} // 최대값을 options 배열의 마지막 요소에 맞춤
                            step={1}
                            onValueChange={handleSliderChange} // 슬라이더 값이 변경될 때 호출될 함수
                        />
                        <div className="w-1/6 ml-2 font-['Pre-bold']">과거</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Settings;
