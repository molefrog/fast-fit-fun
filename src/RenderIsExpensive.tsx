/**
 * ChatGPT https://chat.openai.com/share/24dba9bb-b90c-4ade-a627-7934b7036873
 */

import React, {
  useState,
  useRef,
  useEffect,
  isValidElement,
  cloneElement,
  ReactElement,
  forwardRef,
  RefObject,
  useImperativeHandle,
} from "react";
import styled, { keyframes } from "styled-components";
import { nanoid } from "nanoid";
import { createPortal } from "react-dom";

const wiggleAnimation = (amplitude: number, maxHeight: number) => keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  50% { transform: translateY(-${maxHeight / 2}px) rotate(${amplitude}deg); opacity: 1; }
  100% { transform: translateY(-${maxHeight}px) rotate(0deg); opacity: 0; }
`;

const ParticleStyle = styled.div<{
  $size: number;
  $duration: number;
  $delay: number;
  $startX: number;
  $startY: number;
  $amplitude: number;
  $maxHeight: number;
}>`
  opacity: 0;
  pointer-events: none;
  user-select: none;

  position: fixed;
  left: ${(props) => props.$startX}px;
  top: ${(props) => props.$startY}px;

  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  font-size: ${(props) => props.$size}px;
  font-weight: bold;

  animation: ${(props) => wiggleAnimation(props.$amplitude, props.$maxHeight)}
    ${(props) => props.$duration}s linear ${(props) => props.$delay}s forwards;
  transform-origin: bottom center;
`;

const Particle: React.FC<{
  id: string;
  size: number;
  duration: number;
  delay: number;
  startX: number;
  startY: number;
  amplitude: number;
  maxHeight: number;
  onDone: (id: string) => void;
}> = ({ id, size, duration, delay, startX, startY, amplitude, maxHeight, onDone }) => {
  useEffect(() => {
    const timeout = setTimeout(() => onDone(id), (duration + delay) * 1000);
    return () => clearTimeout(timeout);
  }, [id, duration, delay, onDone]);

  return (
    <ParticleStyle
      $size={size}
      $duration={duration}
      $delay={delay}
      $startX={startX}
      $startY={startY}
      $amplitude={amplitude}
      $maxHeight={maxHeight}
    >
      $
    </ParticleStyle>
  );
};

export const ParticleEmitter = forwardRef(
  ({ targetRef }: { targetRef: RefObject<HTMLElement> }, ref) => {
    const [particles, setParticles] = useState<Record<string, JSX.Element>>({});

    const removeParticle = (id: string) => {
      setParticles((prevParticles) => {
        const newParticles = { ...prevParticles };
        delete newParticles[id];
        return newParticles;
      });
    };

    const emitParticles = () => {
      if (!(targetRef.current instanceof HTMLElement)) {
        return;
      }

      const numParticles = Math.floor(randomBetween(4, 8));
      const buttonRect = targetRef.current?.getBoundingClientRect();

      for (let i = 0; i < numParticles; i++) {
        const id = nanoid();
        const size = randomBetween(20, 32);
        const duration = randomBetween(0.5, 1.5);
        const delay = randomBetween(0, 0.2);
        const amplitude = randomBetween(-30, 30);
        const maxHeight = randomBetween(50, 150);
        const startX = buttonRect
          ? buttonRect.left + randomBetween(-size / 2, buttonRect.width - size / 2)
          : 0;
        const startY = buttonRect ? buttonRect.top - size : 0;

        const particleElement = (
          <Particle
            key={id}
            id={id}
            size={size}
            duration={duration}
            delay={delay}
            startX={startX}
            startY={startY}
            amplitude={amplitude}
            maxHeight={maxHeight}
            onDone={removeParticle}
          />
        );

        setParticles((prevParticles) => ({ ...prevParticles, [id]: particleElement }));
      }
    };

    const randomBetween = (min: number, max: number): number => {
      return Math.random() * (max - min) + min;
    };

    useImperativeHandle(ref, () => ({
      emitParticles,
    }));

    return <>{Object.values(particles)}</>;
  }
);

export const RenderIsExpensive = ({ children }: { children: ReactElement }) => {
  const firstRenderRef = useRef(true);

  const targetRef = useRef<HTMLElement>(null);
  const emitterRef = useRef<{ emitParticles: () => void }>(null);

  if (!isValidElement(children)) {
    return children;
  }

  useEffect(() => {
    if (!firstRenderRef.current) {
      emitterRef.current?.emitParticles();
    }

    firstRenderRef.current = false;
  });

  // @ts-ignore TODO
  const childrenWithRef = cloneElement(children, { ref: targetRef });

  return (
    <>
      {childrenWithRef}

      {createPortal(<ParticleEmitter ref={emitterRef} targetRef={targetRef} />, document.body)}
    </>
  );
};
