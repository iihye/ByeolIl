import { useEffect, useRef, useState } from "react";
import { DirectionalLightHelper } from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { CameraControls, OrbitControls, PerspectiveCamera, Wireframe } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";
import { constSelector } from "recoil";

function Cube({ position, size, color }) {
  console.log("CUBE MOUNTED");
  const mesh = useRef(null);

  return (
    <mesh position={position} ref={mesh}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Line(props) {
  const points = [
    [1, 10, -30],
    [2, 7, -30],
    [3, 13, -30],
    [4, 5, -30],
    [13, 5, -30],
    [14, 8, -30],
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: "black" });
  return (
    <mesh geometry={geometry}>
      <lineBasicMaterial />
    </mesh>
  );
}

function Sphere(props) {
  console.log("SPHERE MOUNTED");
  /**
   * type : "front", "back", "double", "star"
   */

  const mesh = useRef(null);

  return (
    <mesh ref={mesh} position={props.position}>
      <sphereGeometry args={props.size} />
      <meshStandardMaterial color={props.color} side={props.type === "double" ? THREE.DoubleSide : props.type === "front" ? THREE.FrontSide : THREE.BackSide} />
    </mesh>
  );
}

function Star(props) {
  console.log("STAR MOUNTED");
  /**
   * props : size / position / location / constellationCheck / isPossesed /
   */

  const mesh = useRef(null);
  const [curStarState, setCurStarState] = useState(props.isPossesed.get(props.location));
  const [starState, setStarState] = useState("unwritten");
  const colors = {
    unwritten: "grey",
    OPEN: "yellow",
    CLOSE: "red",
  };

  useEffect(() => {
    // 초기 색 칠하기
    if (curStarState) {
      setStarState(curStarState.boardAccess);
    }
  }, []);

  const updateStarState = () => {
    // 요 페이지에서는 사실 눌렀을 때 색 변화를 일으키는 게 아니라, 상세보기 / 글쓰기 등 모달창만 띄워주면 됨
    // 아래는 테스트 코드,, 등록 / 삭제에 따른 색 변화는 글쓰기, 글삭제 기능 추가 후 연동해서 작성해야 할 듯

    // 등록된 별이 아닐 때
    if (!curStarState) {
      if (window.confirm("별을 등록할까요?")) {
        setStarState("OPEN");
        // axios : 별 등록 요청
        // {현재 별 페이지 번호} * {한 페이지당 별 개수} + {현재 별의 위치 번호} -> 별의 location 값
      }

      // 등록된 별일 때
    } else {
      if (curStarState.boardAccess === "OPEN") {
        if (window.confirm("별 상세 내용 \n 별을 비공개 처리할까요?")) {
          curStarState.boardAccess = "CLOSE";
          setStarState("CLOSE");
          // axios : 별 정보 수정 요청 (공개범위수정)
        }
      }
      if (curStarState.boardAccess === "CLOSE") {
        if (window.confirm("비공개 별입니다 \n 별을 삭제할까요?")) {
          setStarState("unwritten");
          // axios : 별 정보 수정 요청 (별 삭제 처리)
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
      <meshStandardMaterial color={colors[starState]} />
    </mesh>
  );
}

function Scene() {
  console.log("SCENE MOUNTED");
  const [lineState, setLineState] = useState([]);

  useEffect(() => {
    starTail.forEach((val, index) => {
      if (constellationCheck(val)) {
        // 별자리 잇는 코드 작성해야함
        let tmp = [...lineState];
        for (let i = 0; i < val; i++) {
          tmp.push([position[i], position[i + 1]]);
        }
        setLineState(tmp);
      }
    });

    console.log(lineState);

    return () => {
      setLineState([]);
    };
  }, []);

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
  ];

  // position : 변화할 일 없는 값
  const position = [
    [1, 10, -30],
    [2, 7, -30],
    [3, 13, -30],
    [4, 5, -30],
    [13, 5, -30],
    [14, 8, -30],
  ];

  // isPossesed : 등록된 별 체크를 위한 Map
  const isPossesed = new Map();
  stars.forEach((val) => isPossesed.set(val.boardLocation, val));

  // starTail : 각 별자리 마다 가장 큰 location 번호
  const starTail = [3, 5];

  // 별자리 이어짐 체크
  const constellationCheck = (starNum) => {
    // starNum이 한 페이지 내 별 개수보다 커질 경우도 생각해서 수정해야함

    let curStarNum = starNum % position.length;
    let res = true;

    if (curStarNum < 4) {
      for (let i = 0; i < 4; i++) {
        if (!isPossesed.has(i)) {
          res = false;
          break;
        }
      }
    } else if (curStarNum < 6) {
      for (let i = 4; i < 6; i++) {
        if (!isPossesed.has(i)) {
          res = false;
          break;
        }
      }
    }

    return res;
  };

  const testLineFunc = () => {
    const tmp = [...lineState];
    tmp.push("123");
    setLineState(tmp);
  };

  return (
    <>
      {/* 광원 */}
      <directionalLight position={[0, 0, 2]} intensity={3} />
      <ambientLight intensity={1} />

      {/* 별 */}
      {/* index : 별 location 값이랑 */}
      {position.map((i, index) => {
        return <Star size={[0.2, 32, 32]} position={i} location={index} key={index} constellationCheck={constellationCheck} isPossesed={isPossesed} func={testLineFunc} />;
      })}

      {/* 테스트 오브젝트 */}
      {/* <primitive object={gltf.scene} position={[0, -10, 0]} /> */}

      {/* 중심점 */}
      <Sphere size={[0.01, 16, 16]} position={[0.5, -7.8, -1]} color={"red"} type={"wireframe"} />

      {/* 우주 배경 */}
      <Sphere size={[40, 48, 48]} position={[0, -4, 0]} color={"black"} type={"back"} />

      {/* 바닥면 */}
      <Cube size={[100, 0.1, 100]} position={[0, -13, 0]} color={"orange"} />
    </>
  );
}

function UserSpace() {
  return (
    <>
      <div id="canvas-container" style={{ height: "100vh", width: "100vw" }}>
        <Canvas>
          <Scene type={3} />
          <OrbitControls dampingFactor={0.12} minPolarAngle={(Math.PI * 2.7) / 5} maxPolarAngle={Math.PI} target={[0.5, -7.8, -1]} rotateSpeed={-0.15} enableZoom={false} />
          <PerspectiveCamera makeDefault position={[0, -8, 0]} fov={110} zoom={3} aspect={window.innerWidth / window.innerHeight} />
        </Canvas>
      </div>
    </>
  );
}

export default UserSpace;
