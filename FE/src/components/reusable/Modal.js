import axios from "axios";
import StarDeleteAlert from "components/star/StarDeleteAlert";
import StarReplyList from "components/star/StarReplyList";
import StarReportAlert from "components/star/StarReportAlert";
import { isStarDetailOpenState, isStarRegistOpenState } from 'components/atom';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isDeleteAlertOpenState, isReportAlertOpenState, isStarModifyOpenState, renderReplyState } from "components/atom";
import "./Modal.css";

// type: "radio", "star", "report"
function Modal(props) {
    return (
        <div className="modal-container">
            <div className="modal" style={{ border: '1px solid black', margin: '5px' }}>
                {props.type === 'radio' ? (
                    <RadioContent />
                ) : (
                    <StarContent
                        type={props.type}
                        reportInfo={props.reportInfo}
                        starIndex={props.starIndex}
                        userIndex={props.userIndex}
                    />
                )}
            </div>
        </div>
    );
}

function StarContent({ type,  reportInfo, starIndex, userIndex }) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useRecoilState(isDeleteAlertOpenState);
  const [isReportAlertOpen, setIsReportAlertOpen] = useRecoilState(isReportAlertOpenState);
  const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
  const setIsStarModifyOpen = useSetRecoilState(isStarModifyOpenState);


    const [data, setData] = useState(null);
    const [likeData, setLikeData] = useState([]);

    const memberIndex = Number(localStorage.getItem('memberIndex'));

    const replyInputRef = useRef();

    useEffect(() => {
        const fetchData = async (starIndex) => {
            await axios
                .get(`${process.env.REACT_APP_API_URL}/board/${starIndex}`, {
                    headers: {
                        token: localStorage.getItem('token') ?? '',
                    },
                })
                .then((response) => {
                    const data = response.data;
                    data.boardInputDate = data.boardInputDate.split('.');
                    data.boardUpdateDate = data.boardUpdateDate
                        .split(' ')[0]
                        .split('.');

                    setData(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        fetchData(starIndex);
    }, []);

    const handleDelete = () => {
        /* 삭제하시겠습니까 alert 띄우기 */
        setIsDeleteAlertOpen(true);
    };

    const handleReport = () => {
        /* 신고 내용 입력 alert 출력 */
        setIsReportAlertOpen(true);
    };

    

  const handleModify = () => {
    setIsStarModifyOpen({...data});
  };

    const handleLike = async () => {
        /* 게시글 좋아요 Req */
        const data = {
            boardIndex: starIndex,
            memberIndex: Number(localStorage.getItem('memberIndex')),
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/board/like`,
                data,
                {
                    headers: {
                        token: localStorage.getItem('token'),
                    },
                }
            );

            if (response.request.status === 200) {
                console.log('좋아요 성공');
            } else {
                console.log('좋아요 실패');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRegistReply = async () => {
        /* 댓글 작성 Req */
        const data = {
            boardIndex: starIndex,
            memberIndex: memberIndex,
            commentContent: replyInputRef.current.value.trim(),
        };
        console.log(data);
        if (data.commentContent === '') {
            alert('내용을 입력해주세요.');
            return;
        }

        await axios
            .post(`${process.env.REACT_APP_API_URL}/comment/`, data, {
                header: {
                    token: localStorage.getItem('token'),
                },
            })
            .then((response) => {
                if (response.data.map.response === 'success') {
                    console.log('댓글 등록 성공');
                } else {
                    console.log('댓글 등록 실패');
                }
            })
            .catch((error) => console.log(error));
    };

    const handleBlock = () => {
        /* 정말 차단할까요 alert 띄우기 */
    };

    const handleClose = () => {
      console.log("SDFSDF");
        /* 모달 닫기 */
        setIsDeleteAlertOpen(false);
        setIsReportAlertOpen(false);
        setIsStarDetailOpen([]);
        // setReportModal('');
    };

    /* 게시글 작성자 체크*/
    const isWriter = () => {
        return userIndex === localStorage.getItem('memberIndex');
    };

    /* 로그인 체크 */
    const isLogin = () => {
        return localStorage.getItem('token') ? true : false;
    };

    return (
        <>
            <div className="star-content">
                {/* 최상단 */}
                <div className="star-content-top">
                    {/* 지정일 */}
                    <div>
                        {data
                            ? `${data.boardInputDate[0]}년 ${data.boardInputDate[1]}월 ${data.boardInputDate[2]}일`
                            : '로딩중'}
                    </div>
                    {/* 작성일(수정일) */}
                    <div>
                        {data
                            ? `${data.boardUpdateDate[0]}년 ${data.boardUpdateDate[1]}월 ${data.boardUpdateDate[2]}일`
                            : '로딩중'}
                    </div>
                </div>
                <div className="star-content-content">
                    {/* 이미지 영역 */}
                    <div style={{ display: 'flex' }}>
                        {data &&
                            data.boardMedia.map((i, index) => (
                                <div key={index}>이미지 {index}</div>
                            ))}
                    </div>
                    {/* 게시글 내용 */}
                    <div>{data ? data.boardContent : '로딩중'}</div>
                </div>
                <div>
                    {/* 해시태그 */}
                    <div style={{ display: 'flex' }}>
                        {data
                            ? data.hashContent.map((i, idx) => (
                                <div key={idx}>{i}</div>
                            ))
                            : '로딩중'}
                    </div>
                </div>
                {type === 'report' ? (
                    <div>{reportInfo && reportInfo.reportContent}</div>
                ) : null}
                <div>
                    {/* 댓글 리스트 영역 */}
                    <StarReplyList boardIndex={starIndex} />
                </div>
            </div>
            <div>
                {/* 최하단 */}
                {type === 'star' ? (
                    <div>
                        {/* 댓글 작성 영역 */}
                        {isLogin() && (
                            <>
                                <input ref={replyInputRef} />
                                <button onClick={handleRegistReply}>등록</button>
                            </>
                        )}
                    </div>
                ) : null}
                <div>
                    {/* 최하단 */}
                    {type === 'star' ? (
                        <>
                            <button onClick={handleLike}>LIKE</button>
                            <button onClick={handleReport}>REPORT</button>
                            {isWriter() && (
                                <>
                                    <button onClick={handleDelete}>DELETE</button>
                                    <button onClick={handleModify}>MODIFY</button>
                                </>
                            )}
                        </>
                    ) : (
                        <button onClick={handleBlock}>차단</button>
                    )}
                    <button onClick={handleClose}>CLOSE</button>
                </div>
            </div>
            <div className="alert">
                {isDeleteAlertOpen && (
                    <StarDeleteAlert
                        boardIndex={starIndex}
                        userIndex={memberIndex}
                    />
                )}
                {isReportAlertOpen && (
                    <StarReportAlert
                        boardIndex={starIndex}
                        userIndex={memberIndex}
                    />
                )}
            </div>
        </>
    );
}

// const ReplyRegistArea = forwardRef((props, ref) => {

function ReplyRegistArea (props){

  const inputRef = useRef();

  const [renderReply, setRenderReply] = useRecoilState(renderReplyState);

  const handleRegistReply = async () => {

    const data = {
      boardIndex: props.starIndex,
      memberIndex: props.memberIndex,
      commentContent: inputRef.current.value.trim(),
    }

    if (data.commentContent === ""){
      alert("내용을 입력해주세요.");
      return;
    }
    console.log(data);
    await axios.post(`${process.env.REACT_APP_API_URL}/comment/`,data,
    {
      header: {
        token: localStorage.getItem('token'),
      },
    })
    .then((response) => {
      
      if(response.data.map.response === 'success'){
        setRenderReply(!renderReply);
        console.log("댓글 등록 성공");
      } else {
        console.log("댓글 등록 실패");
      }

    })
    .catch((error) => console.log(error));
  };

  return (
    <>
      <input ref={inputRef}/>
      <button onClick={handleRegistReply}>등록</button>
    </>
  )
}



function RadioContent() {
    const [data, setData] = useState(null);

    // useEffect(() => {

    // }, []);

    return (
        <div>
            <div>
                {/*라디오 모달 상단 헤더 */}
                <div>n년 n월 n일</div>
                <button>REPORT</button>
                <button>CLOSE</button>
            </div>
            <div>
                {/*라디오 내용 */}
                <div>{data ? data.boardContent : '로딩중'}</div>
            </div>
            <div>
                <button>PLAY</button>
                <button>재송신하기</button>
            </div>
        </div>
    );
}

export default Modal;
