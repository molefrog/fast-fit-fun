import styled from "styled-components";

import { Demo as CatDemo } from "./demo/is-this-my-cat";
import { Demo as ExpensiveRenderDemo } from "./demo/expensive-render";
import { Demo as MultiplayerDemo } from "./demo/multiplayer";

import { Route, Switch } from "wouter";

const Container = styled.div``;

const App = () => {
  return (
    <Container>
      <Switch>
        <Route path="/2">
          <CatDemo />
        </Route>

        <Route path="/3">
          <MultiplayerDemo />
        </Route>

        <Route>
          <ExpensiveRenderDemo />
        </Route>
      </Switch>
    </Container>
  );
};

export default App;
