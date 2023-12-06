import { useEffect, useState, useRef, useSyncExternalStore } from "react";

import { Multiplayer, Events } from "./Multiplayer"; // import your Multiplayer class

export type UseMultiplayerHook = (room?: string) => Multiplayer;

/** A. Instance is stored as a global variable
 * Cons:
 *  [-] resource is initialized when the script is evaluated
 *  [-] no isolation between multiple instances of the app
 */
let singletonClient: Multiplayer = new Multiplayer({ room: "init" });

export const useMultiplayerA: UseMultiplayerHook = () => singletonClient; // ingore the room

/** B. Lazy-initialized, stored as a global variable
 * Cons:
 *  [-] no isolation between multiple instances of the app
 */

let globalClient: Multiplayer;

export const useMultiplayerB: UseMultiplayerHook = (room): Multiplayer =>
  (globalClient ||= new Multiplayer({ room }));

/** B. Scoped to the current component
 * Cons:
 *  [-] creates an instance every time it is called, hence can only be called once
 */
export const useMultiplayerC: UseMultiplayerHook = (room) => {
  const clientRef = useRef<Multiplayer>();
  const [client] = useState<Multiplayer>(() => {
    return (clientRef.current ||= new Multiplayer({ room }));
  });

  return client;
};

// returns stable reference to subscription function for the given event
// to be used in `useSyncExternalStore`
const useSubscribeTo = (client: Multiplayer, event: keyof Events) => {
  const [subscribe] = useState(
    () =>
      // initializer trick to build this function on the first pass
      // hence, this hook can't work with variable `event`
      (cb: () => void) =>
        client.on(event, cb)
  );

  return subscribe;
};

/**
 * A. Get player's name using `useState` and `useEffect` hooks
 */
export const usePlayerNameStateAndEffect = (client: Multiplayer) => {
  const [name, setName] = useState(() => client.name);

  useEffect(() => {
    return client.on("rename", () => setName(client.name));
  }, [client]);

  return name;
};

/**
 * B. Get player's name using `useSyncExternalStore` hook
 */
export const usePlayerNameSES = (client: Multiplayer) => {
  const subscribe = useSubscribeTo(client, "rename");
  return useSyncExternalStore(subscribe, () => client.name);
};

export const useConnectionStatus = (client: Multiplayer) => {
  const subscribe = useSubscribeTo(client, "connect");
  return useSyncExternalStore(subscribe, () => client.connection);
};

// total number of clients connected
export const usePeopleConnected = (client: Multiplayer) => {
  const subscribe = useSubscribeTo(client, "update");
  return useSyncExternalStore(subscribe, () => {
    return Object.keys(client.players).length;
  });
};

// re-renders whenever positions of the players change
export const usePositionUpdates = (client: Multiplayer) => {
  const [, update] = useState({});

  useEffect(() => {
    // set state to an empty objec to trigger a re-render
    return client.on("update", () => update({}));
  }, [client]);
};
