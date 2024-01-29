import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import axios from "axios";
import { atom, useRecoilState } from "recoil";

// starRange : 각 별자리들의 시작별, 끝 별 번호
const starRange = [
  [0, 4],
  [5, 6],
];

// position : 변화할 일 없는 값
const position = [
  [
    [0, 0, 22, 0],
    [1, -3.1, 21.9, -0.7],
    [2, -6, 21.5, -2.1],
    [3, -8.4, 20.7, -5.7],
    [4, -10.5, 20.3, -5.1],
    [5, -11.4, 19.3, -8.9],
    [6, -8.6, 20, -9.2],
  ],
  [
    [7, 7.1, 21, 5.5],
    [8, 11.3, 18.8, 10.8],
    [9, 10.2, 20.5, 3.2],
    [10, 10.4, 20.6, -2],
    [11, 15.5, 18.8, 3],
    [12, 18.8, 17, 5],
  ],
  [
    [13, -1.3, 20.7, 10.2],
    [14, -6.2, 19.4, 12.9],
    [15, -2.5, 18.5, 16.1],
    [16, -7.1, 16.3, 19.4],
    [17, -9, 17.2, 16.7],
    [18, -8.1, 15.3, 20.6],
    [19, -5.5, 16.3, 19.9],
  ],
  [
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
    [38, 20.4, 0.2, 29.2],
    [39, 21.6, -4.9, 31],
    [40, 23.1, -4, 29.5],
    [41, 22.4, -1.1, 28.5],
  ],
  [
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
    [76, -14, 0.3, 32.7],
    [77, -11, 3.3, 32],
    [78, -11.5, 7.2, 28.9],
    [79, -10, 8.1, 28.6],
    [80, -10.3, 9.5, 27.2],
    [81, -8.7, 10.6, 26.6],
    [82, -9.2, 12.2, 24.6],
  ],
  [
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
    [91, -35.1, 0.2, 6.2],
    [92, -35.1, 0.9, 3],
    [93, -31.9, 5.6, 5],
    [94, -31.9, 6, 2.21],
    [95, -30.7, 7.6, 0.4],
  ],
  [
    [96, -32.5, 3.3, -9.4],
    [97, -27.9, 9.7, -7.4],
    [98, -29.9, 5.2, -12.9],
    [99, -27.2, 7.9, -13.8],
    [100, -24.4, 10.5, -13.9],
    [101, -34.8, -2.4, -12.1],
    [102, -33.4, -1.1, -14.1],
  ],
  [
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
    [129, -5, 2.5, -34],
    [130, -0.2, 3.1, -34],
  ],
  [
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

// const position = [
//   [
//     // URAS
//     [0, 0, 40, 0],
//     [1, -3.1, 39.9, -0.7],
//     [2, -6, 39.5, -2.1],
//     [3, -8.4, 38.7, -5.7],
//     [4, -10.5, 38.3, -5.1],
//     [5, -11.4, 37.3, -8.9],
//     [6, -8.6, 38, -9.2],
//   ],
//   [
//     // CAMELOPARDALTS
//     [7, 7.1, 39, 5.5],
//     [8, 11.3, 36.8, 10.8],
//     [9, 10.2, 38.5, 3.2],
//     [10, 10.4, 38.6, -2],
//     [11, 15.5, 36.8, 3],
//     [12, 18.8, 35, 5],
//   ],
//   [
//     //CEPHEUS
//     [13, -1.3, 38.7, 10.2],
//     [14, -6.2, 37.4, 12.9],
//     [15, -2.5, 36.5, 16.1],
//     [16, -7.1, 34.3, 19.4],
//     [17, -9, 35.2, 16.7],
//     [18, -8.1, 33.3, 20.6],
//     [19, -5.5, 34.3, 19.9],
//   ],
//   [
//     //CASSIOPEIA
//     [20, 3, 36.1, 17],
//     [21, 5, 34.8, 19],
//     [22, 7, 34.5, 19],
//     [23, 8, 35.5, 16.7],
//     [24, 4.4, 33.8, 21],
//     [25, 2.9, 33.1, 22.2],
//     [26, 3.9, 31.8, 24],
//     [27, 0.6, 33.9, 21.3],
//   ],
//   [
//     // ANDROMEDA
//     [28, 6.5, 29.8, 25.9],
//     [29, 6.3, 24.5, 31],
//     [30, -0.6, 28.9, 27.7],
//     [31, -4.6, 26.7, 29.4],
//     [32, 5, 20.6, 33.9],
//     [33, 2.3, 22.6, 32.9],
//     [34, 2, 17.7, 35.8],
//     [35, 8.5, 15.2, 36],
//     [36, 10.3, 21.1, 32.4],
//     [37, 12.2, 27.4, 26.5],
//   ],
//   [
//     // TRIANGULUM
//     [38, 20.4, 18.2, 29.2],
//     [39, 21.6, 13.1, 31],
//     [40, 23.1, 14, 29.5],
//     [41, 22.4, 16.9, 28.5],
//   ],
//   [
//     // PERSEUS
//     [42, 20.8, 25.4, 22.8],
//     [43, 20.4, 26.7, 21.7],
//     [44, 19.2, 28.6, 20.3],
//     [45, 17.5, 30.7, 18.7],
//     [46, 15.4, 31.9, 18.5],
//     [47, 14.1, 33.3, 17.1],
//     [48, 16.4, 32.1, 17.4],
//     [49, 18.8, 30.8, 17.2],
//     [50, 20.4, 30.4, 16.1],
//     [51, 23.5, 27.7, 16.8],
//     [52, 26.2, 25.8, 15.7],
//     [53, 28, 23.5, 16.3],
//     [54, 29.5, 20.2, 17.9],
//     [55, 21.7, 30.3, 14.5],
//     [56, 21.9, 30.7, 13.4],
//     [57, 20.1, 32, 13.2],
//   ],
//   [
//     // AURIGA
//     [58, 27.1, 28.9, 5.6],
//     [59, 29.5, 26.2, 6.5],
//     [60, 29.5, 25.5, 9],
//     [61, 28, 27.3, 8.5],
//     [62, 32.8, 20.8, 9.5],
//     [63, 35.1, 17.4, 8],
//     [64, 23.5, 32.3, 2],
//     [65, 28.1, 28.4, 1.9],
//     [66, 32.1, 23.8, 2.1],
//     [67, 35.8, 16.6, 6.5],
//   ],
//   [
//     // LINX
//     [68, 25.2, 31.1, -0.8],
//     [69, 25.1, 30.9, -3.9],
//     [70, 30.3, 25.5, -5.8],
//     [71, 31.2, 21.1, -13.5],
//     [72, 29.3, 20.3, -18.1],
//     [73, 31, 16.1, -19.5],
//     [74, 29.5, 16.1, -21.7],
//     [75, 30.3, 11.8, -23.3],
//   ],
//   [
//     // LACERTA
//     [76, -14, 18.3, 32.7],
//     [77, -11, 21.3, 32],
//     [78, -11.5, 25.2, 28.9],
//     [79, -10, 26.1, 28.6],
//     [80, -10.3, 27.5, 27.2],
//     [81, -8.7, 28.6, 26.6],
//     [82, -9.2, 30.2, 24.6],
//   ],
//   [
//     //CYGNUS
//     [83, -20.6, 18.5, 28.9],
//     [84, -22.2, 20.5, 26.2],
//     [85, -21.4, 25.6, 22.1],
//     [86, -17.6, 28.6, 21.7],
//     [87, -22.2, 28, 18],
//     [88, -21, 30.9, 14.3],
//     [89, -24.7, 22.3, 22.2],
//     [90, -27.9, 18.7, 21.7],
//   ],
//   [
//     // LIRA
//     [91, -35.1, 18.2, 6.2],
//     [92, -35.1, 18.9, 3],
//     [93, -31.9, 23.6, 5],
//     [94, -31.9, 24, 2.21],
//     [95, -30.7, 25.6, 0.4],
//   ],
//   [
//     // HERACULES
//     [96, -32.5, 21.3, -9.4],
//     [97, -27.9, 27.7, -7.4],
//     [98, -29.9, 23.2, -12.9],
//     [99, -27.2, 25.9, -13.8],
//     [100, -24.4, 28.5, -13.9],
//     [101, -34.8, 15.6, -12.1],
//     [102, -33.4, 16.9, -14.1],
//   ],
//   [
//     // DRACO
//     [103, -24.1, 31.5, -5.4],
//     [104, -20.9, 33.6, -5.7],
//     [105, -21.9, 32.7, -7.1],
//     [106, -23.6, 31.4, -7.5],
//     [107, -20.6, 34.2, -2],
//     [108, -16.7, 36.3, -1.6],
//     [109, -15, 37.1, -0.2],
//     [110, -13.3, 37.7, -2.2],
//     [111, -13.9, 37.3, -3.8],
//     [112, -16.3, 35.8, -7.4],
//     [113, -16.9, 34.7, -10.4],
//     [114, -16.9, 34.6, -10.7],
//     [115, -17.4, 33.6, -13],
//     [116, -14.9, 34, -15],
//     [117, -8.8, 35.1, -17.1],
//     [118, -3.2, 36.7, -15.7],
//     [119, -0.7, 36.7, -15.9],
//   ],
//   [
//     // BOOTES
//     [120, -23.7, 20.7, -24.7],
//     [121, -21.9, 18.8, -27.7],
//     [122, -17.4, 24.1, -26.8],
//     [123, -15.1, 27.6, -24.7],
//     [124, -16.9, 27.9, -23.1],
//     [125, -27.7, 14.1, -25.2],
//     [126, -28, 7.7, -27.5],
//     [127, -30.5, 11.3, -23.3],
//     [128, -24.9, 9.9, -29.7],
//   ],
//   [
//     // CANES VENATICI
//     [129, -5, 20.5, -34],
//     [130, -0.2, 21.1, -34],
//   ],
//   [
//     // URSA MAJOR
//     [131, -11.4, 30.2, -23.6],
//     [132, -6.6, 33, -21.6],
//     [133, -3.8, 33.3, -21.8],
//     [134, -0.4, 33.7, -21.5],
//     [135, -1.3, 32.3, -23.5],
//     [136, 6.5, 32.6, -22.3],
//     [137, 5.1, 35.1, -18.5],
//     [138, 9.7, 35.3, -16.1],
//     [139, 14.2, 34.5, -14.5],
//     [140, 9.8, 33.8, -19],
//     [141, 11.7, 32.2, -20.6],
//     [142, 14.3, 31.1, -20.7],
//     [143, 17.6, 29.1, -21.1],
//     [144, 17.7, 29.8, -19.9],
//     [145, 2.2, 30, -26.4],
//     [146, 6.4, 27.9, -27.9],
//     [147, 12, 27.7, -26.2],
//     [148, 11.8, 25.7, -28.3],
//     [149, 6.1, 21.3, -33.3],
//     [150, 6, 18.6, -34.9],
//   ],
// ];

const totalStarCount = 129;

const starsState = atom({
  key: "stars",
  default: [],
});

const curPageState = atom({
  key: "curPage",
  default: 0,
});

const tmpStars = [
  // fetchData
  {
    boardIndex: 1,
    userIndex: 1,
    boardRegTime: "2099-99-99",
    boardInputDate: "2099-99-99",
    boardContent: "더미 컨텐츠",
    boardLocation: 1,
    boardAccess: "OPEN",
    boardLike: 3,
    tagContent: [],
  },
  {
    boardIndex: 2,
    userIndex: 1,
    boardRegTime: "2099-99-99",
    boardInputDate: "2099-99-99",
    boardContent: "더미 컨텐츠",
    boardLocation: 0,
    boardAccess: "CLOSE",
    boardLike: 3,
    tagContent: [],
  },
  {
    boardIndex: 3,
    userIndex: 1,
    boardRegTime: "2099-99-99",
    boardInputDate: "2099-99-99",
    boardContent: "더미 컨텐츠",
    boardLocation: 2,
    boardAccess: "OPEN",
    boardLike: 3,
    tagContent: [],
  },
  {
    boardIndex: 3,
    userIndex: 1,
    boardRegTime: "2099-99-99",
    boardInputDate: "2099-99-99",
    boardContent: "더미 컨텐츠",
    boardLocation: 3,
    boardAccess: "OPEN",
    boardLike: 3,
    tagContent: [],
  },
  {
    boardIndex: 3,
    userIndex: 1,
    boardRegTime: "2099-99-99",
    boardInputDate: "2099-99-99",
    boardContent: "더미 컨텐츠",
    boardLocation: 4,
    boardAccess: "OPEN",
    boardLike: 3,
    tagContent: [],
  },
];

// isAddedStar : 등록된 별 체크를 위한 Map
const isAddedStar = new Map();

// 별자리 이어짐 체크
const constellationCheck = (starNum) => {
  const curStarNum = starNum % totalStarCount;
  let res = true;

  if (curStarNum < 5) {
    for (let i = 0; i < 5; i++) {
      if (!isAddedStar.has(i)) {
        res = false;
        break;
      }
    }
  } else if (curStarNum < 7) {
    for (let i = 5; i < 7; i++) {
      if (!isAddedStar.has(i)) {
        res = false;
        break;
      }
    }
  }
  return res;
};

function Cube(props) {
  return (
    <>
      <mesh>
        <boxGeometry args={[100, 100, 100]} />
        <meshStandardMaterial color={"black"} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

function Line(props) {
  console.log("LINE MOUNTED");

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(props.points);

  return (
    <>
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach="material" transparent={props.lineColor} opacity={0} />
      </line>
    </>
  );
}

function Sphere(props) {
  console.log("SPHERE MOUNTED");

  const mesh = useRef(null);

  return (
    <mesh ref={mesh} position={props.position}>
      <sphereGeometry args={props.size} />
      <meshStandardMaterial color={props.color} side={props.type === "double" ? THREE.DoubleSide : props.type === "front" ? THREE.FrontSide : THREE.BackSide} />
    </mesh>
  );
}

function Star(props) {
  console.log(`STAR ${props.location} MOUNTED`);

  const mesh = useRef(null);
  const [stars, setStars] = useRecoilState(starsState);
  const [curStarState, setCurStarState] = useState(null);

  useEffect(() => {
    setCurStarState(isAddedStar.get(props.location));
  }, [stars]);

  const colors = {
    OPEN: "yellow",
    CLOSE: "red",
  };

  const updateStarState = () => {
    // 등록된 별이 아닐 때
    if (!curStarState) {
      if (window.confirm("별을 등록할까요?")) {
        // axios : 별 등록 요청
        // {현재 별 페이지 번호 - 1} * {한 페이지당 별 개수} + {현재 별의 위치 번호} -> 별의 location 값
        // 별 등록이 성공적으로 이루어졌다면 별 상태를 바꾼다 -> 요건 추후에 API에 맞춰서 수정
        setCurStarState({ boardAccess: "OPEN" });

        // starData : 임시 데이터, 작성된 게시글로 추후 치환
        const starData = {
          boardIndex: 2,
          userIndex: 1,
          boardRegTime: "2099-99-99",
          boardInputDate: "2099-99-99",
          boardContent: "더미 컨텐츠",
          boardLocation: props.location,
          boardAccess: curStarState,
          boardLike: 3,
          tagContent: [],
        };

        isAddedStar.set(props.location, starData);

        // 별자리가 완성됐을 때, 선 보이게 하기
        if (constellationCheck(props.location)) {
          props.setLineColor(false);
        }
      }

      // 등록된 별일 때
    } else {
      if (curStarState.boardAccess === "OPEN") {
        if (window.confirm("별 상세 내용 \n 별을 비공개 처리할까요?")) {
          // axios : 별 정보 수정 요청 (공개범위수정)
          let tmp = { ...isAddedStar.get(props.location) };
          tmp.boardAccess = "CLOSE";
          setCurStarState(tmp);
        }
      } else if (curStarState.boardAccess === "CLOSE") {
        if (window.confirm("비공개 별입니다 \n 별을 삭제할까요?")) {
          // axios : 별 정보 수정 요청 (별 삭제 처리)
          props.setLineColor(true);
          isAddedStar.delete(props.location);
          setCurStarState(null);
        }
      }
    }
  };

  return (
    <mesh
      ref={mesh}
      position={props.position}
      onClick={() => {
        updateStarState();
      }}
    >
      <sphereGeometry args={props.size} />
      <meshStandardMaterial color={curStarState ? colors[curStarState.boardAccess] : "grey"} />
    </mesh>
  );
}

function GroupStar(props) {
  console.log(`GROUP-STAR ${props.groupNum} MOUNTED`);

  const [stars, setStars] = useRecoilState(starsState);
  const [lineState, setLineState] = useState([]);
  const [lineColor, setLineColor] = useState(true);
  const group = useRef(null);

  useEffect(() => {
    setLineState(props.position.map((val) => new THREE.Vector3(...val.slice(1, 4))));

    const lastStarOfThisGroup = props.position[props.position.length - 1][0];
    if (constellationCheck(lastStarOfThisGroup)) {
      setLineColor(false);
    }
  }, [stars]);

  useFrame((state, delta) => {
    group.current.rotation.y += delta / 300;
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
          <Star key={index} size={[0.13, 32, 32]} positions={position} position={val.slice(1, 4)} location={val[0]} lineState={lineState} setLineState={setLineState} setLineColor={setLineColor} />
        ))}
        <Line points={lineState} lineColor={lineColor} />
      </group>
    </>
  );
}

function SceneStars() {
  console.log("SCENE-STARS MOUNTED");

  const [stars, setStars] = useRecoilState(starsState);
  const [curPage, setCurPage] = useRecoilState(curPageState);
  const REST_API_URI = ""; // env 설정
  const member_index = ""; // 페이지 url에서 파싱

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${REST_API_URI}/board/start/${member_index}/?page=${curPage}`) // member_index : router url의 유저 id
        .then((response) => {
          isAddedStar.clear();
          response.data.BoardListResponseDtoList.forEach((star) => isAddedStar.set(star.boardLocation, star));
          setStars(response.data);
        })
        .catch((e) => {
          // 임시 데이터
          console.log(e);
          isAddedStar.clear();
          tmpStars.forEach((star) => isAddedStar.set(star.boardLocation, star));
          console.log(isAddedStar);
          setStars(tmpStars);
        });
    };
    fetchData();
  }, [curPage]);

  return (
    <>
      {position.map((val, index) => {
        return <GroupStar key={index} groupNum={index} position={val} />;
      })}
    </>
  );
}

function SceneLights() {
  console.log("SCENE-LIGHTS MOUNTED");
  return (
    <>
      {/* 광원 */}
      <directionalLight position={[0, 0, 5]} intensity={2} />
      <ambientLight intensity={2} />

      {/* 중심점 - 추후 삭제 */}
      <Sphere size={[0.01, 16, 16]} position={[0.5, -7.8, -1]} color={"red"} />
    </>
  );
}

function SceneEnvironment() {
  return (
    <>
      {/* 우주 배경 */}
      {/* <Sphere size={[40, 48, 48]} position={[0, -4, 0]} color={"black"} type={"back"} /> */}
      <Cube />

      {/* 바닥면 */}
      <Sphere size={[2, 48, 48, 0, Math.PI * 2]} position={[0, -2.2, 0]} color={"orange"} />
      {/* <Sphere size={[2, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 0, -10]} color={"orange"} /> */}
    </>
  );
}

function UserSpace() {
  return (
    <>
      <div id="canvas-container" style={{ height: "97vh", width: "97vw" }}>
        <Canvas>
          <SceneStars />
          <SceneLights />
          <SceneEnvironment />
          <OrbitControls dampingFactor={0.15} target={[0, 0, 0]} rotateSpeed={-0.15} enableZoom={true} />
          <PerspectiveCamera makeDefault position={[-0.01, 0, 0.1]} fov={60} zoom={1} aspect={window.innerWidth / window.innerHeight} />
          <axesHelper />
        </Canvas>
      </div>
    </>
  );
}

export default UserSpace;
