import { useEffect, useRef, useState } from "react";
import { DirectionalLightHelper } from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ArcballControls, CameraControls, FirstPersonControls, FlyControls, MapControls, OrbitControls, PerspectiveCamera, PointerLockControls, Wireframe, useHelper } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

// starTail : 각 별자리 마다 가장 큰 location 번호
const starTail = [3, 5];

// position : 변화할 일 없는 값
const position = [
  [
    [0, 1, 10, -30],
    [1, 2, 7, -30],
    [2, 4, 5, -30],
    [3, 3, 13, -30],
  ],
  [
    [4, 13, 5, -30],
    [5, 14, 8, -30],
  ],
];

const totalStarCount = 6;

const stars = [
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
stars.forEach((val) => isAddedStar.set(val.boardLocation, val));

// 별자리 이어짐 체크
const constellationCheck = (starNum) => {
  // starNum이 한 페이지 내 별 개수보다 커질 경우도 생각
  let curStarNum = starNum % totalStarCount;
  let res = true;

  if (curStarNum < 4) {
    for (let i = 0; i < 4; i++) {
      if (!isAddedStar.has(i)) {
        res = false;
        break;
      }
    }
  } else if (curStarNum < 6) {
    for (let i = 4; i < 6; i++) {
      if (!isAddedStar.has(i)) {
        res = false;
        break;
      }
    }
  }
  return res;
};

function Line(props) {
  const ref = useRef(null);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(props.points);

  return (
    <>
      <line ref={ref} geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color={"white"} linewidth={10} />
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
  const mesh = useRef(null);
  const [curStarState, setCurStarState] = useState(isAddedStar.get(props.location));
  const colors = {
    OPEN: "yellow",
    CLOSE: "red",
  };

  const updateStarState = () => {
    // 요 페이지에서는 사실 눌렀을 때 색 변화를 일으키는 게 아니라, 상세보기 / 글쓰기 등 모달창만 띄워주면 됨
    // 아래는 테스트 코드,, 등록 / 삭제에 따른 색 변화는 글쓰기, 글삭제 기능 추가 후 연동해서 작성해야 할 듯
    // 등록된 별이 아닐 때
    if (!curStarState) {
      if (window.confirm("별을 등록할까요?")) {
        // axios : 별 등록 요청
        // {현재 별 페이지 번호} * {한 페이지당 별 개수} + {현재 별의 위치 번호} -> 별의 location 값
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

        // 별 등록 후, 별자리 이어짐 체크 및 별자리 그리기
        if (constellationCheck(props.location)) {
          for (let i = 0; i < starTail.length; i++) {
            if (props.location <= starTail[i]) {
              let points = [];

              props.positions.forEach((element, index) => {
                points.push(new THREE.Vector3(...element.slice(1, 4)));
              });

              props.setLineState(points);
              break;
            }
          }
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
          for (let i = 0; i < starTail.length; i++) {
            if (props.location <= starTail[i]) {
              props.setLineState([]);
              break;
            }
          }
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
  const [lineState, setLineState] = useState([]);
  const position = props.position;

  useEffect(() => {
    const lastStarOfThisGroup = position[position.length - 1][0];
    if (constellationCheck(lastStarOfThisGroup)) {
      let points = [];
      position.forEach((element, index) => {
        points.push(new THREE.Vector3(...element.slice(1, 4)));
      });
      setLineState(points);
    }
  }, []);

  return (
    <>
      {position.map((val, index) => (
        <Star key={index} size={[0.2, 32, 32]} positions={position} position={val.slice(1, 4)} location={val[0]} lineState={lineState} setLineState={setLineState} />
      ))}
      <Line points={lineState} />
    </>
  );
}

function SceneStars() {
  console.log("SCENE MOUNTED");

  // useEffect(() => {
  //   let cur = 0;
  //   let tmp = [];
  //   starTail.forEach((val, index) => {
  //     if (constellationCheck(val)) {
  //       let points = [];
  //       for (let i = cur; i <= val; i++) {
  //         points.push(new THREE.Vector3(...position[i]));
  //       }
  //       cur = val + 1;
  //       tmp.push(points);
  //     }
  //   });
  //   setLineState(tmp);
  // }, []);

  return (
    <>
      {/* 별
      {/* index : 별 location 값이랑 동일 */}
      {/* {position.map((i, index) => {
        return (
          <Star
            size={[0.2, 32, 32]}
            position={i}
            location={index % position.length}
            key={index}
            constellationCheck={constellationCheck}
            isAddedStar={isAddedStar}
            setLineState={setLineState}
            lineState={lineState}
          />
        );
      })} */}

      {/* 별자리 선 */}
      {/* {lineState.map((_, index) => {
        return <Line points={lineState[index]} key={index} />;
      })}  */}
      {position.map((val, index) => {
        return <GroupStar position={val} />;
      })}
    </>
  );
}

function SceneLights() {
  return (
    <>
      {/* 광원 */}
      <directionalLight position={[0, 0, 2]} intensity={3} />
      <ambientLight intensity={1} />

      {/* 중심점 - 추후 삭제 */}
      <Sphere size={[0.01, 16, 16]} position={[0.5, -7.8, -1]} color={"red"} />
    </>
  );
}

function SceneEnvironment() {
  return (
    <>
      {/* 우주 배경 */}
      <Sphere size={[40, 48, 48]} position={[0, -4, 0]} color={"black"} type={"back"} />

      {/* 바닥면 */}
      <Sphere size={[2, 48, 48, 0, Math.PI * 2]} position={[0, -2.2, 0]} color={"orange"} />
      {/* <Sphere size={[2, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 0, -10]} color={"orange"} /> */}
    </>
  );
}
function UserSpace() {
  return (
    <>
      <div id="canvas-container" style={{ height: "100vh", width: "100vw" }}>
        <Canvas>
          <SceneStars />
          <SceneLights />
          <SceneEnvironment />
          <OrbitControls dampingFactor={0.12} target={[0, 0, 0]} rotateSpeed={-0.15} />
          <PerspectiveCamera makeDefault position={[-0.01, 0, 0.1]} fov={60} zoom={1} aspect={window.innerWidth / window.innerHeight} />
        </Canvas>
      </div>
    </>
  );
}

export default UserSpace;
