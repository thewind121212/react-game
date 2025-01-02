import { useCallback, useEffect, useRef } from "react";

const BOARDWIDTH = 360;
const BOARDHEIGHT = 640;
const BIRDWIDTH = 34;
const BIRDHEIGHT = 24;
const BIRDSTARTPX = 360 / 8;
const BIRDSTARTPY = 640 / 2.4;
const GAME_START_WIDTH = 172
const GAME_START_HEIGHT = 160
const GAME_OVER_WIDTH = 188
const GAME_OVER_HEIGHT = 144
const END_GAME_RELATIVE_HEIGHT = 70
const TAP_WIDTH = 118
const TAP_HEIGHT = 36
let gameStartImg: HTMLImageElement
let gameOverImg: HTMLImageElement
const birdImgFrame: HTMLImageElement[] = [];
const tabImg: HTMLImageElement[] = [];
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



export const useFlappyBirdGame = ({ canvasId, mode = "offline" }: { canvasId: string, mode: "online" | "offline" }) => {
    console.log("mode", mode);
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
    const pipeArray = useRef<{ xtopPipe: number; ytopPipe: number; xbottomPipe: number; ybottomPipe: number, passed: boolean }[]>([]);
    const accelerationTime = useRef<number>(0);
    const disablePress = useRef<boolean>(false);
    const frameTime = useRef<number>(performance.now());
    const pipeRenderInterval = useRef<ReturnType<typeof setInterval> | null>(0);
    const tabFrame = useRef<number>(0);
    const scrore = useRef<number>(0);
    const endGameRender = useRef<boolean>(false);

    const gameStatus = useRef<"start" | "playing" | "end">("start");



    const updateByFrame = (timestamp: number) => {
        // Limit frame rate at 60fps
        const deltaFrameT = timestamp - frameTime.current;
        if (deltaFrameT < 1000 / 60) {
            animationFrameRef.current = requestAnimationFrame(updateByFrame);
            return;
        }
        frameTime.current = timestamp;

        if (gameStatus.current === "start") {
            if (context.current && !endGameRender.current) {
                context.current.clearRect(0, 0, 360, 640);
                context.current?.drawImage(birdImgFrame[birdFrame.current], BIRDSTARTPX, BIRDSTARTPY, BIRDWIDTH, BIRDHEIGHT);
                if (timestamp - lastFrameTime.current > FLAPINTERVAL) {
                    birdFrame.current = (birdFrame.current + 1) % 3;
                    tabFrame.current = (tabFrame.current + 1) % 2;
                    lastFrameTime.current = timestamp;
                }
                context.current.drawImage(gameStartImg, (360 - GAME_START_WIDTH) / 2, (640 - GAME_START_HEIGHT) / 2, GAME_START_WIDTH, GAME_START_HEIGHT);
                context.current.drawImage(tabImg[tabFrame.current], (360 - TAP_WIDTH) / 2, (640 - TAP_HEIGHT - 100) / 2 + 100, TAP_WIDTH, TAP_HEIGHT);
            }
        }


        if (gameStatus.current === "end") {
            if (context.current) {
                context.current.clearRect(0, 0, 360, 640);
                pipeArray.current.forEach((pipe) => {
                    if (context.current) {
                        context.current.drawImage(pipeImgTop, pipe.xtopPipe, pipe.ytopPipe, PIPEWIDTH, INITPIPEHEIGHT);
                        context.current.drawImage(pipeImgBottom, pipe.xbottomPipe, pipe.ybottomPipe, PIPEWIDTH, INITPIPEHEIGHT);
                    }
                });
                if (birdRef.current.y < 510) {
                    const deltaT = (timestamp - lastFrameTime.current) / 1000;
                    birdVelocityByG.current += GRAVITY_CONSTANT * deltaT;
                    birdRef.current.y += birdVelocityByG.current;
                    if (birdRef.current.rotation <= 90) {
                        birdRef.current.rotation += FRAME_ROTATION_INTENSITY + 2;
                    }
                } else {
                    birdRef.current.y = 510;
                }
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
                context.current.drawImage(gameOverImg, (360 - GAME_OVER_WIDTH) / 2, (640 - GAME_OVER_HEIGHT) / 2 - (120 - END_GAME_RELATIVE_HEIGHT), GAME_OVER_WIDTH, GAME_OVER_HEIGHT);
                if (timestamp - lastFrameTime.current > FLAPINTERVAL) {
                    tabFrame.current = (tabFrame.current + 1) % 2;
                    lastFrameTime.current = timestamp;
                }
                context.current.drawImage(tabImg[tabFrame.current], (360 - TAP_WIDTH) / 2, (640 - TAP_HEIGHT - (190 - END_GAME_RELATIVE_HEIGHT)) / 2 + 100, TAP_WIDTH, TAP_HEIGHT);
                context.current.lineWidth = 2
                context.current.font = "40px Squada One";
                context.current.fillStyle = "white";
                context.current.fillText("SCORE        " + scrore.current.toString(), BOARDWIDTH / 2 - 96, BOARDWIDTH / 2 + (16 + 10 + END_GAME_RELATIVE_HEIGHT));
                context.current.fillText("BEST         " + "10", BOARDWIDTH / 2 - 96, BOARDWIDTH / 2 + (58 + 10 + END_GAME_RELATIVE_HEIGHT));
            }

        }


        if (gameStatus.current === "playing") {

            //draw the score

            // Calculate delta time for flappy wings
            const deltaT = (timestamp - lastFrameTime.current) / 1000;
            birdVelocityByG.current += GRAVITY_CONSTANT * deltaT;

            birdRef.current.y += birdVelocityByG.current;

            if (birdRef.current.rotation <= 90) {
                birdRef.current.rotation += FRAME_ROTATION_INTENSITY;
            }


            if (birdRef.current.y > 510) {
                birdRef.current.y = 510;
                disablePress.current = true;
                gameStatus.current = "end";
                birdVelocityByG.current = 10;
                clearInterval(pipeRenderInterval.current!);
            }

            pipeArray.current.forEach((pipe) => {

                const Xb = birdRef.current.x;
                const Yb = birdRef.current.y;

                // Collision detection
                if (
                    (Xb > pipe.xtopPipe - BIRDWIDTH + 4 &&
                        Yb < pipe.ytopPipe + INITPIPEHEIGHT &&
                        Xb < pipe.xtopPipe + PIPEWIDTH - 4) ||
                    (Xb > pipe.xbottomPipe - BIRDWIDTH + 4 &&
                        Yb > pipe.ybottomPipe - BIRDHEIGHT &&
                        Xb < pipe.xbottomPipe + PIPEWIDTH - 4)
                ) {
                    disablePress.current = true;
                    gameStatus.current = "end";
                    clearInterval(pipeRenderInterval.current!);
                }

                if (Xb > pipe.xtopPipe + PIPEWIDTH && !pipe.passed) {
                    scrore.current += 1;
                    pipe.passed = true;
                }
            });

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

                // Draw score
                context.current.lineWidth = 2
                context.current.font = "40px Squada One";
                context.current.fillStyle = "white";
                context.current.fillText(scrore.current.toString(), 360 / 2 - 20, 50);
                context.current.strokeText(scrore.current.toString(), 360 / 2 - 20, 50);
            }


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
        const board = document.getElementById(canvasId) as HTMLCanvasElement;
        if (board) {
            board.width = BOARDWIDTH;
            board.height = BOARDHEIGHT;
            context.current = board.getContext("2d");



            // Load images for bird and pipes
            for (let i = 0; i < 3; i++) {
                birdImgFrame[i] = new Image();
                birdImgFrame[i].src = `/flappybird/birdFrame${i + 1}.png`;
            }
            // Load Image for game start
            gameStartImg = new Image();
            gameStartImg.src = '/flappybird/start.png';


            //loading the tab frame
            for (let i = 0; i < 2; i++) {
                tabImg[i] = new Image();
                tabImg[i].src = `/flappybird/taps/t${i + 1}.png`;
            }

            //load the game over image
            gameOverImg = new Image();
            gameOverImg.src = '/flappybird/go.png';



            pipeImgTop = new Image();
            pipeImgTop.src = '/flappybird/top-pipe.png';
            pipeImgBottom = new Image();
            pipeImgBottom.src = '/flappybird/bottom-pipe.png';


            //gen the first pipe pair
            const { xtopPipe, ytopPipe, xbottomPipe, ybottomPipe } = genPipe();
            pipeArray.current.push({ xtopPipe: xtopPipe, ytopPipe, xbottomPipe: xbottomPipe, ybottomPipe, passed: false });

            //draw the first top pipe
            pipeImgTop.onload = () => {
                context.current?.drawImage(pipeImgTop, xtopPipe, ytopPipe, PIPEWIDTH, INITPIPEHEIGHT);
            }
            // draw the first bottom pipe
            pipeImgBottom.onload = () => {
                context.current?.drawImage(pipeImgBottom, xbottomPipe, ybottomPipe, PIPEWIDTH, INITPIPEHEIGHT);
            }

        }

        animationFrameRef.current = requestAnimationFrame(updateByFrame);

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



        return () => {
            document.removeEventListener("keydown", onPressSpace);
        };
    }, [onPressSpace]);


    const runGame = useCallback((type: "start game" | "start" = "start game") => {
        if (type === "start") {
            gameStatus.current = "start";
        }

        if (type === "start game") {
            gameStatus.current = "playing";
        }

        clearInterval(pipeRenderInterval.current!);
        pipeRenderInterval.current = setInterval(() => {
            const { xtopPipe, ytopPipe, xbottomPipe, ybottomPipe } = genPipe();
            pipeArray.current.push({ xtopPipe, ytopPipe, xbottomPipe, ybottomPipe, passed: false });
        }, 1400)

        cancelAnimationFrame(animationFrameRef.current);
        if (context.current) {
            context.current.clearRect(0, 0, 360, 640);
        }
        birdRef.current = {
            x: BIRDSTARTPX,
            y: BIRDSTARTPY,
            width: BIRDWIDTH,
            height: BIRDHEIGHT,
            rotation: 0,
        };
        birdVelocityByG.current = 0;
        scrore.current = 0;
        lastFrameTime.current = performance.now();
        disablePress.current = false;
        accelerationTime.current = 0;
        if (gameStatus.current === "playing") {
            pipeArray.current = [];
            const { xtopPipe, ytopPipe, xbottomPipe, ybottomPipe } = genPipe();
            pipeArray.current.push({ xtopPipe: xtopPipe, ytopPipe, xbottomPipe: xbottomPipe, ybottomPipe, passed: false });
        }
        animationFrameRef.current = requestAnimationFrame(updateByFrame);


    }, [])



    return { runGame, gameStatus };
}
