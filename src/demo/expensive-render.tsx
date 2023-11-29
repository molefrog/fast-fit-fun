import { useState } from "react";

import { WorkingArea, Button, Centered } from "../ui";
import { RenderIsExpensive } from "../RenderIsExpensive";

export const Demo = () => {
  const [counter, setCounter] = useState(0);

  return (
    <WorkingArea>
      <Centered>
        <RenderIsExpensive symbol="😡">
          <Button onClick={() => setCounter((i) => i + 1)}>Counter: {counter}</Button>
        </RenderIsExpensive>
      </Centered>
    </WorkingArea>
  );
};
