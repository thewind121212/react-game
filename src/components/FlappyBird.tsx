import React, { useEffect, useRef } from "react";

const BIRDWIDTH = 34;
const BIRDHEIGHT = 24;
const BIRDSTARTPX = 360 / 8;
const BIRDSTARTPY = 640 / 2;
let birdImg;


export default function FlappyBird() {
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const birdRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: BIRDSTARTPX,
    y: BIRDSTARTPY,
    width: BIRDWIDTH,
    height: BIRDHEIGHT,
  });


  const updateByFrame = () => {
    birdRef.current.y += 0.5;
    requestAnimationFrame(updateByFrame);
    if (context.current) {
      context.current.clearRect(0, 0, 360, 640);
      context.current.drawImage(
        birdImg,
        birdRef.current.x,
        birdRef.current.y,
        birdRef.current.width,
        birdRef.current.height
      );
    }
  }

  useEffect(() => {
    const board = document.getElementById(
      "flappybird-board"
    ) as HTMLCanvasElement;

    if (board) {
      board.width = 360;
      board.height = 640;
      context.current = board.getContext("2d");
      birdImg = new Image();
      birdImg.src = "src/assets/flappybird.gif";
      birdImg.onload = () => {
        if (context.current) {
          context.current.drawImage(
            birdImg,
            BIRDSTARTPX,
            BIRDSTARTPY,
            BIRDWIDTH,
            BIRDHEIGHT
          );
        }
      };
    }

    requestAnimationFrame(updateByFrame);

    

  }, []);

  
  const mouseClick = () => {
    birdRef.current.y -= 50;

    

  }

  return (
    <div className="w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40] relative">
      <canvas id="flappybird-board"
      onClick={() => mouseClick()}
      ></canvas>
    </div>
  );
}
