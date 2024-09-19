import { Squircle } from "@squircle-js/react";
import React, {
  ComponentProps,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useEvent from "react-use-event-hook";
import styled from "styled-components";

import { Cursor } from "../Cursor";
import { Multiplayer } from "../Multiplayer";
import { RenderIsExpensive } from "../RenderIsExpensive";
import { Button, Centered, CommentIcon, UserIcon, WorkingArea } from "../ui";

import { nanoid } from "nanoid";
import {
  UseMultiplayerHook,
  useConnectionStatus,
  useMultiplayer,
  usePeopleConnected,
  usePlayerNameSES,
  usePositionUpdates,
} from "../hooks";

interface Options {
  useMultiplayerHook: UseMultiplayerHook;
  usePlayerNameHook: (client: Multiplayer) => string;
  comments: boolean | "use-callback" | "use-event";
}

const defaultOptions: Options = {
  useMultiplayerHook: useMultiplayer,
  usePlayerNameHook: usePlayerNameSES,
  comments: false,
};

const OptionsContext = createContext<Options>(defaultOptions);

const useOptions = () => useContext(OptionsContext);

type DemoProps = Partial<Options> & {
  nOfInstances: number;
};

export const Demo = React.memo(function Demo$({ nOfInstances, ...options }: DemoProps) {
  const instances = Array.from({ length: nOfInstances }).map(() => nanoid());

  return instances.map((id) => <MultiplayerCursors key={id} renderOptions={options} />);
});

const MultiplayerCursors = ({
  room,
  renderOptions,
}: {
  room?: string;
  renderOptions: Partial<Options>;
}) => {
  const options = { ...defaultOptions, ...renderOptions };

  const client = options.useMultiplayerHook(room);
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
    <OptionsContext.Provider value={options}>
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
    </OptionsContext.Provider>
  );
};

const Comments = React.memo(function Comments$({ onComment }: { onComment: () => void }) {
  return (
    <RenderIsExpensive>
      <CommentsContainer>
        <CommentButton onClick={onComment}>
          <CommentIcon />
        </CommentButton>
      </CommentsContainer>
    </RenderIsExpensive>
  );
});

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

const MyPlayerName = React.memo(function MyPlayerName$({ client }: { client: Multiplayer }) {
  const options = useOptions();
  const [hook] = useState(() => options.usePlayerNameHook);

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
  const options = useOptions();

  const movePlayer = useCallback(
    (x: number, y: number) => {
      client?.move(x, y);
    },
    [client],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = squareRef.current!.getBoundingClientRect();
    movePlayer(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = squareRef.current!.getBoundingClientRect();
    const touch = e.touches[0];

    movePlayer(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  usePositionUpdates(client);

  const otherPlayers = Object.values(client.players).filter((p) => p.name !== client.name);

  // write last coordinates here to simulate addComment method
  const someWork = useRef([0, 0]);

  const addCommentMemo = useCallback(() => {
    someWork.current = [client.me.x, client.me.y];
  }, [client.me.x, client.me.y]);

  const addCommentUseEvent = useEvent(() => {
    someWork.current = [client.me.x, client.me.y];
  });

  const addComment = options.comments === "use-callback" ? addCommentMemo : addCommentUseEvent;
  const hasComments = !!options.comments;

  return (
    <CanvasContainer ref={squareRef} onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}>
      {otherPlayers.map((p) => (
        <Cursor key={p.name} player={p} />
      ))}

      <Cursor player={client.players[client.name]} isMe />

      {hasComments && <Comments onComment={addComment} />}
    </CanvasContainer>
  );
};

const CurrentPlayer = forwardRef<HTMLDivElement, ComponentProps<"div"> & { $color: string }>(
  function CurrentPlayerWithRef({ children, ...props }, ref) {
    return (
      <CurrentPlayerDiv ref={ref} {...props}>
        <Squircle cornerRadius={12} cornerSmoothing={1}>
          {children}
        </Squircle>
      </CurrentPlayerDiv>
    );
  },
);

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  touch-action: none;
  cursor: none;
`;

const CommentsContainer = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
  font-size: 14px;
  color: white;
  text-shadow: 0px 0px 4px black;
`;

const CommentButton = styled(Squircle).attrs({ cornerRadius: 12, cornerSmoothing: 1 })`
  width: 64px;
  height: 64px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    width: 34px;
  }
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
    height: 46px;

    padding: 0px 14px;
    text-shadow: 0px 1px 0px #333;
  }
`;

const PeopleConnected = styled(Squircle)`
  font-size: 22px;
  height: 46px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  background: black;
  color: white;
  padding: 0px 14px;

  > svg {
    width: 24px;
  }
`;
