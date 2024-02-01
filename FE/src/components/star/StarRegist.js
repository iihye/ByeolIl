import { useEffect, useRef, useState, forwardRef } from "react";
import { isAddedStar, starsState, curPageState } from "components/user/UserSpace";
import { isStarRegistOpenState } from 'components/atom';

import axios from 'axios';
import { useParams } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";

function StarRegist (props){
    const params = useParams();
    const curPage = useRecoilValue(curPageState);
    const setStars = useSetRecoilState(starsState);
    const setIsStarRegistOpen = useSetRecoilState(isStarRegistOpenState);

    const type = props.type;
    const location = props.location;
    
    const buttonValue = {
        regist: "등록",
        modify: "수정",
    }

    const [media, setMedia] = useState([]);
    const [inputDate, setInputDate] = useState();

    const accessRangeRef = useRef();
    const dateRef = useRef();
    const contentRef = useRef();

    const hashtagSet = new Set();

    const handleMediaUpload = () => {

    }

    const handleRegist = async () => {
        // 해쉬태그 데이터 Set -> Array
        const hashContent = [];
        hashtagSet.forEach((it) => hashContent.push(it));

        const data = {
            "memberIndex": localStorage.getItem('memberIndex'),
            "boardContent": contentRef.current.value,
            "boardInputDate" : "2024-01-23",
            "mediaContent": [],
            "boardLocation": location,
            "boardAccess": accessRangeRef.current.value,
            "boardDeleteYN" :"N",
            "hashContent": hashContent,
        }
        console.log(data);
        try{
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/board/`,data,
            {
                header: {
                    token: localStorage.getItem('token'),
                },
            });

            if (response.status === 200){
                alert("게시글 작성 성공");
                
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/board/star/${params.user_id}`,
                {
                  header: {
                    token: localStorage.getItem('token') ?? "",
                  },
                  params: {
                    page: curPage ?? 0,
                  }
                })

                isAddedStar.clear();
                res.data.BoardListResponseDtoList.forEach((star) => isAddedStar.set(star.boardLocation, star));
                console.log(res.data);
                setStars(res.data);
                setIsStarRegistOpen(-1);
            } else {
                console.log(response.data);
                alert("게시글 작성 실패");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {

    }
    
    return (
        <div className="star-regist" style={{border: "1px solid black"}}>
            <div style={{display: "flex"}}>
                {/* 최상단 */}
                <DateArea ref={dateRef}/>
                <AccessRangeArea ref={accessRangeRef}/>
            </div>
            <div>
                {/* 글 작성 영역 */}
                {
                    media.length > 0 && <div>사진 미리보기</div>
                }
                <textarea ref={contentRef}/>
            </div>
            <div>
                {
                    <HashtagArea hashtagSet={hashtagSet}/>
                }
            </div>
            <div>
                <input type="file" onClick={handleMediaUpload}/>
                <button onClick={handleRegist}>{buttonValue[type]}</button>
                <button onClick={handleClose}>취소</button>
            </div>
        </div>
    )
}

const DateArea = forwardRef((props, ref) => {
    const handleCalander = () => {

    }

    return (
        <div onClick={handleCalander}>
            날짜
        </div>
    )
})

const AccessRangeArea = forwardRef((props, ref) => {

    return(
    <select name="access" ref={ref}>
        <option value="OPEN">전체 공개</option>
        <option value="PARTOPEN">친구 공개</option>
        <option value="NOOPEN">비공개</option>
    </select>
    )
})

const HashtagArea = (props) => {

    const input = useRef();
    const [hashtagList, setHashtagList] = useState([]);
    
    const handleKeyDown = (e) => {
        
        if(e.code === "Enter" || e.code === "Space"){
            
            // 한글 문자 두번씩 입력되는 오류 방지하기 위해 추가
            if(e.nativeEvent.isComposing) return;

            // 문자열 파싱 및 input value 비우기
            const value = input.current.value.trim();
            input.current.value = null;

            // 공백 해시태그 추가 방지
            if(value === "") return;
            

            // Set에 저장되어 있는지 체크
            if (!props.hashtagSet.has(value)){
                // 새로운 값일 때

                // Set에 해시태그 값 저장
                props.hashtagSet.add(value);

                // 해시태그 리스트 갱신
                const tmp = [...hashtagList];
                tmp.push(value);
                setHashtagList(tmp);
            } 
            input.current.value = null;
        }
    }

    const handleRemoveHashtag = (val, index) => {
        let tmp = [...hashtagList];
        tmp.splice(index,1);
        setHashtagList(tmp);

        props.hashtagSet.delete(val);
    }

    return (
        <div style={{display: "flex"}}>
            {
                hashtagList.map((it, index) => 
                <div key={index} style={{border: "1px solid black", margin: "0 3px"}} onClick={() => handleRemoveHashtag(it, index)}>
                    {it}
                </div>)
            }
            {
                hashtagList.length < 10 && <input ref={input} type="text" style={{width: "70px"}} onKeyDown={handleKeyDown}></input>
            }
        </div>
    )
}

export default StarRegist;