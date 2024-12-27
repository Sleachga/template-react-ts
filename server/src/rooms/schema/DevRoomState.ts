// DevRoomState.ts
import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
}

export class DevRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}