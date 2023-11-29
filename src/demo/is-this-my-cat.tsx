import { useCallback, useState } from "react";
import { shuffle } from "lodash";

import { WorkingArea, Button, BigLabel, Centered } from "../ui";
import { RenderIsExpensive } from "../RenderIsExpensive";
import { CAT_NAMES } from "../meow";
import React from "react";

const MY_CATS = ["Bambooni", "Waffle"];

const IsThisMyCat =
  /*React.memo(*/
  ({ isIt }: { isIt: boolean }) => {
    const label = isIt ? "That's my cat!" : "This is NOT my cat...";

    return (
      <RenderIsExpensive>
        <BigLabel>{label}</BigLabel>
      </RenderIsExpensive>
    );
  };
/*);*/

export const Demo = () => {
  const [i, setI] = useState(0);

  const [catNames] = useState(() => {
    return shuffle([...MY_CATS, ...shuffle(CAT_NAMES).slice(0, 10)]);
  });

  const next = useCallback(() => {
    setI((i) => (i + 1) % catNames.length);
  }, [catNames]);

  return (
    <WorkingArea>
      <Centered>
        <RenderIsExpensive symbol="😾">
          <Button onClick={next}>{catNames[i]}</Button>
        </RenderIsExpensive>

        <IsThisMyCat isIt={MY_CATS.includes(catNames[i])} />
      </Centered>
    </WorkingArea>
  );
};
