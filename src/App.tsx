import styled from "styled-components";

import { Demo as ExpensiveRenderDemo } from "./demo/expensive-render";
import { Demo as CatDemo } from "./demo/is-this-my-cat";
import { Demo as MultiplayerDemo } from "./demo/multiplayer";

import { useMultiplayerB, useMultiplayerC } from "./hooks";

import { Route, Switch, useLocation } from "wouter";
import { useCallback, useEffect, useRef, useState } from "react";

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

const App = () => {
  return (
    <>
      <KeyboardNavigation />
      <Container>
        <Switch>
          <Route path="/expensive-render">
            <ExpensiveRenderDemo />
          </Route>

          <Route path="/is-this-my-cat">
            <CatDemo />
          </Route>

          <Route path="/singleplayer">
            <MultiplayerDemo nOfInstances={1} useMultiplayerHook={useMultiplayerB} />
          </Route>

          <Route path="/singleplayer-double">
            <MultiplayerDemo nOfInstances={2} useMultiplayerHook={useMultiplayerB} />
          </Route>

          <Route path="/multiplayer">
            <MultiplayerDemo
              key="multiplayer"
              nOfInstances={2}
              useMultiplayerHook={useMultiplayerC}
            />
          </Route>

          <Route path="/rename-player">
            <MultiplayerDemo nOfInstances={1} useMultiplayerHook={useMultiplayerC} />
          </Route>

          <Route path="/use-event">
            <MultiplayerDemo nOfInstances={1} useMultiplayerHook={useMultiplayerC} />
          </Route>
        </Switch>
      </Container>
    </>
  );
};

const DEMOS = [
  "/expensive-render",
  "/is-this-my-cat",
  "/is-this-my-cat?memo",
  "/singleplayer",
  "/singleplayer-double",
  "/multiplayer",
  "/use-event?comments",
  "/use-event?comments&add-comment=use-event",
  "/rename-player",
  "/rename-player?name=useSES",
];

const KeyboardNavigation = () => {
  const [startIndex] = useState(() => {
    const index = DEMOS.indexOf(window.location.pathname + window.location.search);
    return index === -1 ? 0 : index;
  });

  const indexRef = useRef(startIndex);
  const [, navigate] = useLocation();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let currentLocationIndex = indexRef.current;

    if (event.key === "ArrowRight") {
      indexRef.current = (currentLocationIndex + 1) % DEMOS.length;
    } else if (event.key === "ArrowLeft") {
      indexRef.current = (currentLocationIndex - 1 + DEMOS.length) % DEMOS.length;
    }

    navigate(DEMOS[indexRef.current]);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, DEMOS]);

  return null;
};

export default App;
