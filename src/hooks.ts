import React, { useEffect, useState, useRef, useSyncExternalStore, createContext, useContext } from "react";

import { Multiplayer, Events } from "./Multiplayer"; // import your Multiplayer class

/** A. Instance is stored as a global variable
 * Cons:
 *  [-] resource is initialized when the script is evaluated
 *  [-] no isolation between multiple instances of the app
 */
let globalClient: Multiplayer // = new Multiplayer()

const useMultiplayerA = () => globalClient

/** B. Lazy-initialized, stored as a global variable
 * Cons:
 *  [-] no isolation between multiple instances of the app
 */
const useMultiplayerB = (): Multiplayer => globalClient ||= new Multiplayer()

/** B. Scoped to the current component
 * Cons:
 *  [-] creates an instance every time it is called, hence can only be called once
 */
export const useMultiplayerC = () => {
  const clientRef = useRef<Multiplayer>()
  const [client] = useState<Multiplayer>(() => {
    return clientRef.current ||= new Multiplayer()
  })

  return client
}

/** D. Store in the context cache
 * Pros:
 *  [+] each app instance gets its own client
 *  [+] client is created on demand, e.g. when `useMultiplayer` is first called
 *  [+] can call `useMultiplayer` in any place of our app, only one instance is created
 */
const ClientCtx = createContext<{ client?: Multiplayer }>({})

export const useMultiplayerD = () => {
  const cache = useContext(ClientCtx)

  const [client] = useState(() => 
    cache.client ||= new Multiplayer()
  )

  return client
}


export const useMultiplayer = useMultiplayerC

// returns stable reference to subscription function for the given event
// to be used in `useSyncExternalStore`
const useSubscribeTo = (client: Multiplayer, event: keyof Events) => {
  const [subscribe] = useState(() => 
    // initializer trick to build this function on the first pass
    // hence, this hook can't work with variable `event`
    (cb: () => void) => client.on(event, cb) 
  )

  return subscribe
}

// current player's name
export const usePlayerName = (client: Multiplayer) => {
  const subscribe = useSubscribeTo(client, "rename")
  return useSyncExternalStore(subscribe, () => client.name)
}

export const useConnectionStatus = (client: Multiplayer) => {
  const subscribe = useSubscribeTo(client, "connect")
  return useSyncExternalStore(subscribe, () => client.connection)
}

// total number of clients connected
export const usePeopleConnected = (client: Multiplayer) => {
  const subscribe = useSubscribeTo(client, "update")
  return useSyncExternalStore(subscribe, () => {
    return Object.keys(client.players).length
  })
}

// re-renders whenever positions of the players change
export const usePositionUpdates = (client: Multiplayer) => {
  const [,update] = useState({})

  useEffect(() => {
    // set state to an empty objec to trigger a re-render
    return client.on("update", () => update({}))
  }, [client])
}
