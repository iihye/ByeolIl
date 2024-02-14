import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiRadioFill } from 'react-icons/pi';
import { Slider } from '@/components/ui/slider';
import { useResetRecoilState } from 'recoil';
import { isSettingOpenState } from 'components/atom';
import swal from 'sweetalert';

function Settings() {
    const resetIsSettingOpen = useResetRecoilState(isSettingOpenState);

    const options = ['OLD', 'OLDER', 'OLDEST'];
    const [initOption, setInitOption] = useState(null);
    const memberIndex = sessionStorage.getItem('memberIndex');
    const userToken = sessionStorage.getItem('token');

    useEffect(() => {
        // 유저 정보 가져오기
        const getUserIndex = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/member/info/mine`,
                    {
                        headers: {
                            token: sessionStorage.getItem('token'),
                        },
                    }
                );

                const memberRadioStatus = response.data.memberRadioStatus;
                console.log('라디오 상태', memberRadioStatus);

                // option에서 selectedOption과 일치하는 배열 index 가져오기 (초기값 세팅)

                const result = options.findIndex(
                    (it) => it === memberRadioStatus
                );

                setInitOption(result);
            } catch (error) {
                console.log('회원정보 가져오기 실패', error);
            }
        };

        getUserIndex();
    }, []);

    // 슬라이더 값에 따른 처리 함수
    const handleSliderChange = (valueArray) => {
        const sliderValue = valueArray[0]; // 슬라이더는 하나의 값만 반환
        const selectedOption = options[sliderValue]; // 슬라이더 값에 해당하는 옵션 선택

        if (selectedOption) {
            axios
                .put(
                    `${process.env.REACT_APP_API_URL}/member`,
                    {
                        memberIndex: memberIndex,
                        memberRadioStatus: selectedOption,
                    },
                    {
                        headers: {
                            token: userToken,
                        },
                    }
                )
                .then(() => {
                    swal({
                        title: '라디오 범위 설정 완료!',
                        icon: 'success',
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        function handleClick(e) {
            e.stopPropagation();

            const check = [...e.target.classList].some(
                (it) => it === 'outside'
            );
            if (check) {
                resetIsSettingOpen();
            }
        }

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
            <Card className="Settings w-96 bg-modal-bg text-white-sub px-6 py-6 rounded-component">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                        <IoSettingsOutline className="mr-1" />
                        환경설정
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {initOption !== null ? (
                        <>
                            <div className="flex font-['Pre-bold']">
                                <PiRadioFill
                                    size="24"
                                    className="pr-2 text-btn-bg-hover"
                                />
                                라디오 수신 범위 설정
                            </div>
                            <div className="font-['Pre-Light'] pl-6 text-sm mb-2">
                                슬라이더를 조절하여 범위를 설정해주세요😊
                            </div>
                            <div className="flex justify-between pl-2 pr-2 mb-2">
                                <div className="w-2/6 mr-3 font-['Pre-bold'] text-right">
                                    최근
                                </div>
                                <Slider
                                    className="Settings-Slider flex-grow"
                                    defaultValue={[initOption]} // 기본값
                                    max={options.length - 1} // 최대값을 options 배열의 마지막 요소에 맞춤
                                    step={1}
                                    onValueChange={handleSliderChange} // 슬라이더 값이 변경될 때 호출될 함수
                                />
                                <div className="w-2/6 ml-3 font-['Pre-bold'] text-left">
                                    과거
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>Loading..</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Settings;
