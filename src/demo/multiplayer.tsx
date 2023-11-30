import React, {
  useRef,
  useCallback,
  ComponentProps,
  forwardRef,
  useState,
  useMemo,
  useEffect,
} from "react";
import styled from "styled-components";

import { Multiplayer } from "../Multiplayer";
import { Cursor } from "../Cursor";
import { WorkingArea, Button, UserIcon, Centered } from "../ui";
import { Squircle } from "@squircle-js/react";
import { RenderIsExpensive } from "../RenderIsExpensive";

import {
  useConnectionStatus,
  usePeopleConnected,
  usePositionUpdates,
  usePlayerNameSES,
  usePlayerNameStateAndEffect,
} from "../hooks";
import { nanoid } from "nanoid";
import { useSearch } from "wouter";

interface DemoProps {
  nOfInstances: number;
  useMultiplayerHook: () => Multiplayer;
}

export const Demo = ({ nOfInstances, ...props }: DemoProps) => {
  const instances = Array.from({ length: nOfInstances }).map(() => nanoid());
  const search = useSearch(); // re-mount when search string changes

  return (
    <>
      {instances.map((id) => (
        <MultiplayerCursors key={id + search} {...props} />
      ))}
    </>
  );
};

const MultiplayerCursors = (props: Omit<DemoProps, "nOfInstances">) => {
  const client = props.useMultiplayerHook();
  const connection = useConnectionStatus(client);

  useEffect(() => {
    return () => {
      client.disconnect();
    };
  }, [client]);

  const connect = useCallback(() => {
    client.connect();
  }, [client]);

  return (
    <WorkingArea>
      {connection === "connecting" && <LoadingLabel>Connecting...</LoadingLabel>}

      {connection === "disconnecting" && <LoadingLabel>Disconnecting...</LoadingLabel>}

      {connection === "online" && (
        <>
          <Canvas client={client} />
          <Status client={client} />
        </>
      )}

      {connection === "offline" && (
        <Centered>
          <Button onClick={connect}>Connect</Button>
        </Centered>
      )}
    </WorkingArea>
  );
};

const Status = ({ client }: { client: Multiplayer }) => {
  const peopleOnline = usePeopleConnected(client);

  const disconnect = useCallback(() => {
    client.disconnect();
  }, [client]);

  return (
    <StatusBar>
      <MyPlayerName client={client} />

      <PeopleConnected onClick={disconnect} cornerRadius={12} cornerSmoothing={1}>
        <UserIcon />

        {peopleOnline}
      </PeopleConnected>
    </StatusBar>
  );
};

const MyPlayerName = React.memo(({ client }: { client: Multiplayer }) => {
  const params = new URLSearchParams(useSearch());

  const hook = params.get("name") === "useSES" ? usePlayerNameSES : usePlayerNameStateAndEffect;

  const myName = hook(client);

  const rename = useCallback(() => {
    const newName = prompt("Rename player", myName) || "Anon";
    client.name = newName;
  }, [client, myName]);

  return (
    <RenderIsExpensive>
      <CurrentPlayer $color={client.me.color} onClick={rename} key={myName}>
        {myName}
      </CurrentPlayer>
    </RenderIsExpensive>
  );
});

const Canvas = ({ client }: { client: Multiplayer }) => {
  const squareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (client) {
      const rect = squareRef.current!.getBoundingClientRect();
      client.move(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  usePositionUpdates(client);

  const otherPlayers = Object.values(client.players).filter((p) => p.name !== client.name);

  return (
    <CanvasContainer ref={squareRef} onMouseMove={handleMouseMove}>
      {otherPlayers.map((p) => (
        <Cursor key={p.name} player={p} />
      ))}

      <Cursor player={client.players[client.name]} isMe />
    </CanvasContainer>
  );
};

const CurrentPlayer = forwardRef<HTMLDivElement, ComponentProps<"div"> & { $color: string }>(
  ({ children, ...props }, ref) => {
    return (
      <CurrentPlayerDiv ref={ref} {...props}>
        <Squircle cornerRadius={12} cornerSmoothing={1}>
          {children}
        </Squircle>
      </CurrentPlayerDiv>
    );
  }
);

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: none;
`;

const LoadingLabel = styled.div`
  position: absolute;
  font-weight: 700;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: black;
  text-shadow: 0px 0px 4px white;
`;

const StatusBar = styled.div`
  position: absolute;

  top: 16px;
  right: 16px;
  display: flex;
  flex-flow: row nowrap;
  gap: 8px;
  cursor: pointer;
`;

const CurrentPlayerDiv = styled.div<{ $color: string }>`
  > div {
    background: ${(props) => props.$color};
    display: flex;
    align-items: center;
    color: white;
    font-size: 22px;
    font-weight: 600;
    height: 44px;

    padding: 6px 14px;
    text-shadow: 0px 1px 0px #333;
  }
`;

const PeopleConnected = styled(Squircle)`
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  background: black;
  color: white;
  padding: 6px 14px;

  > svg {
    width: 24px;
  }
`;
