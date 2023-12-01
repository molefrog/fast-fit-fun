import { useCallback, useState } from "react";

import { WorkingArea, Button, Centered } from "../ui";
import { RenderIsExpensive } from "../RenderIsExpensive";

export const Demo = () => {
  const [counter, setCounter] = useState(0);

  const handleClick = useCallback(() => {
    setCounter((i) => i + 1);
  }, []);

  return (
    <WorkingArea>
      <Centered>
        <RenderIsExpensive symbol="DKK">
          <Button onClick={handleClick}>Counter: {counter}</Button>
        </RenderIsExpensive>
      </Centered>
    </WorkingArea>
  );
};
