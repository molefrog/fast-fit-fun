import { createNanoEvents, Emitter } from "nanoevents";
import { randomCatName, randomColor } from "./meow";
import { Throttle } from "./throttle";

export interface Player {
  x: number;
  y: number;
  color: string;
  name: string;
}

export type Connection = "offline" | "connecting" | "online" | "disconnecting";

interface Players {
  [name: string]: Player;
}

export type Events = {
  rename: (name: string) => void;
  connect: (status: Connection) => void;
  update: () => void;
};

export class Multiplayer {
  static players: Players = {};
  static globalEmitter = createNanoEvents<{ update: () => void }>();

  me: Player;

  connection: Connection = "offline";

  #name: string;
  #emitter: Emitter<Events>;

  constructor({ autoconnect = true }: { autoconnect?: boolean } = {}) {
    this.#name = randomCatName();

    // optimistic state of the current player
    this.me = {
      color: randomColor(),
      name: this.#name,
      x: 0,
      y: 0,
    };

    this.#emitter = createNanoEvents();

    if (autoconnect) {
      this.connect();
    }
  }

  get isOnline() {
    return this.connection === "online";
  }

  get players(): Players {
    return { ...Multiplayer.players, [this.#name]: this.me };
  }

  async connect(): Promise<void> {
    if (this.connection !== "offline") return;

    this.connection = "connecting";
    this.#emitter.emit("connect", this.connection);
    await delay(500);

    // don't connect if we've disconnected in the meantime
    if (this.connection === "connecting") {
      this.connection = "online";
      this.#emitter.emit("connect", this.connection);
      this.sync();
    }
  }

  get name() {
    return this.#name;
  }

  set name(newName: string) {
    if (Multiplayer.players[newName]) return;

    delete Multiplayer.players[this.#name];

    this.#name = newName;
    this.me.name = newName;
    this.#emitter.emit("rename", newName);

    this.sync();
  }

  @Throttle(() => 30 + Math.random() * 200)
  syncOverNetwork() {
    this.sync();
  }

  sync() {
    Multiplayer.players[this.#name] = { ...this.me };
    Multiplayer.globalEmitter.emit("update");
  }

  async move(x: number, y: number) {
    this.me.x = x;
    this.me.y = y;

    Multiplayer.globalEmitter.emit("update");
    this.syncOverNetwork();
  }

  on<K extends keyof Events>(event: K, handler: Events[K]): () => void {
    if (event === "update") {
      return Multiplayer.globalEmitter.on("update", handler as Events["update"]);
    } else {
      return this.#emitter.on(event, handler);
    }
  }

  async disconnect(): Promise<void> {
    this.connection = "disconnecting";
    this.#emitter.emit("connect", this.connection);

    await delay(250);

    this.connection = "offline";
    this.#emitter.emit("connect", this.connection);

    delete Multiplayer.players[this.#name];
    Multiplayer.globalEmitter.emit("update");
  }
}

async function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default Multiplayer;
