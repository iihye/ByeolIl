import styled, { keyframes } from "styled-components";

const frameInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(50%);
  }
  50% {
    opacity: 0.5;
    transform: translateY(25%);
  }

  100%{ 
    opacity: 1;
    transform: translateY(0%);
  }
`;


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  
  &.frame-in {
    animation: ${frameInAnimation} 2s forwards;
`;

const motion = keyframes`
  0% {padding-top: 0px;}
  20% {padding-top: 10px;}
  40% {padding-top: 0px;}
  60% {padding-top: 10px;}
  80% {padding-top: 0px;}
  100% {padding-top: 0px;}
`;
export const DownArrow = styled.img`
  width: 6rem; 
  height: 6rem; 
  filter: invert(100%);
  animation: ${motion} 1.3s linear 0s infinite;
`;