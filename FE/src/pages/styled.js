import styled, { keyframes } from "styled-components";

const frameInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(50%);
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
