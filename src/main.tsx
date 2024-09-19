import { Children, isValidElement, useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import styled from "styled-components";
import { Redirect, Route, Switch, SwitchProps, useLocation } from "wouter";
import "./main.css";

import { ExpensiveRenderDemo, MultiplayerDemo, usePlayerNameSES } from "./library";

const App = () => {
  return (
    <>
      <Container>
        <SwitchWithKeyboardNavigation>
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
        </SwitchWithKeyboardNavigation>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

/**
 * Allows navigating between demos using the arrow keys in dev mode
 */
const SwitchWithKeyboardNavigation = (props: SwitchProps) => {
  const [children] = useState(() => Children.toArray(props.children));

  const paths = useMemo(
    () =>
      children
        .filter(isValidElement)
        .map((child) => {
          return (child as React.ReactElement<{ path: undefined | string }>).props.path!;
        })
        .filter(Boolean),
    [children],
  );

  const [location, navigate] = useLocation();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      let currentLocationIndex = paths.indexOf(location);
      if (currentLocationIndex === -1) {
        return (currentLocationIndex = 0);
      }

      let idx = 0;

      if (event.key === "ArrowRight") {
        idx = (currentLocationIndex + 1) % paths.length;
      } else if (event.key === "ArrowLeft") {
        idx = (currentLocationIndex - 1 + paths.length) % paths.length;
      }

      navigate(paths[idx]);
    },
    [navigate, location, paths],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return <Switch>{props.children}</Switch>;
};

const root = ReactDOM.createRoot(document.querySelector(".react-app")!);
root.render(<App />);
