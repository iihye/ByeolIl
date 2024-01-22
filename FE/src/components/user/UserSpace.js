import { useEffect, useRef, useState } from "react";
import { DirectionalLightHelper } from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { CameraControls, OrbitControls, PerspectiveCamera, Wireframe } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";

function Cube({ position, size, color }) {
  const mesh = useRef(null);

  return (
    <mesh position={position} ref={mesh}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Sphere(props) {
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
  /**
   * type : "front", "back", "double", "star"
   */
  const mesh = useRef(null);
  const [starState, setStarState] = useState("unwritten");

  const colors = {
    unwritten: "grey",
    "written-open": "yellow",
    "written-close": "red",
  };

  const updateStarState = () => {
    if (starState === "unwritten") {
      if (window.confirm("별을 등록할까요?")) {
        setStarState("written-open");
        // axios : 별 등록 요청
      }
    } else {
      if (starState === "written-open") {
        if (window.confirm("별 상세 내용 \n 별을 비공개 처리할까요?")) {
          setStarState("written-close");
          // axios : 별 정보 수정 요청 (공개범위수정)
        }
      }
      if (starState === "written-close") {
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
  const stars = [
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
  ];

  const position = [
    [1, 10, -30],
    [2, 7, -30],
    [3, 13, -30],
    [4, 5, -30],
  ];

  return (
    <>
      {/* 광원 */}
      <directionalLight position={[0, 0, 2]} intensity={3} />
      <ambientLight intensity={1} />

      {/* 별 */}
      {position.map((i, index) => {
        return <Star size={[0.2, 32, 32]} position={i} stars={stars} key={index} />;
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
