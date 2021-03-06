import { SceneManager } from './scene-manager.js';

const canvas = document.getElementById("myCanvas");
const maxWidth = 480;
const maxHeight = 360;
canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";

// Scale for retina
// Get the device pixel ratio, falling back to 1.
const dpr = window.devicePixelRatio || 1;
// Get the size of the canvas in CSS pixels.
const rect = canvas.getBoundingClientRect();
// Give the canvas pixel dimensions of their CSS
// size * the device pixel ratio.
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
// Scale all drawing operations by the dpr, so you
// don't have to worry about the difference.
/** @type {WebGLRenderingContext} */
const ctx = canvas.getContext("2d");
ctx.scale(dpr, dpr);

function gameLoop() {
    ctx.clearRect(0, 0, maxWidth, maxHeight);
   
    const currentScene = sceneManager.getCurrentScene();
    currentScene.update();
    currentScene.draw(ctx);

    requestAnimationFrame(gameLoop);
}

const sceneManager = new SceneManager(canvas, maxWidth, maxHeight, dpr);
gameLoop();