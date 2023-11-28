import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Squircle } from "@squircle-js/react";
import { Player } from "./Multiplayer"; // import your Multiplayer class

interface CursorProps {
  player: Player;
  isMe?: boolean;
}

export const Cursor = ({ player, isMe = false }: CursorProps) => {
  return (
    <CursorDiv $top={player.y} $left={player.x} $isMe={isMe}>
      <HandIcon />
      <Label $color={player.color} cornerRadius={8} cornerSmoothing={1}>
        {player.name || "Unknown"}
      </Label>
    </CursorDiv>
  );
};

const HandIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none">
      <path
        fill="currentColor"
        d="M2.188 1.363a1.015 1.015 0 0 0-.575.662c-.038.163.2 3 .975 11.238.575 6.062 1.15 12.25 1.287 13.762.138 1.513.275 2.838.313 2.963.187.662.95.975 1.55.612.1-.05 1.487-1.925 3.287-4.425a925.95 925.95 0 0 0 3.163-4.4c.025-.037 2.137-.1 5.625-.175 3.475-.075 5.687-.137 5.837-.187.675-.188.963-1.05.525-1.6-.062-.088-1.737-1.563-3.7-3.288C18.5 14.8 13.813 10.7 10.038 7.413c-3.775-3.288-6.925-6.038-7.05-6.088-.275-.112-.5-.1-.8.038"
      />
    </svg>
  );
};

const tilt = 2;

const CursorDiv = styled.div.attrs<{
  $top: number;
  $left: number;
  $isMe: boolean;
}>(({ $top, $left }) => {
  return {
    style: { transform: `translate(${$left - tilt}px, ${$top - tilt}px)` }
  };
})`
  position: absolute;
  pointer-events: none;

  filter: drop-shadow(0px 2px 0px white) drop-shadow(0px -2px 0px white)
    drop-shadow(1px 0px 0px white) drop-shadow(-1px 0px 0px white);
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  ${(props) => (props.$isMe ? "color: black;" : "color: #999;")}
`;

const Label = styled(Squircle)<{ $color: string }>`
  background-color: ${(props) => props.$color};
  font-weight: 500;
  position: absolute;
  top: 32px;
  left: 16px;
  height: 32px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 20px;
  padding: 0px 8px;
  white-space: nowrap;
  text-shadow: 0px 1px 0px #333;
`;
