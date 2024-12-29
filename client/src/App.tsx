import { useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import React from "react";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            {/* Add any react components here */}
        </div>
    );
}

export default App;
