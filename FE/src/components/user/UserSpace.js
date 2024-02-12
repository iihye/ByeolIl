import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import * as THREE from "three";
import axios from "axios";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { Link, useParams } from "react-router-dom";
import { isDeleteAlertOpenState, isStarDetailOpenState, isStarRegistOpenState } from "components/atom";
import { position, linePosition, lastStarIndex } from "../../data";
import ModalSpace from "components/ModalSpace";
import { Bloom, EffectComposer, Select, Selection, SelectiveBloom, ToneMapping } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { constellationCheck } from "util";

// 해당 별자리 내 첫 번째 별 번호, 마지막 별 번호
const starRange = [];
position.forEach((element, index) => starRange.push([element[0][0], element[element.length - 1][0]]));

///////////////////////////////// ↓ atoms

// 현재 페이지
const curPageState = atom({
  key: "curPage",
  default: 0,
});

// 현재 페이지에서 작성된 별 목록
const starsState = atom({
  key: "stars",
  default: [],
});

// 공간 주인과 접속 유저의 친구 여부
const isFriendState = atom({
  key: "isFriend",
  default: true,
});

const followingState = atom({
  key: "following",
  default: [],
});

const followerState = atom({
  key: "follower",
  default: [],
});

const starLineOpacityState = atom({
  key: "starLineOpacity",
  default: -1,
});
///////////////////////////////// ↑ atoms

// isAddedStar : starLocation : starIndex
const isAddedStar = new Map();

// 별자리 이어짐 체크
// const constellationCheck = (starNum) => {
//   let res = true;

//   outer: for (let i = 0; i < starRange.length; i++) {
//     if (starRange[i][1] >= starNum) {
//       for (let j = starRange[i][0]; j <= starRange[i][1]; j++) {
//         if (!isAddedStar.has(j)) {
//           res = false;
//           break outer;
//         }
//       }
//       break;
//     }
//   }

//   return res;
// };

function Line(props) {
  const starLineOpacity = useRecoilValue(starLineOpacityState);

  const groupNum = props.groupNum;

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(props.points);

  return (
    <>
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach="material" transparent={props.lineColor} opacity={starLineOpacity === groupNum ? 0.025 : 0.0025} color={0xced6ff} />
      </line>
    </>
  );
}

function Sphere(props) {
  const mesh = useRef(null);

  return (
    <mesh ref={mesh} position={props.position}>
      <sphereGeometry args={props.size} />
      <meshStandardMaterial color={props.color} side={props.type === "double" ? THREE.DoubleSide : props.type === "front" ? THREE.FrontSide : THREE.BackSide} />
    </mesh>
  );
}

function Star(props) {
  const params = useParams();
  const mesh = useRef(null);

  const stars = useRecoilValue(starsState);

  const isFriend = useRecoilValue(isFriendState);
  const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
  const setIsStarRegistOpen = useSetRecoilState(isStarRegistOpenState);

  const writerIndex = Number(params["user_id"]);
  const loginUserIndex = Number(JSON.parse(atob(sessionStorage.getItem("token").split(" ")[1].split(".")[1])).sub);
  const colors = {
    true: "yellow",
    false: "red",
  };
  // curStarState: 해당 별 객체 정보를 모두 담고 있다.
  const [curStarState, setCurStarState] = useState(null);

  useEffect(() => {
    setCurStarState(isAddedStar.get(props.location));

    if (isAddedStar.get(props.location)) {
      constellationCheck.update(1, 0, lastStarIndex, props.location, true);
    } else {
      constellationCheck.update(1, 0, lastStarIndex, props.location, false);
    }
  }, [stars]);

  const handleClick = (e, locationNum) => {
    e.stopPropagation();
    console.log(locationNum);
    const starIndex = isAddedStar.get(locationNum) ? isAddedStar.get(locationNum).boardIndex : null;
    if (starIndex) {
      // 별이 나에게 공개된 별일 때
      if (isFriend) {
        // 별 상세 정보 띄우기
        setIsStarDetailOpen([starIndex, writerIndex]);
      } else {
        // 공개된 별이 아닐 때
        alert("비공개 별입니다");
      }
    } else {
      // 별 등록 모달 띄우기
      if (writerIndex === loginUserIndex) {
        setIsStarRegistOpen([locationNum, writerIndex]);
      }
    }
  };

  return (
    <>
      <mesh ref={mesh} position={props.position}>
        <sphereGeometry args={props.size} />
        <meshStandardMaterial color={curStarState ? colors[isFriend] : "grey"} opacity={curStarState ? 1 : 0.2} transparent={true} />
      </mesh>
      <StarSurround position={props.position} location={props.location} handleClick={handleClick} />
    </>
  );
}

function StarSurround(props) {
  const [opacity, setOpacity] = useState(0);

  return (
    <mesh
      position={props.position}
      onClick={(e) => {
        props.handleClick(e, props.location);
      }}
      onPointerEnter={(e) => {
        setOpacity(0.1);
      }}
      onPointerLeave={() => setOpacity(0)}
    >
      <sphereGeometry args={[0.6, 48, 48]} />
      <meshStandardMaterial transparent={true} opacity={opacity} />
    </mesh>
  );
}

function GroupStar(props) {
  const stars = useRecoilValue(starsState);

  const setStarLineOpacityState = useSetRecoilState(starLineOpacityState);

  const [lineColor, setLineColor] = useState(true);

  const group = useRef(null);

  const position = props.position;
  const groupNum = props.groupNum;

  const startStarNum = position[0][0];
  const lastStarNum = position[position.length - 1][0];

  // 작성한 별 목록 변경 시 별자리 체크
  useEffect(() => {
    const check = constellationCheck.query(1, 0, lastStarIndex, startStarNum, lastStarNum);
    if (check) {
      setLineColor(false);
    } else if (!check) {
      setLineColor(true);
    }
  }, [stars]);

  // 하늘 회전
  useFrame((state, delta) => {
    group.current.rotation.y += delta / 250;
  });

  function handlePointerEnter() {
    setStarLineOpacityState(groupNum);
  }

  function handlePointerLeave() {
    setStarLineOpacityState(-1);
  }

  return (
    <>
      <group ref={group} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
        {props.position.map((val, index) => (
          <Star key={index} size={[0.13, 32, 32]} positions={position} position={val.slice(1, 4)} location={val[0]} setLineColor={setLineColor} />
        ))}
        {linePosition[groupNum].map((it, index) => {
          const pos = it.map((it) => new THREE.Vector3(...it));
          return <Line key={index} points={pos} lineColor={lineColor} groupNum={groupNum} />;
        })}
      </group>
    </>
  );
}

function SceneStars() {
  const curPage = useRecoilValue(curPageState);
  const setStars = useSetRecoilState(starsState);
  const setIsFriend = useSetRecoilState(isFriendState);
  const setFollowing = useSetRecoilState(followingState);
  const setFollower = useSetRecoilState(followerState);
  const isDeleteAlertOpen = useRecoilValue(isDeleteAlertOpenState);

  const params = useParams();
  const writerIndex = Number(params.user_id);
  const loginUserId = Number(sessionStorage.getItem("memberIndex"));
  const loginUserNickname = sessionStorage.getItem("nickname");

  useEffect(() => {
    const fetchData = async () => {
      // 게시글 리스트 불러오기
      if (!isDeleteAlertOpen) {
        await axios
          .get(`${process.env.REACT_APP_API_URL}/board/star/${writerIndex}`, {
            header: {
              token: sessionStorage.getItem("token") ?? "",
            },
            params: {
              page: curPage ?? 0,
            },
          })
          .then((response) => {
            isAddedStar.clear();
            response.data.BoardListResponseDtoList.forEach((star) => isAddedStar.set(star.boardLocation, star));
            setStars(response.data);
          })
          .then(async () => {
            let following = [];
            let follower = [];

            // 공간 주인과 로그인 유저가 다를 때, 팔로잉 관계 체크 (게시물 팔로잉 공개 확인위해)
            if (writerIndex !== loginUserId) {
              console.log(writerIndex, loginUserId);
              await axios
                .get(`${process.env.REACT_APP_API_URL}/follow/following/${writerIndex}`)
                .then((response) => {
                  setFollowing(response.data.result);
                  following = response.data.result;
                })
                .catch((e) => {
                  console.log(e);
                });

              await axios
                .get(`${process.env.REACT_APP_API_URL}/follow/follower/${writerIndex}`)
                .then((response) => {
                  setFollower(response.data.result);
                  follower = response.data.result;
                })
                .catch((e) => console.log(e));

              const followingCheck = following.some((it) => it["memberId"] === loginUserNickname.split("@")[0]);
              const followerCheck = follower.some((it) => it["memberId"] === loginUserNickname.split("@")[0]);

              if (!followingCheck) {
                if (!followerCheck) {
                  setIsFriend(false);
                }
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };

    fetchData();
  }, [curPage, isDeleteAlertOpen]);

  return (
    <>
      {position.map((val, index) => {
        return <GroupStar key={index} groupNum={index} position={val} />;
      })}
    </>
  );
}

function SceneLights() {
  return (
    <>
      {/* 광원 */}
      {/* <directionalLight position={[0, 0, 5]} intensity={2} /> */}
      <ambientLight intensity={2} />
    </>
  );
}

function SceneEnvironment() {
  return (
    <>
      {/* 우주 배경 */}
      <Sphere size={[55, 48, 48, 0, Math.PI * 2, 0, (Math.PI * 3.5) / 5]} position={[0, -7, 0]} color={"black"} type={"back"} />

      {/* 바닥면 */}
      <Sphere size={[2, 48, 48, 0, Math.PI * 2]} position={[0, -2.2, 0]} color={"orange"} />
    </>
  );
}

function UserSpace() {
  const params = useParams();
  const userId = params.user_id;

  const [loginToken, setLoginToken] = useState(sessionStorage.getItem("token"));
  const [loginIndex, setLoginIndex] = useState(sessionStorage.getItem("memberIndex"));
  const [userName, setUserName] = useState(null);
  const [followState, setFollowState] = useState("");

  const handleFollow = (followState) => {
    const relationData = {
      toMemberIndex: userId,
      fromMemberIndex: loginIndex,
    };
    if (followState === "언팔로우") {
      // 팔로우 취소 api 호출
      axios
        .delete(
          `${process.env.REACT_APP_API_URL}/follow/following`,
          {
            data: relationData,
          },
          {
            headers: {
              token: loginToken,
            },
          }
        )
        .then(() => setFollowState("팔로우"));
    } else if (followState === "팔로우") {
      // 팔로우 api 호출
      axios
        .post(`${process.env.REACT_APP_API_URL}/follow/following`, relationData, {
          headers: {
            token: loginToken,
          },
        })
        .then(() => setFollowState("언팔로우"));
    }
  };

  useEffect(() => {
    setLoginToken(loginToken);
    setLoginIndex(loginIndex);
  }, [loginToken, loginIndex]);

  return (
    <div className="user-space relative">
      <div id="canvas-container" style={{ height: "100vh", width: "100vw" }}>
        <Canvas>
          <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.5} kernelSize={KernelSize.VERY_LARGE} />
          </EffectComposer>
          <SceneStars />
          <SceneLights />
          <SceneEnvironment />
          <OrbitControls dampingFactor={0.15} target={[0, 0, 0]} rotateSpeed={-0.15} enableZoom={true} />
          <PerspectiveCamera makeDefault position={[-0.01, 0, 0.1]} fov={55} zoom={1} aspect={window.innerWidth / window.innerHeight} />
          <Stats />
        </Canvas>
      </div>
      {userName && (
        <>
          <div className="space-name">{userName}님의 우주입니다</div>
          {userId !== loginIndex && <button onClick={() => handleFollow(followState)}>{followState}</button>}
        </>
      )}
      <ModalSpace />
      <Link to={`/space/${localStorage.getItem("memberIndex")}/radio`}>
        <button className="absolute bottom-2 left-2">라디오</button>
      </Link>
    </div>
  );
}

export { isAddedStar, starsState, curPageState };
export default UserSpace;
