import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
    OrbitControls,
    PerspectiveCamera,
    useTexture,
} from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';
import axios from 'axios';
import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';
import { useNavigate, useParams } from 'react-router-dom';
import StarRegist from 'components/star/StarRegist';
import StarDetail from 'components/star/StarDetail';
import { isStarDetailOpenState, isStarRegistOpenState } from 'components/atom';

// position : 별 [번호, x, y, z]
const position = [
    [
        // 작은곰자리 URSA MINOR
        [0, 0, 22, 0],
        [1, -3.1, 21.9, -0.7],
        [2, -6, 21.5, -2.1],
        [3, -8.4, 20.7, -5.7],
        [4, -10.5, 20.3, -5.1],
        [5, -11.4, 19.3, -8.9],
        [6, -8.6, 20, -9.2],
    ],
    [
        // 기린자리 CAMELOPARDALIS\
        [7, 7.1, 21, 5.5],
        [8, 11.3, 18.8, 10.8],
        [9, 10.2, 20.5, 3.2],
        [10, 10.4, 20.6, -2],
        [11, 15.5, 18.8, 3],
        [12, 18.8, 17, 5],
    ],
    [
        // 세페우스자리 CEPHEUS
        [13, -1.3, 20.7, 10.2],
        [14, -6.2, 19.4, 12.9],
        [15, -2.5, 18.5, 16.1],
        [16, -7.1, 16.3, 19.4],
        [17, -9, 17.2, 16.7],
        [18, -8.1, 15.3, 20.6],
        [19, -5.5, 16.3, 19.9],
    ],
    [
        // 카시오페이아자리 CASSIOPEIA
        [20, 3, 18.1, 17],
        [21, 5, 16.8, 19],
        [22, 7, 16.5, 19],
        [23, 8, 17.5, 16.7],
        [24, 4.4, 15.8, 21],
        [25, 2.9, 15.1, 22.2],
        [26, 3.9, 13.8, 24],
        [27, 0.6, 15.9, 21.3],
    ],
    [
        // 안드로메다자리 ANDROMEDA
        [28, 6.5, 11.8, 25.9],
        [29, 6.3, 6.5, 31],
        [30, -0.6, 10.9, 27.7],
        [31, -4.6, 8.7, 29.4],
        [32, 5, 2.6, 33.9],
        [33, 2.3, 4.6, 32.9],
        [34, 2, -0.3, 35.8],
        [35, 8.5, -2.8, 36],
        [36, 10.3, 3.1, 32.4],
        [37, 12.2, 9.4, 26.5],
    ],
    [
        // 삼각형자리 TRIANGULUM
        [38, 20.4, 0.2, 29.2],
        [39, 21.6, -4.9, 31],
        [40, 23.1, -4, 29.5],
        [41, 22.4, -1.1, 28.5],
    ],
    [
        // 페르세우스자리 PERSEUS
        [42, 20.8, 7.4, 22.8],
        [43, 20.4, 8.7, 21.7],
        [44, 19.2, 10.6, 20.3],
        [45, 17.5, 12.7, 18.7],
        [46, 15.4, 13.9, 18.5],
        [47, 14.1, 15.3, 17.1],
        [48, 16.4, 14.1, 17.4],
        [49, 18.8, 12.8, 17.2],
        [50, 20.4, 12.4, 16.1],
        [51, 23.5, 9.7, 16.8],
        [52, 26.2, 7.8, 15.7],
        [53, 28, 5.5, 16.3],
        [54, 29.5, 2.2, 17.9],
        [55, 21.7, 12.3, 14.5],
        [56, 21.9, 12.7, 13.4],
        [57, 20.1, 14, 13.2],
    ],
    [
        // 마차부자리 AURIGA
        [58, 27.1, 10.9, 5.6],
        [59, 29.5, 8.2, 6.5],
        [60, 29.5, 7.5, 9],
        [61, 28, 9.3, 8.5],
        [62, 32.8, 2.8, 9.5],
        [63, 35.1, -0.6, 8],
        [64, 23.5, 14.3, 2],
        [65, 28.1, 10.4, 1.9],
        [66, 32.1, 5.8, 2.1],
        [67, 35.8, -1.4, 6.5],
    ],
    [
        // 살쾡이자리 LINX
        [68, 25.2, 13.1, -0.8],
        [69, 25.1, 12.9, -3.9],
        [70, 30.3, 7.5, -5.8],
        [71, 31.2, 3.1, -13.5],
        [72, 29.3, 2.3, -18.1],
        [73, 31, -1.9, -19.5],
        [74, 29.5, -1.9, -21.7],
        [75, 30.3, -6.2, -23.3],
    ],
    [
        // 도마뱀자리 LACERTA
        [76, -14, 0.3, 32.7],
        [77, -11, 3.3, 32],
        [78, -11.5, 7.2, 28.9],
        [79, -10, 8.1, 28.6],
        [80, -10.3, 9.5, 27.2],
        [81, -8.7, 10.6, 26.6],
        [82, -9.2, 12.2, 24.6],
    ],
    [
        // 백조자리 CYGNUS
        [83, -20.6, 0.5, 28.9],
        [84, -22.2, 2.5, 26.2],
        [85, -21.4, 7.6, 22.1],
        [86, -17.6, 10.6, 21.7],
        [87, -22.2, 10, 18],
        [88, -21, 12.9, 14.3],
        [89, -24.7, 4.3, 22.2],
        [90, -27.9, 0.7, 21.7],
    ],
    [
        // 거문고자리 LYRA
        [91, -35.1, 0.2, 6.2],
        [92, -35.1, 0.9, 3],
        [93, -31.9, 5.6, 5],
        [94, -31.9, 6, 2.21],
        [95, -30.7, 7.6, 0.4],
    ],

    [
        // 헤라클레스자리 HERACULES
        [96, -32.5, 3.3, -9.4],
        [97, -27.9, 9.7, -7.4],
        [98, -29.9, 5.2, -12.9],
        [99, -27.2, 7.9, -13.8],
        [100, -24.4, 10.5, -13.9],
        [101, -34.8, -2.4, -12.1],
        [102, -33.4, -1.1, -14.1],
    ],
    [
        // 용자리 DRACO
        [103, -24.1, 13.5, -5.4],
        [104, -20.9, 15.6, -5.7],
        [105, -21.9, 14.7, -7.1],
        [106, -23.6, 13.4, -7.5],
        [107, -20.6, 16.2, -2],
        [108, -16.7, 18.3, -1.6],
        [109, -15, 19.1, -0.2],
        [110, -13.3, 19.7, -2.2],
        [111, -13.9, 19.3, -3.8],
        [112, -16.3, 17.8, -7.4],
        [113, -16.9, 16.7, -10.4],
        [114, -16.9, 16.6, -10.7],
        [115, -17.4, 15.6, -13],
        [116, -14.9, 16, -15],
        [117, -8.8, 17.1, -17.1],
        [118, -3.2, 18.7, -15.7],
        [119, -0.7, 18.7, -15.9],
    ],
    [
        // 목동자리 BOOTES
        [120, -23.7, 2.7, -24.7],
        [121, -21.9, 0.8, -27.7],
        [122, -17.4, 6.1, -26.8],
        [123, -15.1, 9.6, -24.7],
        [124, -16.9, 9.9, -23.1],
        [125, -27.7, -3.9, -25.2],
        [126, -28, -10.3, -27.5],
        [127, -30.5, -6.7, -23.3],
        [128, -24.9, -8.1, -29.7],
    ],
    [
        // 사냥개자리 CANES VENATICI
        [129, -5, 2.5, -34],
        [130, -0.2, 3.1, -34],
    ],
    [
        // 큰곰자리 URSA MAJOR
        [131, -11.4, 12.2, -23.6],
        [132, -6.6, 15, -21.6],
        [133, -3.8, 15.3, -21.8],
        [134, -0.4, 15.7, -21.5],
        [135, -1.3, 14.3, -23.5],
        [136, 6.5, 14.6, -22.3],
        [137, 5.1, 17.1, -18.5],
        [138, 9.7, 17.3, -16.1],
        [139, 14.2, 16.5, -14.5],
        [140, 9.8, 15.8, -19],
        [141, 11.7, 14.2, -20.6],
        [142, 14.3, 13.1, -20.7],
        [143, 17.6, 11.1, -21.1],
        [144, 17.7, 11.8, -19.9],
        [145, 2.2, 12, -26.4],
        [146, 6.4, 9.9, -27.9],
        [147, 12, 9.7, -26.2],
        [148, 11.8, 7.7, -28.3],
        [149, 6.1, 3.3, -33.3],
        [150, 6, 0.6, -34.9],
    ],
];

// 해당 별자리 내 첫 번째 별 번호, 마지막 별 번호
const starRange = [];
position.forEach((element, index) =>
    starRange.push([element[0][0], element[element.length - 1][0]])
);

// 페이지 내 존재하는 별 개수
const totalStarCount =
    position[position.length - 1][position[position.length - 1].length - 1][0] +
    1;

///////////////////////////////// atoms
// 현재 페이지
const curPageState = atom({
    key: 'curPage',
    default: 0,
});

// 현재 페이지에서 작성된 별 목록
const starsState = atom({
    key: 'stars',
    default: [],
});

const tmpStars = [
    // fetchData
    {
        boardIndex: 1,
        userIndex: 1,
        boardRegTime: '2099-99-99',
        boardInputDate: '2099-99-99',
        boardContent: '더미 컨텐츠',
        boardLocation: 1,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: [],
    },
    {
        boardIndex: 2,
        userIndex: 1,
        boardRegTime: '2099-99-99',
        boardInputDate: '2099-99-99',
        boardContent: '더미 컨텐츠',
        boardLocation: 0,
        boardAccess: 'CLOSE',
        boardLike: 3,
        tagContent: [],
    },
    {
        boardIndex: 3,
        userIndex: 1,
        boardRegTime: '2099-99-99',
        boardInputDate: '2099-99-99',
        boardContent: '더미 컨텐츠',
        boardLocation: 2,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: [],
    },
    {
        boardIndex: 3,
        userIndex: 1,
        boardRegTime: '2099-99-99',
        boardInputDate: '2099-99-99',
        boardContent: '더미 컨텐츠',
        boardLocation: 3,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: [],
    },
    {
        boardIndex: 3,
        userIndex: 1,
        boardRegTime: '2099-99-99',
        boardInputDate: '2099-99-99',
        boardContent: '더미 컨텐츠',
        boardLocation: 4,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: [],
    },
    {
        boardIndex: 3,
        userIndex: 1,
        boardRegTime: '2099-99-99',
        boardInputDate: '2099-99-99',
        boardContent: '더미 컨텐츠',
        boardLocation: 5,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: [],
    },
    {
        boardIndex: 3,
        userIndex: 1,
        boardRegTime: '2099-99-99',
        boardInputDate: '2099-99-99',
        boardContent: '더미 컨텐츠',
        boardLocation: 6,
        boardAccess: 'OPEN',
        boardLike: 3,
        tagContent: [],
    },
];

// isAddedStar : 등록된 별 체크를 위한 Map
const isAddedStar = new Map();

// 별자리 이어짐 체크
const constellationCheck = (starNum) => {
    let res = true;

    outer: for (let i = 0; i < starRange.length; i++) {
        if (starRange[i][1] >= starNum) {
            for (let j = starRange[i][0]; j <= starRange[i][1]; j++) {
                if (!isAddedStar.has(j)) {
                    res = false;
                    break outer;
                }
            }
            break;
        }
    }

    return res;
};

function Line(props) {
    // console.log("LINE MOUNTED");

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(props.points);

    return (
        <>
            <line geometry={lineGeometry}>
                <lineBasicMaterial
                    attach="material"
                    transparent={props.lineColor}
                    opacity={0}
                />
            </line>
        </>
    );
}

function Sphere(props) {
    // console.log("SPHERE MOUNTED");

    // const texture = useTexture("texture/bakedUniverse.png");
    // console.log(texture);

    const mesh = useRef(null);

    return (
        <mesh ref={mesh} position={props.position}>
            <sphereGeometry args={props.size} />
            <meshStandardMaterial
                color={props.color}
                side={
                    props.type === 'double'
                        ? THREE.DoubleSide
                        : props.type === 'front'
                        ? THREE.FrontSide
                        : THREE.BackSide
                }
            />
        </mesh>
    );
}

function Star(props) {
    // console.log(`STAR ${props.location} MOUNTED`);

  const params = useParams();  
  const mesh = useRef(null);
  const stars = useRecoilValue(starsState);

  const setIsStarDetailOpen = useSetRecoilState(isStarDetailOpenState);
  const setIsStarRegistOpen = useSetRecoilState(isStarRegistOpenState);

    // curStarState: 해당 별 객체 정보를 모두 담고 있다.
    const [curStarState, setCurStarState] = useState(null);

    useEffect(() => {
        setCurStarState(isAddedStar.get(props.location));
    }, [stars]);

    const colors = {
        OPEN: 'yellow',
        PARTOPEN: 'red',
    };

    const handleClick = (locationNum) => {
      const starInfo = isAddedStar.get(locationNum);
      console.log(starInfo);
        if (starInfo) {
            // 별 상세보기 모달 띄우기
            setIsStarDetailOpen([starInfo.boardIndex, params["user_id"]]);
        } else {
            // 별 등록 모달 띄우기
            setIsStarRegistOpen(locationNum);
        }
    };

    return (
        <mesh
            ref={mesh}
            position={props.position}
            onClick={() => {
                handleClick(props.location);
            }}
        >
            <sphereGeometry args={props.size} />
            <meshStandardMaterial
                color={curStarState ? colors[curStarState.boardAccess] : 'grey'}
            />
        </mesh>
    );
}

function GroupStar(props) {
    // console.log(`GROUP-STAR ${props.groupNum} MOUNTED`);

    const stars = useRecoilValue(starsState);
    const [lineState, setLineState] = useState([]);
    const [lineColor, setLineColor] = useState(true);
    const group = useRef(null);

    // // 별자리 생성 체크용 트리
    // const range = starRange[props.groupNum];
    // const size = 1 << (Math.ceil(Math.log(range[1] - range[0] + 1) / Math.log(2)) + 1);
    // const constellationTree = Array(size).fill(true);

    // const initTree = (node, start, end) => {
    //   if (start === end) {
    //     constellationTree[node] = isAddedStar.get(range[0] + start) ? true : false;
    //     return;
    //   }

    //   let mid = Math.floor((start + end) / 2);
    //   initTree(node * 2, start, mid);
    //   initTree(node * 2 + 1, mid + 1, end);
    //   constellationTree[node] = constellationTree[node * 2] && constellationTree[node * 2 + 1];
    // };

    // const updateTree = (node, start, end, idx, val) => {
    //   if (idx < start || end < idx) {
    //     return;
    //   }

    //   if (start === end) {
    //     constellationTree[node] = val;
    //     return;
    //   }

    //   let mid = Math.floor((start + end) / 2);
    //   updateTree(node * 2, start, mid, idx, val);
    //   updateTree(node * 2 + 1, mid + 1, end, idx, val);
    //   constellationTree[node] = constellationTree[node * 2] && constellationTree[node * 2 + 1];
    // };

    // const queryTree = (node, start, end, left, right) => {
    //   if (end < left || right < start) {
    //     return true;
    //   }

    //   if (left <= start && end <= right) {
    //     return constellationTree[node];
    //   }

    //   let mid = Math.floor((start + end) / 2);
    //   let l = queryTree(node * 2, start, mid, left, right);
    //   let r = queryTree(node * 2 + 1, mid + 1, end, left, right);
    //   return l && r;
    // };

    useEffect(() => {
        const lastStarOfThisGroup =
            props.position[props.position.length - 1][0];
        if (constellationCheck(lastStarOfThisGroup)) {
            setLineColor(false);
        }
    }, [stars]);

    useEffect(() => {
        setLineState(
            props.position.map((val) => new THREE.Vector3(...val.slice(1, 4)))
        );
    }, []);

    useFrame((state, delta) => {
        group.current.rotation.y += delta / 220;
    });

    return (
        <>
            <group
                ref={group}
                onPointerOver={() => {
                    console.log(`Over ${props.groupNum}`);
                }}
            >
                {props.position.map((val, index) => (
                    <Star
                        key={index}
                        size={[0.13, 32, 32]}
                        positions={position}
                        position={val.slice(1, 4)}
                        location={val[0]}
                        setLineColor={setLineColor}
                    />
                ))}
                <Line points={lineState} lineColor={lineColor} />
            </group>
        </>
    );
}

function SceneStars() {
    console.log('SCENE-STARS MOUNTED');

    const setStars = useSetRecoilState(starsState);
    const curPage = useRecoilValue(curPageState);

    const params = useParams();
    const userId = params.user_id;

    // 페이지 내 별 정보 불러오기
    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get(`${process.env.REACT_APP_API_URL}/board/star/${userId}`, {
                    header: {
                        token: localStorage.getItem('token') ?? '',
                    },
                    params: {
                        page: curPage ?? 0,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    isAddedStar.clear();
                    response.data.BoardListResponseDtoList.forEach((star) =>
                        isAddedStar.set(star.boardLocation, star)
                    );
                    console.log(response.data);
                    setStars(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        fetchData();

    }, [curPage]);

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
    console.log('SCENE-LIGHTS MOUNTED');
    return (
        <>
            {/* 광원 */}
            <directionalLight position={[0, 0, 5]} intensity={2} />
            <ambientLight intensity={2} />

            {/* 중심점 - 추후 삭제 */}
            <Sphere
                size={[0.01, 16, 16]}
                position={[0.5, -7.8, -1]}
                color={'red'}
            />
        </>
    );
}

function SceneEnvironment() {
    // const texture = useLoader(TextureLoader, "texture/bakedUniverse.png");

    return (
        <>
            {/* 우주 배경 */}
            <Sphere
                size={[40, 48, 48, 0, Math.PI * 2, 0, (Math.PI * 2) / 3]}
                position={[0, -4, 0]}
                color={'black'}
                type={'back'}
            />
            {/* <Cube /> */}

            {/* 바닥면 */}
            <Sphere
                size={[2, 48, 48, 0, Math.PI * 2]}
                position={[0, -2.2, 0]}
                color={'orange'}
            />
        </>
    );
}

function StarRegistArea() {
    const isStarRegistOpen = useRecoilValue(isStarRegistOpenState);
    console.log(isStarRegistOpen);

    return (
        <div>
            {isStarRegistOpen !== -1 && (
                <StarRegist type={'regist'} location={isStarRegistOpen} />
            )}
        </div>
    );
}

function StarDetailArea(){
    const isStarDetailOpen = useRecoilValue(isStarDetailOpenState);

    return (
        <div>
            {isStarDetailOpen.length !== 0 && <StarDetail starIndex={isStarDetailOpen[0]} userIndex={isStarDetailOpen[1]}/>}
        </div>
    )
}

function UserSpace() {
    return (
        <>
            <div
                id="canvas-container"
                style={{ height: '100vh', width: '100vw' }}
            >
                <Canvas>
                    <SceneStars />
                    <SceneLights />
                    <SceneEnvironment />
                    <OrbitControls
                        dampingFactor={0.15}
                        target={[0, 0, 0]}
                        rotateSpeed={-0.15}
                        enableZoom={false}
                    />
                    <PerspectiveCamera
                        makeDefault
                        position={[-0.01, 0, 0.1]}
                        fov={60}
                        zoom={1}
                        aspect={window.innerWidth / window.innerHeight}
                    />
                </Canvas>
            </div>
            <div className="modal-area">
                <StarRegistArea />
                <StarDetailArea />
            </div>
        </>
    );
}

export { isAddedStar, isStarRegistOpenState, isStarDetailOpenState, starsState, curPageState };
export default UserSpace;
