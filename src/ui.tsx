import { Squircle } from "@squircle-js/react";
import { useRef, useLayoutEffect, ComponentProps, forwardRef } from "react";
import rough from "roughjs";
import styled from "styled-components";

export const Button = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  ({ children, ...props }, ref) => {
    const key = typeof children === "string" ? String(children) : "";

    return (
      <Squircle key={key} cornerRadius={12} cornerSmoothing={1} asChild>
        <Btn ref={ref} {...props}>
          <span>{children}</span>
        </Btn>
      </Squircle>
    );
  }
);

export const WorkingArea = ({ children }: { children: React.ReactNode }) => {
  const size = 480;

  return (
    <Square $size={size} $gap={24}>
      <Grid width={size} gap={24} />
      <Inner>{children}</Inner>
    </Square>
  );
};

type GridProps = ComponentProps<"svg"> & {
  width: number;
  height?: number;
  gap: number;
};

export const Grid = ({ width, height = width, gap, ...props }: GridProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.firstChild.remove();
    }

    const rc = rough.svg(svg);

    svg.append(
      rc.rectangle(0, 0, 480, 480, {
        fill: "rgba(231, 228, 225, 0.5)",
        fillStyle: "zigzag",
        stroke: "none",
        hachureGap: 28,
        fillWeight: 20,
      })
    );

    svg.append(
      rc.rectangle(0, 0, 480, 480, {
        fill: "rgba(223, 100, 54, 0.75)",
        fillWeight: 1,
        fillStyle: "cross-hatch",
        hachureAngle: 0,
        roughness: 2,
        strokeWidth: 3,
        hachureGap: 60,
      })
    );
  }, []);

  return (
    <SVG
      width={width}
      height={height}
      viewBox={`${-gap} ${-gap} ${width + 2 * gap} ${height + 2 * gap}`}
      ref={svgRef}
      {...props}
    />
  );
};

export const UserIcon = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3C12.6863 3 10 5.68629 10 9C10 12.3137 12.6863 15 16 15C19.3137 15 22 12.3137 22 9C22 5.68629 19.3137 3 16 3Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 16.9297C11.1435 16.9297 9.36301 17.6672 8.05025 18.9799C6.7375 20.2927 6 22.0732 6 23.9297C6 24.7253 6.31607 25.4884 6.87868 26.051C7.44129 26.6136 8.20435 26.9297 9 26.9297H23C23.7957 26.9297 24.5587 26.6136 25.1213 26.051C25.6839 25.4884 26 24.7253 26 23.9297C26 22.0732 25.2625 20.2927 23.9497 18.9799C22.637 17.6672 20.8565 16.9297 19 16.9297H13Z"
        fill="currentColor"
      />
    </svg>
  );
};

const Square = styled.div<{ $size: number; $gap: number }>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  padding: ${(props) => props.$gap}px;
  position: relative;
`;

const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SVG = styled.svg`
  position: absolute;
  inset: 0 0 0 0;
  pointer-events: none;
`;

const Btn = styled.button`
  font-weight: 700;
  font-size: 28px;
  color: white;
  cursor: pointer;
  user-select: none;

  background: blue;
  padding: 14px 18px;
  box-shadow: inset 0px -2px 0px 4px #031298;
  text-shadow: 0px 1px 0px #333;

  > span {
    display: inline-block;
  }

  &:active {
    box-shadow: none;
    > span {
      transform: translateY(2px);
    }
  }
`;
