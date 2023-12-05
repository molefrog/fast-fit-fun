import React from "react";
import { useCallback, useState } from "react";
import { shuffle } from "lodash-es";

import { WorkingArea, Button, BigLabel, Centered } from "../ui";
import { RenderIsExpensive } from "../RenderIsExpensive";
import { CAT_NAMES } from "../meow";
import { useSearch } from "wouter";

const MY_CATS = ["Bambooni", "Waffle"];

const IsThisMyCat = ({ isIt }: { isIt: boolean }) => {
  const label = isIt ? "That's my cat!" : "This is NOT my cat...";

  return (
    <RenderIsExpensive>
      <BigLabel>{label}</BigLabel>
    </RenderIsExpensive>
  );
};

const IsThisMyCatMemoized = React.memo(IsThisMyCat);

export const Demo = () => {
  const params = new URLSearchParams(useSearch());
  const [i, setI] = useState(0);

  const [catNames] = useState(() => {
    return shuffle([...MY_CATS, ...shuffle(CAT_NAMES).slice(0, 10)]);
  });

  const next = useCallback(() => {
    setI((i) => (i + 1) % catNames.length);
  }, [catNames]);

  const ResultComponent = params.has("memo") ? IsThisMyCatMemoized : IsThisMyCat;

  return (
    <WorkingArea>
      <Centered>
        <RenderIsExpensive symbol="😾">
          <Button onClick={next}>{catNames[i]}</Button>
        </RenderIsExpensive>

        <ResultComponent isIt={MY_CATS.includes(catNames[i])} />
      </Centered>
    </WorkingArea>
  );
};
