import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
    atom,
    useRecoilState,
    useRecoilValue,
    useResetRecoilState,
    useSetRecoilState,
} from "recoil";
import { Link, useParams } from "react-router-dom";
import {
    isConstellationInfoOpenState,
    isDeleteAlertOpenState,
    isGuideCommentOpenState,
    isStarDetailOpenState,
    isStarRegistOpenState,
} from "components/atom";
import { position, linePosition, MAX_SATR_CNT } from "../../data";
import { useLocation } from "react-router-dom";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { constellationCheck } from "util";
import { PiShootingStarFill } from "react-icons/pi";
import { FaRadio } from "react-icons/fa6";
import swal from "sweetalert";
import * as THREE from "three";
import axios from "axios";

// 해당 별자리 내 첫 번째 별 번호, 마지막 별 번호
const starRange = [];
position.forEach((element, index) =>
    starRange.push([element[0][0], element[element.length - 1][0]])
);

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

// 공간 주인과 접속 유저의 팔로워 여부
const isFollowerState = atom({
    key: "isFollower",
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

// isAddedStar : starLocation : starInfo
const isAddedStar = new Map();

function Line(props) {
    const starLineOpacity = useRecoilValue(starLineOpacityState);

    const lineRef = useRef();

    const groupNum = props.groupNum;
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(props.points);

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial
                attach="material"
                ref={lineRef}
                transparent={true}
                opacity={
                    !props.lineColor
                        ? 1
                        : starLineOpacity === groupNum
                        ? 0.05
                        : 0.01
                }
                color={0xced6ff}
            />
        </line>
    );
}

function Ground(props) {
    const mesh = useRef(null);

    return (
        <mesh ref={mesh} position={props.position}>
            <sphereGeometry args={props.size} />
            <meshBasicMaterial
                color={props.color}
                side={
                    props.type === "double"
                        ? THREE.DoubleSide
                        : props.type === "front"
                        ? THREE.FrontSide
                        : THREE.BackSide
                }
            />
        </mesh>
    );
}

function Space(props) {
    const mesh = useRef(null);
    const colorMap = useLoader(
        THREE.TextureLoader,
        `${process.env.PUBLIC_URL}/image/color_texture_4.png`
    );

    return (
        <mesh ref={mesh} position={props.position}>
            <sphereGeometry args={props.size} />
            <meshStandardMaterial
                map={colorMap}
                side={
                    props.type === "double"
                        ? THREE.DoubleSide
                        : props.type === "front"
                        ? THREE.FrontSide
                        : THREE.BackSide
                }
            />
        </mesh>
    );
}

function Star(props) {
    const stars = useRecoilValue(starsState);
    const isFollower = useRecoilValue(isFollowerState);
    const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
    const setIsStarRegistOpen = useSetRecoilState(isStarRegistOpenState);

    const params = useParams();

    const mesh = useRef(null);

    const writerIndex = Number(params["user_id"]);
    const loginUserIndex = Number(
        JSON.parse(
            atob(sessionStorage.getItem("token").split(" ")[1].split(".")[1])
        ).sub
    );
    const colors = {
        true: 0xf5ff82,
        false: "red",
    };

    // curStarState: 해당 별 객체 정보를 모두 담고 있다.
    const [curStarState, setCurStarState] = useState(null);

    let regDate = curStarState
        ? curStarState.boardRegTime.split(" ")[0].split(".")
        : null;

    if (regDate) {
        regDate[0] = "20" + regDate[0];
        regDate = new Date(regDate.join("-"));
    }

    const today = new Date();
    const dayDiff = regDate ? (today - regDate) / 1000 / 60 / 60 / 24 : 0;

    const colorCheck = curStarState
        ? (isFollower && curStarState.boardAccess === "PARTOPEN") ||
          curStarState.boardAccess === "OPEN" ||
          writerIndex === loginUserIndex
        : false;

    useEffect(() => {
        setCurStarState(isAddedStar.get(props.location));

        if (isAddedStar.get(props.location)) {
            constellationCheck.update(1, 0, MAX_SATR_CNT, props.location, 1);
        } else {
            constellationCheck.update(1, 0, MAX_SATR_CNT, props.location, 0);
        }
    }, [stars]);

    const handleClick = (e, locationNum) => {
        e.stopPropagation();

        const starIndex = isAddedStar.get(locationNum)
            ? isAddedStar.get(locationNum).boardIndex
            : null;

        if (starIndex) {
            // 별이 나에게 공개된 별일 때
            if (colorCheck) {
                // 별 상세 정보 띄우기
                setIsStarDetailOpen([starIndex, writerIndex]);
            } else {
                // 공개된 별이 아닐 때
                swal({
                    title: "비공개 별입니다!",
                    text: "전체공개 또는 팔로워 공개 별만 볼 수 있어요",
                    icon: "info",
                });
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
                <meshPhongMaterial
                    color={curStarState ? colors[colorCheck] : "grey"}
                    opacity={
                        curStarState ? Math.max(1 - dayDiff / 360, 0.5) : 0.4
                    }
                    transparent={true}
                />
            </mesh>
            <StarSurround
                position={props.position}
                location={props.location}
                handleClick={handleClick}
            />
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
                setOpacity(0.05);
            }}
            onPointerLeave={() => setOpacity(0)}
        >
            <sphereGeometry args={[0.7, 48, 48]} />
            <meshStandardMaterial
                transparent={true}
                opacity={opacity}
                depthTest={false}
            />
        </mesh>
    );
}

function GroupStar(props) {
    const stars = useRecoilValue(starsState);
    const setStarLineOpacityState = useSetRecoilState(starLineOpacityState);
    const setIsConstellationOpen = useSetRecoilState(
        isConstellationInfoOpenState
    );

    const [lineColor, setLineColor] = useState(true);
    const [renewConstellation, setRenewConstellation] = useState(false);

    const group = useRef(null);

    const position = props.position;
    const groupNum = props.groupNum;

    let startStarNum = position[0][0];
    const lastStarNum = position[position.length - 1][0];

    // 황소자리, 페가수스 자리의 경우는 다른 별자리의 별과 이어지므로 startStartNum -1 처리
    if (groupNum === 12 || groupNum === 14) {
        startStarNum--;
    }

    // 작성한 별 목록 변경 시 별자리 체크
    useEffect(() => {
        const check = constellationCheck.query(
            1,
            0,
            MAX_SATR_CNT,
            startStarNum,
            lastStarNum
        );

        if (check === lastStarNum - startStarNum + 1) {
            setLineColor(false);
        } else {
            setLineColor(true);
        }
    }, [stars]);

    // 하늘 회전
    useFrame((state, delta) => {
        group.current.rotation.y += delta / 250;
    });

    function handlePointerEnter() {
        setStarLineOpacityState(groupNum);
        setIsConstellationOpen(groupNum);
    }

    function handlePointerLeave() {
        setStarLineOpacityState(-1);
        setIsConstellationOpen(false);
    }

    return (
        <group
            ref={group}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            {props.position.map((val, index) => (
                <Star
                    key={index}
                    size={[0.17, 32, 32]}
                    positions={position}
                    position={val.slice(1, 4)}
                    location={val[0]}
                    renewConstellation={renewConstellation}
                    setRenewConstellation={setRenewConstellation}
                    startStarNum={startStarNum}
                    lastStarNum={lastStarNum}
                />
            ))}
            {linePosition[groupNum].map((it, index) => {
                const pos = it.map((it) => new THREE.Vector3(...it));
                return (
                    <Line
                        key={index}
                        points={pos}
                        groupNum={groupNum}
                        lineColor={lineColor}
                    />
                );
            })}
        </group>
    );
}

function SceneStars() {
    const [stars, setStars] = useRecoilState(starsState);
    const [isFollower, setIsFollower] = useRecoilState(isFollowerState);
    const curPage = useRecoilValue(curPageState);
    const isDeleteAlertOpen = useRecoilValue(isDeleteAlertOpenState);
    const setFollower = useSetRecoilState(followerState);
    const setIsGuideCommentOpen = useSetRecoilState(isGuideCommentOpenState);

    const params = useParams();
    const writerIndex = Number(params.user_id);
    const loginUserId = Number(sessionStorage.getItem("memberIndex"));
    const loginUserNickname = sessionStorage.getItem("nickname");

    useEffect(() => {
        const fetchData = async () => {
            // 게시글 리스트 불러오기

            setIsFollower(null);

            constellationCheck.treeReset();

            if (!isDeleteAlertOpen) {
                await axios
                    .get(
                        `${process.env.REACT_APP_API_URL}/board/star/${writerIndex}`,
                        {
                            header: {
                                token: sessionStorage.getItem("token") ?? "",
                            },
                            params: {
                                page: curPage ?? 0,
                            },
                        }
                    )
                    .then((response) => {
                        isAddedStar.clear();

                        response.data.forEach((star) => {
                            isAddedStar.set(
                                star.boardLocation % MAX_SATR_CNT,
                                star
                            );
                        });

                        setStars([...response.data]);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        };

        fetchData();

        if (stars.length === 0 && writerIndex === loginUserId) {
            setIsGuideCommentOpen(true);
        }
    }, [curPage, isDeleteAlertOpen, writerIndex]);

    useEffect(() => {
        let follower = [];

        async function followCheck() {
            // 공간 주인과 로그인 유저가 다를 때, 팔로잉 관계 체크 (게시물 팔로잉 공개 확인위해)
            if (writerIndex !== loginUserId) {
                await axios
                    .get(
                        `${process.env.REACT_APP_API_URL}/follow/follower/${writerIndex}`
                    )
                    .then((response) => {
                        setFollower(response.data.result);
                        follower = response.data.result;
                    })
                    .catch((e) => console.log(e));

                const followerCheck = follower.some(
                    (it) => it["memberName"] === loginUserNickname
                );
                setIsFollower(followerCheck);
            }
        }

        followCheck();
    }, [writerIndex, isFollower]);

    return (
        <>
            {position.map((val, index) => {
                return (
                    <GroupStar key={index} groupNum={index} position={val} />
                );
            })}
        </>
    );
}

function SceneLights() {
    return (
        <>
            {/* 광원 */}
            {/* <directionalLight position={[0, 0, 5]} intensity={2} /> */}
            <ambientLight intensity={3} />
        </>
    );
}

function SceneEnvironment() {
    return (
        <>
            {/* 우주 배경 */}
            <Space
                size={[55, 500, 500, 0, Math.PI * 2, 0, (Math.PI * 3.5) / 5]}
                position={[0, -7, 0]}
                color={"black"}
                type={"back"}
            />

            {/* 바닥면 */}
            <Ground
                size={[2, 48, 48, 0, Math.PI * 2]}
                position={[0, -2.2, 0]}
                color={"orange"}
            />
        </>
    );
}

function FollowArea() {
    const params = useParams();

    const location = useLocation();

    const [isFollower, setIsFollower] = useRecoilState(isFollowerState);

    const [loginToken, setLoginToken] = useState(
        sessionStorage.getItem("token")
    );
    const [loginIndex, setLoginIndex] = useState(
        Number(sessionStorage.getItem("memberIndex"))
    );
    const [userName, setUserName] = useState("");

    const userId = Number(params.user_id);

    const handleFollow = (isFollower) => {
        const relationData = {
            toMemberIndex: userId,
            fromMemberIndex: loginIndex,
        };
        if (isFollower) {
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
                .then(() => setIsFollower(false));
        } else if (!isFollower) {
            // 팔로우 api 호출
            axios
                .post(
                    `${process.env.REACT_APP_API_URL}/follow/following`,
                    relationData,
                    {
                        headers: {
                            token: loginToken,
                        },
                    }
                )
                .then(() => setIsFollower(true));
        }
    };

    useEffect(() => {
        const writerIndex = Number(params.user_id);
        const loginUserId = Number(sessionStorage.getItem("memberIndex"));
        if (writerIndex !== loginUserId && location.state?.props) {
            setUserName(location.state.props);
        }
        if (writerIndex === loginUserId) {
            setUserName("");
        }
    }, [location]);

    useEffect(() => {
        setLoginToken(loginToken);
        setLoginIndex(loginIndex);
    }, [loginToken, loginIndex]);
    return (
        <>
            {userName ? (
                <div className="absolute bottom-4 left-4 flex justify-center items-center text-white">
                    <PiShootingStarFill className="mr-1" />
                    <div className="space-name font-['Pre-Bold'] text-2xl mr-2">
                        {userName} 우주
                    </div>
                    <div>
                        {userId !== loginIndex &&
                            (isFollower === null ? (
                                <div className="font-['Pre-Light']">
                                    Loading...
                                </div>
                            ) : (
                                <button
                                    className="space-follow font-['Pre-Bold'] text-m px-3"
                                    onClick={() => handleFollow(isFollower)}
                                >
                                    {isFollower ? "언팔로우" : "팔로우"}
                                </button>
                            ))}
                    </div>
                </div>
            ) : (
                <Link
                    to={`/space/${sessionStorage.getItem("memberIndex")}/radio`}
                >
                    <FaRadio
                        className="Footer-Radio absolute top-2 right-20 z-10 mr-2"
                        size="28"
                        color="white"
                    />
                </Link>
            )}
        </>
    );
}

export function GuideComment() {
    const resetIsGuideCommentOpen = useResetRecoilState(
        isGuideCommentOpenState
    );

    useEffect(() => {
        function guideClose() {
            resetIsGuideCommentOpen();
        }

        setTimeout(guideClose, 4000);
    }, []);

    return (
        <div className="guide-comment-container  font-['Star'] absolute bottom-32 justify-center w-full flex ">
            <div className="guide-comment p-2 text-white-sub text-4xl animate-fade-in animate-fade-out">
                <div>희미한 별을 눌러 일기를 작성하고 별자리를 이어보아요!</div>
            </div>
        </div>
    );
}

function UserSpace() {
    return (
        <div className="user-space relative">
            <div
                id="canvas-container"
                className="w-full h-full"
                style={{ height: "100vh", width: "100vw" }}
            >
                <Canvas>
                    <EffectComposer>
                        <Bloom
                            intensity={0.9}
                            luminanceThreshold={0.5}
                            kernelSize={KernelSize.VERY_LARGE}
                        />
                    </EffectComposer>
                    <SceneStars />
                    <SceneLights />
                    <SceneEnvironment />
                    <OrbitControls
                        dampingFactor={0.15}
                        target={[0, 0, 0]}
                        rotateSpeed={-0.15}
                        enableZoom={true}
                        minPolarAngle={(1.9 / 4) * Math.PI}
                    />
                    <PerspectiveCamera
                        makeDefault
                        position={[-0.01, 0, 0.1]}
                        fov={55}
                        zoom={1}
                        aspect={window.innerWidth / window.innerHeight}
                    />
                </Canvas>
                <FollowArea />
            </div>
        </div>
    );
}

export { isAddedStar, starsState, curPageState };
export default UserSpace;
