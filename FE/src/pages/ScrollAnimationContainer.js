import { Container } from "./styled";
import { useScrollAnimation } from "./useScrollAnimation";

const ScrollAnimationContainer = ({ children }) => {
const { ref, isInViewport } = useScrollAnimation();
return (
<Container ref={ref} className={isInViewport ? "frame-in" : ""}> 
{children}
</Container>
);
};

export default ScrollAnimationContainer;
