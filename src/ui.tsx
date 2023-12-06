import { Squircle } from "@squircle-js/react";
import { useRef, useLayoutEffect, ComponentProps, forwardRef } from "react";
import rough from "roughjs";
import styled from "styled-components";
import { useElementSize, useMediaQuery } from "usehooks-ts";

export const Button = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  ({ children, ...props }, ref) => {
    const key = useRef(0); // recalculate squircle

    return (
      <Button_ {...props} ref={ref}>
        <Squircle key={key.current++} cornerRadius={12} cornerSmoothing={1} asChild>
          <ButtonMasked>
            <span>{children}</span>
          </ButtonMasked>
        </Squircle>
      </Button_>
    );
  }
);

export type WorkingAreaProps = ComponentProps<"div"> & { size?: number; mobileSize?: number };

export const WorkingArea = ({
  size = 540,
  mobileSize = 420,
  children,
  ...props
}: WorkingAreaProps) => {
  const gap = 32;

  const matches = useMediaQuery("(min-width: 640px)");
  const width = matches ? size : mobileSize;

  return (
    <Square style={{ width: `${width}px`, height: `${width}px` }} $gap={gap} {...props}>
      <Grid width={width} gap={gap} />
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
      rc.rectangle(0, 0, width, height, {
        fill: "rgba(231, 228, 225, 0.65)",
        fillStyle: "zigzag",
        stroke: "none",
        hachureGap: 28,
        fillWeight: 20,
      })
    );

    svg.append(
      rc.rectangle(0, 0, width, height, {
        fill: "rgba(223, 100, 54, 0.75)",
        fillWeight: 1,
        fillStyle: "cross-hatch",
        hachureAngle: 0,
        roughness: 2,
        strokeWidth: 3,
        hachureGap: 60,
      })
    );
  }, [width]);

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

export const CommentIcon = () => {
  return (
    <svg width="64" height="58" viewBox="0 0 64 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M63.2298 12.112C63.2038 7.21395 59.3358 2.32095 54.2948 0.690951L54.3158 0.58095C51.0998 -0.33805 47.5048 0.0979502 44.0278 0.51895C41.8148 0.78695 39.7268 1.03995 37.7358 0.967951C34.4518 0.848951 31.9618 0.82795 29.4148 0.90095C27.2718 0.96495 25.0948 0.848951 22.9878 0.738951C20.8798 0.628951 18.6988 0.51495 16.5428 0.57395C13.8708 0.64795 10.0408 0.948952 7.64481 2.70695C4.50181 5.01295 3.08081 9.66695 2.04281 13.066C0.999805 16.483 0.730805 20.228 0.545805 23.77C0.434805 25.887 0.441806 27.974 0.564806 29.976C0.602806 30.591 0.587806 31.265 0.572806 31.978C0.540806 33.416 0.508806 34.9019 0.902806 36.1629C1.83681 39.1509 4.52781 41.7239 7.92381 42.8779C8.87381 43.1999 10.0678 43.477 11.1988 43.636C12.3808 43.803 13.4868 43.598 14.5548 43.401C15.3398 43.256 16.0618 43.113 16.8428 43.122C17.0198 43.122 17.2538 43.1179 17.5158 43.1119C18.3118 43.0929 19.6448 43.066 20.1098 43.234C20.1718 43.256 20.2298 43.274 20.2848 43.288C20.3188 43.443 20.3648 43.615 20.4188 43.803C20.5368 44.21 20.5588 44.718 20.5788 45.209C20.5868 45.392 20.5948 45.5709 20.6058 45.7419C20.6308 46.0929 20.6438 46.4449 20.6568 46.7969C20.6818 47.4659 20.7078 48.158 20.8108 48.845C20.9378 49.687 20.8878 50.5499 20.8348 51.4629C20.7738 52.5139 20.7108 53.601 20.9408 54.662C21.3378 56.487 22.1398 57.5689 23.3238 57.8759C23.5548 57.9359 23.7938 57.9649 24.0398 57.9649C26.9148 57.9649 30.7828 54.047 34.2448 50.123C34.5028 49.831 34.7208 49.583 34.8918 49.396C35.2668 48.985 35.6318 48.542 35.9998 48.094C36.9038 46.994 37.8378 45.8559 39.0078 45.1549C39.7578 44.7059 40.3008 44.8379 41.2038 45.0589L41.6828 45.1729C43.2968 45.5349 44.9498 45.412 46.5608 45.292L47.5678 45.221C51.1548 44.975 54.8638 44.72 57.7348 42.144C59.8298 40.263 61.1578 37.698 61.6808 34.52C62.0808 32.089 62.2718 29.571 62.4558 27.136C62.5528 25.856 62.6488 24.5789 62.7748 23.3149C62.8578 22.4769 62.9648 21.6419 63.0718 20.8079C63.4368 17.9839 63.8108 15.068 63.2298 12.112ZM28.4778 50.025C27.8158 50.812 26.9218 51.875 26.0658 52.57C26.2438 51.269 25.9388 49.565 25.6948 48.203C25.6088 47.72 25.5328 47.3019 25.5018 47.0039C25.4688 46.6859 25.4438 46.302 25.4158 45.882C25.3098 44.279 25.1778 42.2989 24.5088 41.1549L24.5648 41.0919C24.0578 40.4839 23.2388 39.797 22.3608 39.386L22.3888 39.2879C21.9338 39.1359 21.5648 38.931 21.1738 38.714C20.4348 38.303 19.6648 37.8799 18.4288 37.9119C17.4158 37.9389 16.4368 38.132 15.4908 38.317C14.3068 38.549 13.1878 38.769 12.0108 38.691C9.46781 38.521 7.83981 38.117 7.17281 37.492C6.08781 36.474 5.96981 34.064 5.89081 32.47L5.87281 32.104C5.57081 26.426 5.62081 21.8529 6.02881 17.7099C6.50081 12.9179 7.16881 9.03995 11.0288 6.36695C12.0878 5.63295 14.2288 5.21295 15.7698 5.13295C20.5688 4.88195 25.5408 5.06695 30.2238 5.27895C31.2298 5.32395 32.2538 5.46495 33.2448 5.60095C34.1888 5.72995 35.1648 5.86395 36.1418 5.91895C37.6118 5.99995 38.7878 5.71995 40.0378 5.42095C40.5618 5.29595 41.0948 5.16795 41.6628 5.06695C48.3258 3.88595 56.6578 3.68995 58.5068 9.46495C59.4318 12.357 59.7468 16.834 59.2588 19.804C59.0998 20.282 58.8898 22.384 58.5598 25.775C58.3028 28.421 57.9598 31.952 57.7448 32.962H57.6648L57.5908 33.374C56.8278 37.647 54.7418 39.781 50.8268 40.292C50.4098 40.347 49.9738 40.4099 49.5288 40.4749C47.6748 40.7449 45.5728 41.0519 43.8528 40.8209C43.4688 40.7699 43.1198 40.703 42.7858 40.639C41.7558 40.442 40.7828 40.258 39.4338 40.638C36.3718 41.503 33.7468 43.2409 32.0418 45.5329L31.5138 46.248C30.7548 47.279 30.0378 48.253 29.1848 49.203C28.9758 49.434 28.7378 49.716 28.4778 50.025Z"
        fill="currentColor"
      />
      <path
        d="M33.096 34.1518C33.804 34.1808 34.536 34.2088 35.267 34.1708C35.691 34.1478 36.111 34.1178 36.531 34.0888C37.465 34.0228 38.348 33.9578 39.257 33.9738C39.712 33.9798 40.166 34.0178 40.621 34.0558C41.049 34.0908 41.477 34.1258 41.905 34.1378C42.092 34.1428 42.303 34.1668 42.526 34.1908C43.289 34.2738 44.24 34.3778 44.914 33.8788C45.6 33.3698 45.837 32.4998 45.622 31.2928C45.532 30.7868 45.377 30.2858 45.253 29.8828L45.145 29.5228C44.789 28.2918 44.138 26.5278 42.612 25.4248C40.847 24.1498 38.954 23.7168 36.877 23.4508L36.879 23.4218L36.707 23.4068C36.497 23.3868 36.288 23.3648 36.078 23.3418C35.36 23.2638 34.617 23.1828 33.851 23.2378C33.15 23.2888 32.46 23.4108 31.792 23.5288C31.33 23.6098 30.868 23.6918 30.404 23.7498C29.688 23.8388 28.94 23.8098 28.149 23.7768C26.811 23.7228 25.434 23.6688 24.151 24.2138C22.797 24.7888 20.949 26.0768 20.191 27.3328C19.879 27.8508 19.719 28.4368 19.564 29.0048C19.472 29.3438 19.381 29.6818 19.254 29.9918C19.204 30.1148 19.15 30.2348 19.095 30.3558C18.97 30.6328 18.841 30.9188 18.755 31.2388C18.715 31.3848 18.655 31.5358 18.595 31.6918C18.408 32.1728 18.177 32.7718 18.378 33.3818C18.681 34.2978 19.302 34.2798 19.714 34.2648C19.814 34.2628 19.92 34.2578 20.037 34.2668C21.444 34.3828 22.892 34.5028 24.444 34.5028C24.669 34.5028 24.897 34.5008 25.127 34.4948C26.256 34.4678 27.394 34.3828 28.494 34.2998C29.377 34.2338 30.261 34.1668 31.145 34.1298C31.79 34.0998 32.454 34.1268 33.096 34.1518Z"
        fill="currentColor"
      />
      <path
        d="M30.5347 22.3168C30.7937 22.3698 31.0497 22.3968 31.3027 22.3968C32.3797 22.3968 33.3897 21.9178 34.2057 21.0078C35.5907 19.4608 36.1867 16.9078 35.5917 15.0688C35.3257 14.2458 34.5477 12.1938 33.0707 10.9148C31.8447 9.85176 30.1137 9.92076 28.9207 10.0618C27.1447 10.2738 25.8307 11.0218 25.1217 12.2258C24.5077 13.2688 23.9017 15.4138 24.4777 16.8258C24.2837 20.1288 28.1757 21.8298 30.5347 22.3168Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const BigLabel = styled.div`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  border-radius: 8px;
`;

export const Centered = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 52px;
  width: 100%;
  height: 100%;
`;

const Square = styled.div<{ $gap: number }>`
  font-family: SFRounded, ui-rounded, "SF Pro Rounded", Comic Sans MS, system-ui, sans-serif;

  padding: ${(props) => props.$gap}px;
  position: relative;

  /* Preferred box-sizing value */
  &,
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
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

const Button_ = styled.button`
  display: inline-block;

  all: unset;
  display: revert;
  cursor: revert;
`;

const ButtonMasked = styled.div`
  font-weight: 700;
  font-size: 28px;
  color: white;
  cursor: pointer;
  user-select: none;

  background: blue;
  padding: 14px 18px;
  box-shadow: inset 0px -2px 0px 4px #031298;
  text-shadow: 0px 1px 0px #333;
  white-space: nowrap;

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
