import React, { useEffect, useRef, useCallback } from "react";

const BIRDWIDTH = 34;
const BIRDHEIGHT = 24;
const BIRDSTARTPX = 360 / 8;
const BIRDSTARTPY = 640 / 2;
const birdImgFrame: HTMLImageElement[] = [];
const BIRDFLYVELOCITY = 3;
const BIRDFLYACCELERATION = 0.5;
const g = (2 / 200 * 60);

const PIPEWIDTH = 64;
const INITPIPEHEIGHT = 512;

let pipeImgTop: HTMLImageElement;
let pipeImgBottom: HTMLImageElement;

const flapInterval = 100;

const genPipe = () => {
  const positonTop = Math.floor(Math.random() * (480 - 110 + 1)) + 110;
  const gapRandom = Math.floor(Math.random() * 41) - 20;

  return {
    xtopPipe: 360,
    ytopPipe: -positonTop,
    xbottomPipe: 360,
    ybottomPipe: 640 - positonTop + gapRandom,
  };
};

export default function FlappyBird() {
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const birdFrame = useRef<number>(0);
  const birdRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }>({
    x: BIRDSTARTPX,
    y: BIRDSTARTPY,
    width: BIRDWIDTH,
    height: BIRDHEIGHT,
    rotation: 0,
  });
  const birdVelocityByG = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const keyStrokeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pipeArray = useRef<{ xtopPipe: number; ytopPipe: number; xbottomPipe: number; ybottomPipe: number }[]>([]);
  const pipeIntervalRender = useRef<number>(2000);
  const accelerationTime = useRef<number>(0);

  const lastRenderPipeTime = useRef<number>(0);

  const updateByFrame = (timestamp: number) => {
    const deltaT = (timestamp - lastFrameTime.current) / 1000;
    let isCollide = false;
    birdVelocityByG.current += g * deltaT;

    birdRef.current.y += birdVelocityByG.current;

    if (birdRef.current.rotation <= 90) {
      birdRef.current.rotation += 1;
    }

    if (birdRef.current.y > 510) {
      isCollide = true;
    }

    pipeArray.current.forEach((pipe,) => {

      const Xb = birdRef.current.x;
      const Yb = birdRef.current.y;

      // Collision detection
      if (
        Xb > pipe.xtopPipe - BIRDWIDTH + 4 &&
        Yb < pipe.ytopPipe + INITPIPEHEIGHT &&
        Xb < pipe.xtopPipe + PIPEWIDTH - 4
      ) {
        isCollide = true;
      }

      if (
        Xb > pipe.xbottomPipe - BIRDWIDTH + 4 &&
        Yb > pipe.ybottomPipe - BIRDHEIGHT &&
        Xb < pipe.xbottomPipe + PIPEWIDTH - 4
      ) {
        isCollide = true;
      }
    });

    if (isCollide) {
      cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    if (timestamp - lastFrameTime.current > flapInterval) {
      birdFrame.current = (birdFrame.current + 1) % 3;
      lastFrameTime.current = timestamp;
    }

    if (timestamp - lastRenderPipeTime.current > pipeIntervalRender.current) {
      const { xtopPipe, ytopPipe, xbottomPipe, ybottomPipe } = genPipe();
      pipeArray.current.push({ xtopPipe, ytopPipe, xbottomPipe, ybottomPipe });
      pipeIntervalRender.current = Math.floor(Math.random() * 1000) + 1500;
      lastRenderPipeTime.current = timestamp;
    }

    if (context.current) {
      context.current.clearRect(0, 0, 360, 640);

      // Draw pipes
      pipeArray.current.forEach((pipe, index) => {
        pipe.xtopPipe -= 1;
        pipe.xbottomPipe -= 1;
        if (context.current) {
          context.current.drawImage(pipeImgTop, pipe.xtopPipe, pipe.ytopPipe, PIPEWIDTH, INITPIPEHEIGHT);
          context.current.drawImage(pipeImgBottom, pipe.xbottomPipe, pipe.ybottomPipe, PIPEWIDTH, INITPIPEHEIGHT);
        }

        if (pipe.xtopPipe + PIPEWIDTH < -360) {
          pipeArray.current.splice(index, 1);
        }
      });

      // Draw bird with rotation
      context.current.save();
      context.current.translate(birdRef.current.x + birdRef.current.width / 2, birdRef.current.y + birdRef.current.height / 2);
      context.current.rotate((birdRef.current.rotation * Math.PI) / 180);
      context.current.drawImage(
        birdImgFrame[birdFrame.current],
        -birdRef.current.width / 2,
        -birdRef.current.height / 2,
        BIRDWIDTH,
        BIRDHEIGHT
      );
      context.current.restore();
    }

    animationFrameRef.current = requestAnimationFrame(updateByFrame);
  };

  const onPressSpace = useCallback(() => {
    if (birdRef.current.y + 45 < 0) {
      if (keyStrokeTimer.current) {
        clearTimeout(keyStrokeTimer.current);
      }
      return;
    }
    if (keyStrokeTimer.current) {
      clearTimeout(keyStrokeTimer.current);
    }
    birdRef.current.rotation = -45;
    accelerationTime.current += 1;
    birdVelocityByG.current = -(BIRDFLYVELOCITY + BIRDFLYACCELERATION * accelerationTime.current);
    keyStrokeTimer.current = setTimeout(() => {
      birdVelocityByG.current = 0;
      accelerationTime.current = 0;
    }, 200);
  }, []);

  useEffect(() => {
    const board = document.getElementById("flappybird-board") as HTMLCanvasElement;
    if (board) {
      board.width = 360;
      board.height = 640;
      context.current = board.getContext("2d");

      for (let i = 0; i < 3; i++) {
        birdImgFrame[i] = new Image();
        birdImgFrame[i].src = `/src/assets/flappybird/birdFrame${i + 1}.png`;
      }

      // Load pipe images
      pipeImgTop = new Image();
      pipeImgTop.src = '/src/assets/flappybird/top-pipe.png';
      pipeImgBottom = new Image();
      pipeImgBottom.src = '/src/assets/flappybird/bottom-pipe.png';

      // Generate initial pipe
      const { xtopPipe, ytopPipe, xbottomPipe, ybottomPipe } = genPipe();
      pipeArray.current.push({ xtopPipe, ytopPipe, xbottomPipe, ybottomPipe });

      // Start animation loop
      animationFrameRef.current = requestAnimationFrame(updateByFrame);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      context.current = null;
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        onPressSpace();
      }
    });

    return () => {
      document.removeEventListener("keydown", onPressSpace);
    };
  }, [onPressSpace]);

  return (
    <div className="w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40]">
      <div className="w-[360px] h-[640px] bg-white relative">
        <canvas
          className="w-full h-full absolute top-0 left-0 z-10"
          id="flappybird-board"
        ></canvas>
        <div className="w-full h-auto absolute bottom-0 left-0 z-20">
          <img src="/src/assets/bottom-background.png" alt="background-bt" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}
