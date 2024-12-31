import React, { useEffect, useRef, useCallback } from "react";

const BOARDWIDTH = 360;
const BOARDHEIGHT = 640;
const BIRDWIDTH = 34;
const BIRDHEIGHT = 24;
const BIRDSTARTPX = 360 / 8;
const BIRDSTARTPY = 640 / 2;
const birdImgFrame: HTMLImageElement[] = [];
const BIRDFLYVELOCITY = 6;
const BIRDFLYACCELERATION = 0.5;
const GRAVITY_CONSTANT = (15 / 200 * 60);
const PIPEWIDTH = 64;
const INITPIPEHEIGHT = 512;
let pipeImgTop: HTMLImageElement;
let pipeImgBottom: HTMLImageElement;
const FLAPINTERVAL = 100;
const FRAME_ROTATION_INTENSITY = 1.8;

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
  const accelerationTime = useRef<number>(0);
  const disablePress = useRef<boolean>(false);
  const frameTime = useRef<number>(0);
  const pipeRenderInterval = useRef<ReturnType<typeof setInterval> | null>(0);


  const updateByFrame = (timestamp: number) => {
    // Limit frame rate at 60fps
    const deltaFrameT = timestamp - frameTime.current;
    if (deltaFrameT < 1000 / 60) {
      animationFrameRef.current = requestAnimationFrame(updateByFrame);
      return;
    }
    frameTime.current = timestamp;


    // Calculate delta time for flappy wings
    const deltaT = (timestamp - lastFrameTime.current) / 1000;
    let isCollide = false;
    birdVelocityByG.current += GRAVITY_CONSTANT * deltaT;

    birdRef.current.y += birdVelocityByG.current;

    if (birdRef.current.rotation <= 90) {
      birdRef.current.rotation += FRAME_ROTATION_INTENSITY;
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
        disablePress.current = true;
      }

      if (
        Xb > pipe.xbottomPipe - BIRDWIDTH + 4 &&
        Yb > pipe.ybottomPipe - BIRDHEIGHT &&
        Xb < pipe.xbottomPipe + PIPEWIDTH - 4
      ) {
        disablePress.current = true;
      }
    });

    if (isCollide) {
      cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    if (timestamp - lastFrameTime.current > FLAPINTERVAL) {
      birdFrame.current = (birdFrame.current + 1) % 3;
      lastFrameTime.current = timestamp;
    }


    if (context.current) {
      context.current.clearRect(0, 0, 360, 640);

      // Draw pipes
      pipeArray.current.forEach((pipe, index) => {
        if (!disablePress.current) {
          pipe.xtopPipe -= 4;
          pipe.xbottomPipe -= 4;
        }
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
    if (disablePress.current) return
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
      board.width = BOARDWIDTH;
      board.height = BOARDHEIGHT;
      context.current = board.getContext("2d");



      // Load images for bird and pipes
      for (let i = 0; i < 3; i++) {
        birdImgFrame[i] = new Image();
        birdImgFrame[i].src = `/src/assets/flappybird/birdFrame${i + 1}.png`;
      }


      pipeImgTop = new Image();
      pipeImgTop.src = '/src/assets/flappybird/top-pipe.png';
      pipeImgBottom = new Image();
      pipeImgBottom.src = '/src/assets/flappybird/bottom-pipe.png';

      animationFrameRef.current = requestAnimationFrame(updateByFrame);

      //init the first pipe
      const { xtopPipe, ytopPipe, xbottomPipe, ybottomPipe } = genPipe();
      pipeArray.current.push({ xtopPipe, ytopPipe, xbottomPipe, ybottomPipe });

    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      context.current = null;
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        onPressSpace();
      }
    });


    pipeRenderInterval.current = setInterval(() => {
      const { xtopPipe, ytopPipe, xbottomPipe, ybottomPipe } = genPipe();
      pipeArray.current.push({ xtopPipe, ytopPipe, xbottomPipe, ybottomPipe });
    }, 1400)

    return () => {
      document.removeEventListener("keydown", onPressSpace);
      clearInterval(pipeRenderInterval.current!);
    };
  }, [onPressSpace]);

  return (
    <div className="w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40]">
      <div className="w-[360px] h-[640px] bg-white relative"
        onClick={onPressSpace}
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
