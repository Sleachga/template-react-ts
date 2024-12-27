import { AUTO, Game } from "phaser";
import { Client, Room } from "colyseus.js";

export class GameScene extends Phaser.Scene {
    client = new Client("ws://localhost:2567");
    room: Room;

    playerEntities: { [sessionId: string]: any } = {};

    inputPayload = {
        left: false,
        right: false,
        up: false,
        down: false,
    };

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    async create() {
        this.cursorKeys = this.input.keyboard!.createCursorKeys();

        try {
            this.room = await this.client.joinOrCreate("dev");
            console.log("Joined successfully!");

            this.room.state.players.onAdd((player: any, sessionId: any) => {
                const entity = this.physics.add.image(
                    player.x,
                    player.y,
                    "ship_0001"
                );

                // keep a reference of it on `playerEntities`
                this.playerEntities[sessionId] = entity;

                // listening for server updates
                player.onChange(() => {
                    console.log("MOVING", player);
                    // update local position immediately
                    entity.x = player.x;
                    entity.y = player.y;
                });

                // Alternative, listening to individual properties:
                // player.listen("x", (newX, prevX) => console.log(newX, prevX));
                // player.listen("y", (newY, prevY) => console.log(newY, prevY));
                console.log(
                    "A player has joined! Their unique session id is",
                    sessionId
                );
            });

            this.room.state.players.onRemove((player, sessionId) => {
                const entity = this.playerEntities[sessionId];
                if (entity) {
                    // destroy entity
                    entity.destroy();

                    // clear local reference
                    delete this.playerEntities[sessionId];
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    preload() {
        // preload scene
        this.load.image(
            "ship_0001",
            "https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png"
        );
    }

    update(time: number, delta: number): void {
        // skip loop if not connected with room yet.
        if (!this.room) {
            return;
        }

        // send input to the server
        this.inputPayload.left = this.cursorKeys.left.isDown;
        this.inputPayload.right = this.cursorKeys.right.isDown;
        this.inputPayload.up = this.cursorKeys.up.isDown;
        this.inputPayload.down = this.cursorKeys.down.isDown;

        this.room.send(0, this.inputPayload);
    }
}

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#028af8",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
        },
    },
    scene: [GameScene],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
