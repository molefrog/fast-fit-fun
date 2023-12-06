import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Route, Switch, useLocation } from "wouter";
import styled from "styled-components";
import "./main.css";

import {
  ExpensiveRenderDemo,
  CatDemo,
  MultiplayerDemo,
  usePlayerNameSES,
  useMultiplayerB,
  useMultiplayerC,
} from "./library";

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
            <CatDemo memoize />
          </Route>

          <Route path="/singleplayer">
            <MultiplayerDemo nOfInstances={1} useMultiplayerHook={useMultiplayerB} />
          </Route>

          <Route path="/singleplayer-double">
            <MultiplayerDemo nOfInstances={2} room="my" useMultiplayerHook={useMultiplayerB} />
          </Route>

          <Route path="/multiplayer">
            <MultiplayerDemo nOfInstances={2} room="my" useMultiplayerHook={useMultiplayerC} />
          </Route>

          <Route path="/rename-player">
            <MultiplayerDemo nOfInstances={1} usePlayerNameHook={usePlayerNameSES} />
          </Route>

          <Route path="/comments-memo">
            <MultiplayerDemo nOfInstances={1} comments="use-callback" />
          </Route>

          <Route path="/comments">
            <MultiplayerDemo nOfInstances={1} comments="use-event" />
          </Route>
        </Switch>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

const DEMOS = [
  "/expensive-render",
  "/is-this-my-cat",
  "/singleplayer",
  "/singleplayer-double",
  "/multiplayer",
  "/comments-memo",
  "/comments",
  "/rename-player",
];

/**
 * Allows navigating between demos using the arrow keys in dev mode
 */
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

const root = ReactDOM.createRoot(document.querySelector(".react-app")!);
root.render(<App />);
