import React, { useRef, useCallback, useState, ComponentProps, forwardRef } from "react";
import styled from "styled-components";

import { Multiplayer } from "./Multiplayer";
import { Cursor } from "./Cursor";
import { WorkingArea, Button, UserIcon } from "./ui";
import { Squircle } from "@squircle-js/react";
import { RenderIsExpensive } from "./RenderIsExpensive";

import {
  useMultiplayer,
  useConnectionStatus,
  usePlayerName,
  usePeopleConnected,
  usePositionUpdates,
} from "./hooks";

const RenderHighlightDemo = () => {
  const [counter, setCounter] = useState(0);

  return (
    <>
      <WorkingArea>
        <Centered>
          <RenderIsExpensive>
            <ExpButton>
              <Button key={`btn` + counter} onClick={() => setCounter((i) => i + 1)}>
                Counter: {counter}
              </Button>
            </ExpButton>
          </RenderIsExpensive>
        </Centered>
      </WorkingArea>
    </>
  );
};

const MultiplayerDemo = () => {
  const client = useMultiplayer();
  const connection = useConnectionStatus(client);

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
      <RenderIsExpensive>
        <CurrentPlayer $color={client.me.color} onClick={rename} key={myName}>
          {myName}
        </CurrentPlayer>
      </RenderIsExpensive>

      <PeopleConnected onClick={disconnect} cornerRadius={12} cornerSmoothing={1}>
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

const Container = styled.div``;

const Centered = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

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

const CurrentPlayer = forwardRef<HTMLDivElement, ComponentProps<"div"> & { $color: string }>(
  (props, ref) => {
    return (
      <Squircle cornerRadius={12} cornerSmoothing={1} asChild>
        <CurrentPlayerDiv ref={ref} {...props}></CurrentPlayerDiv>
      </Squircle>
    );
  }
);

const CurrentPlayerDiv = styled.div<{ $color: string }>`
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

const ExpButton = styled.div`
  // padding: 16px;
`;

const App = ({ id }: { id: string }) => {
  return (
    <Container>
      <RenderHighlightDemo />
    </Container>
  );
};

export default App;
