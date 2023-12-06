import { createNanoEvents, Emitter } from "nanoevents";
import { randomCatName, randomColor } from "./meow";
import { Throttle } from "./throttle";
import { random } from "lodash-es";

export interface Player {
  x: number;
  y: number;
  color: string;
  name: string;
  room: string;
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
  readonly room: string; // Add room property
  #emitter: Emitter<Events>;

  constructor({
    autoconnect = true,
    spawnBoundary = 400,
    room = "*",
  }: { autoconnect?: boolean; spawnBoundary?: number; room?: string } = {}) {
    this.#name = randomCatName();
    this.room = room;

    // optimistic state of the current player
    this.me = {
      color: randomColor(),
      name: this.#name,
      x: random(spawnBoundary),
      y: random(spawnBoundary),
      room: this.room,
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
    let others = Multiplayer.players;

    // Filter players based on room
    if (this.room !== "*") {
      others = Object.fromEntries(
        Object.entries(Multiplayer.players).filter(([_, player]) => player.room === this.room)
      );
    }

    return { ...others, [this.#name]: this.me };
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
