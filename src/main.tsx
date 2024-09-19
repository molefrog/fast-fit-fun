import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import styled from "styled-components";
import { Redirect, Route, Switch, useLocation } from "wouter";
import "./main.css";

import { ExpensiveRenderDemo, MultiplayerDemo, usePlayerNameSES } from "./library";

const App = () => {
  return (
    <>
      <KeyboardNavigation />
      <Container>
        <Switch>
          <Route path="/multiplayer">
            <MultiplayerDemo nOfInstances={2} />
          </Route>

          <Route path="/expensive-render">
            <ExpensiveRenderDemo />
          </Route>

          <Route path="/comments-memo">
            <MultiplayerDemo nOfInstances={1} comments="use-callback" />
          </Route>

          <Route path="/comments">
            <MultiplayerDemo nOfInstances={1} comments="use-event" />
          </Route>

          <Route path="/rename-player">
            <MultiplayerDemo nOfInstances={1} usePlayerNameHook={usePlayerNameSES} />
          </Route>

          <Route>
            <Redirect to="/multiplayer" />
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
  "/multiplayer",
  "/expensive-render",
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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const currentLocationIndex = indexRef.current;

      if (event.key === "ArrowRight") {
        indexRef.current = (currentLocationIndex + 1) % DEMOS.length;
      } else if (event.key === "ArrowLeft") {
        indexRef.current = (currentLocationIndex - 1 + DEMOS.length) % DEMOS.length;
      }

      navigate(DEMOS[indexRef.current]);
    },
    [navigate],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
};

const root = ReactDOM.createRoot(document.querySelector(".react-app")!);
root.render(<App />);
