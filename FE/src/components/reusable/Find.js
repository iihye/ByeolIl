import { useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GrUserAdmin } from 'react-icons/gr';
import swal from 'sweetalert';
/**
 *
 * @param {String} toFind ID or PW
 * @returns
 */
function Find({ toFind }) {
    const email = useRef();
    const ID = useRef();
    const membername = useRef();
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleClick = (toFind) => {
        if (isButtonClicked) {
            setIsButtonClicked(true);
        }

        setTimeout(() => {
            setIsButtonClicked(false);
        }, 3000);

        if (toFind === 'ID') {
            reqFindID();
        } else if (toFind === 'PW') {
            reqFindPW();
        }
    };

    // ID 찾기 : 이름과 메일을 알려주면 일치하는 아이디를 바로 넘겨준다.
    function reqFindID() {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/member/find/id?name=${membername.current.value}&email=${email.current.value}`
            )
            .then((response) => {
                if (response.status === 200) {
                    swal({
                        title: '아이디 찾기 성공!',
                        text: `ID는 ${response.data.id} 입니다`,
                        icon: 'info',
                    });
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    swal({
                        title: '아이디를 찾을 수 없습니다',
                        text: '이름과 이메일을 다시 확인해주세요',
                        icon: 'error',
                    });
                }
            });
    }

    // PW 찾기 : 이름 아이디 메일 알려주면 해당 메일로 비밀번호 전송
    function reqFindPW() {
        const data = {
            memberId: ID.current.value,
            memberName: membername.current.value,
            memberEmail: email.current.value,
        };

        axios
            .post(`${process.env.REACT_APP_API_URL}/member/find/pass`, data)
            .then((response) => {
                swal({
                    title: response.data.message,
                    icon: 'success',
                });
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    swal({
                        title: '일치하는 회원정보를 찾을 수 없습니다',
                        text: '입력한 정보를 다시 확인해주세요',
                        icon: 'error',
                    });
                }
            });
    }

    return (
        <div>
            <Card className="Find w-96 h-max card-contain-style bg-modal-bg text-white-sub px-6 py-6 rounded-component">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-start items-center font-['Pre-Bold'] text-2xl mb-8">
                        <GrUserAdmin className="mr-1" />
                        <div>
                            {toFind === 'ID' ? '아이디' : '비밀번호'} 찾기
                        </div>
                    </CardTitle>
                </CardHeader>
                <div></div>
                <CardContent>
                    <div className="mb-4">
                        <label className="regist-label">
                            가입시 입력한 이메일을 입력해주세요
                        </label>
                        <input className="find-input" ref={email} />
                    </div>

                    <div className="mb-4">
                        <label className="regist-label">
                            가입시 입력한 이름을 입력해주세요
                        </label>
                        <input className="find-input" ref={membername} />
                    </div>

                    <div className="mb-4">
                        {toFind === 'PW' ? (
                            <label className="regist-label">
                                사용 중인 아이디를 입력해주세요
                            </label>
                        ) : null}
                        {toFind === 'PW' ? (
                            <div>
                                <input className="find-input" ref={ID} />
                            </div>
                        ) : null}
                    </div>

                    <div>
                        <button
                            className="regist-button w-full h-button mt-2 px-2 mb-2"
                            onClick={() => {
                                handleClick(toFind);
                            }}
                        >
                            인증하기
                        </button>
                    </div>

                    <div className="font-['Pre-Bold'] relative flex place-content-evenly text-s my-3">
                        <div>
                            {toFind === 'PW' ? (
                                <Link to={'/landing/findId'}>아이디 찾기</Link>
                            ) : (
                                <Link to={'/landing/findPw'}>
                                    비밀번호 찾기
                                </Link>
                            )}
                        </div>
                        <div>
                            <Link to={'/landing/regist'}>회원가입</Link>
                        </div>
                        <div>
                            <Link to={'/landing/login'}>로그인</Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Find;
