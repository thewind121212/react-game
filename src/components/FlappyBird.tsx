
import React from "react";
import { useFlappyBirdGame } from "../hooks/useFlappyBirdGame";

export default function FlappyBird() {
  const { runGame, gameStatus } = useFlappyBirdGame({ canvasId: "flappybird-board", mode: "offline" });

  return (
    <div className="w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40]">
      <div className="w-[360px] h-[640px] bg-white relative"
        onClick={() => runGame(gameStatus.current === "start" ? "start game" : "restart game")}
      >
        <canvas
          className="w-full h-full absolute top-0 left-0 z-10"
          id="flappybird-board"
        ></canvas>
        <div className="w-full h-auto absolute bottom-0 left-0 z-20 pointer-events-none">
          <img src="/src/assets/bottom-background.png" alt="background-bt" className="w-full h-auto pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
