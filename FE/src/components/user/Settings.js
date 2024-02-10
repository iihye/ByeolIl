import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiRadioFill } from 'react-icons/pi';
import { Slider } from '@/components/ui/slider';
import { SliderRange, SliderThumb } from '@radix-ui/react-slider';
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

    const handleOption = (e) => {
        const currentRadioState = e.target.value;

        axios
            .put(
                `${process.env.REACT_APP_API_URL}/member`,
                {
                    memberIndex: memberIndex,
                    memberRadioStatus: currentRadioState,
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
            .catch((e) => {
                console.log(e);
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
    });

    return (
        <div className="outside w-full h-full absolute top-0 left-0 flex justify-center items-center z-10 bg-modal-outside">
            <Card className="Settings w-3/12 bg-modal-bg text-white-sub px-6 py-6 rounded-component">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                        <IoSettingsOutline className="mr-1" />
                        환경설정
                    </CardTitle>
                </CardHeader>
                <div></div>
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
                            defaultValue={[1]}
                            max={2}
                            step={1}
                        />
                        <div className="w-1/6 ml-2 font-['Pre-bold'] ">
                            과거
                        </div>
                    </div>

                    <div className="flex justify-between px-16">
                        {/* {options.map((option) => {
                        return (
                            <button
                                className="mr-1 px-2 py-2 mb-2 rounded-custom font-['Pre-Light']"
                                onClick={handleOption}
                                value={option.value}
                            >
                                {option.name}
                            </button>
                        );
                    })} */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Settings;
