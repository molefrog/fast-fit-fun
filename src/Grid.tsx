import { useRef, useLayoutEffect, ComponentProps } from "react";
import rough from "roughjs";

type GridProps = ComponentProps<"svg"> & {
  width: number;
  height?: number;
};

export const Grid = ({ width, height = width, ...props }: GridProps) => {
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

  const gap = 16;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${-gap} ${-gap} ${width + 2 * gap} ${height + 2 * gap}`}
      ref={svgRef}
      {...props}
    />
  );
};
