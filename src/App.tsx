import React, {
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
  useCallback,
  useLayoutEffect
} from "react";
import styled from "styled-components";

import { Multiplayer } from "./Multiplayer"; // import your Multiplayer class
import { Cursor } from "./Cursor";
import { Grid } from "./Grid";
import { Squircle } from "@squircle-js/react";

import {
  useMultiplayer,
  useConnectionStatus,
  usePlayerName,
  usePeopleConnected,
  usePositionUpdates
} from "./hooks";

const Client: React.FC = () => {
  const client = useMultiplayer();
  const connection = useConnectionStatus(client);

  const connect = useCallback(() => {
    client.connect();
  }, [client]);

  return (
    <Square>
      <Grid width={480} />

      {connection === "connecting" && (
        <LoadingLabel>Connecting...</LoadingLabel>
      )}

      {connection === "disconnecting" && (
        <LoadingLabel>Disconnecting...</LoadingLabel>
      )}

      {connection === "online" && (
        <>
          <Canvas client={client} />
          <Status client={client} />
        </>
      )}

      {connection === "offline" && (
        <Squircle cornerRadius={12} cornerSmoothing={1} asChild>
          <ConnectButton onClick={connect}>
            <span>Connect</span>
          </ConnectButton>
        </Squircle>
      )}
    </Square>
  );
};

const Status = ({ client }: { client: Multiplayer }) => {
  const myName = usePlayerName(client);
  const peopleOnline = usePeopleConnected(client);

  const disconnect = useCallback(() => {
    client.disconnect();
  }, [client]);

  const rename = useCallback(() => {
    const newName = prompt("Rename player", myName) || "Anon";
    client.name = newName;
  }, [client, myName]);

  return (
    <StatusBar>
      <CurrentPlayer
        $color={client.me.color}
        cornerRadius={12}
        cornerSmoothing={1}
        onClick={rename}
        key={myName}
      >
        {myName}
      </CurrentPlayer>

      <PeopleConnected
        onClick={disconnect}
        cornerRadius={12}
        cornerSmoothing={1}
      >
        <UserIcon />

        {peopleOnline}
      </PeopleConnected>
    </StatusBar>
  );
};

const Canvas = ({ client }: { client: Multiplayer }) => {
  const squareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (client) {
      const rect = squareRef.current!.getBoundingClientRect();
      client.move(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  usePositionUpdates(client);

  const otherPlayers = Object.values(client.players).filter(
    (p) => p.name !== client.name
  );

  return (
    <CanvasContainer ref={squareRef} onMouseMove={handleMouseMove}>
      {otherPlayers.map((p) => (
        <Cursor key={p.name} player={p} />
      ))}

      <Cursor player={client.players[client.name]} isMe />
    </CanvasContainer>
  );
};

const Container = styled.div`
  font-family: SFRounded, ui-rounded, "SF Pro Rounded", system-ui,
    "Helvetica Neue", Arial, Helvetica, sans-serif;
`;

const Square = styled.div`
  --canvas-gap: 16px;

  width: 480px;
  height: 480px;
  position: relative;
`;

const CanvasContainer = styled.div`
  position: absolute;
  inset: var(--canvas-gap) var(--canvas-gap) var(--canvas-gap) var(--canvas-gap);
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

  top: 24px;
  right: 24px;
  display: flex;
  flex-flow: row nowrap;
  gap: 8px;
  cursor: pointer;
`;

const ConnectButton = styled.button`
  position: absolute;
  font-weight: 700;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: white;
  cursor: pointer;

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

const CurrentPlayer = styled(Squircle)<{ $color: string }>`
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: center;

  text-shadow: 0px 1px 0px #333;
  gap: 8px;
  background: ${(props) => props.$color};
  color: white;
  padding: 6px 14px;
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

const App = ({ id }: { id: string }) => {
  return (
    <Container>
      <Client />
    </Container>
  );
};

const UserIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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

export default App;
