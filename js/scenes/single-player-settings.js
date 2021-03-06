import { Scene } from "./scene.js";
import { writeHelp } from "../ui/helpUI.js";
import { supportsTouch } from '../settings.js';

export class SinglePlayerSettings extends Scene {
    constructor(canvas, maxWidth, maxHeight, dpr, buttonWidth) {
        super();
        this.canvas = canvas;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.dpr = dpr;
        this.buttonWidth = buttonWidth;
        this.subscribeToInputEvents();
        this.singlePlayer = false;
        this.control = supportsTouch ? "👆" : "⌨️";
        this.canvas.style.cursor = "default";
    }

    update() {
      this.controllers = [];
    }

    draw(/** @type {WebGLRenderingContext} */ ctx) {
        this.ctx = ctx;

        const menuSpacing = 42;

        ctx.font = "Bold 32px -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu";
        ctx.fillStyle = "black";
        let text = "Single Player";
        const titleWidth = ctx.measureText(text).width;
        ctx.fillText(text, this.maxWidth / 2 - titleWidth / 2, this.maxHeight / 2 - 90);

        this.controllerFontSize = 24;
        ctx.font = `Bold ${this.controllerFontSize}px -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu`;
        
        ctx.fillStyle = "black";
        text = "Select input method";
        ctx.fillText(text, this.maxWidth / 2 - ctx.measureText(text).width / 2, this.maxHeight / 2 - 30);

        const controllersStartX = this.maxWidth / 2 - (supportsTouch ? ctx.measureText("⌨️🖱🎮👆").width + 44 : ctx.measureText("⌨️🖱🎮").width + 28) / 2;
        this.addControlButton("⌨️", controllersStartX, this.maxHeight / 2 + 10, "Control the paddle using the ⬅️ and ➡️ keys on the ⌨️");
        this.addControlButton("🖱️", controllersStartX + 40, this.maxHeight / 2 + 10, "Control the paddle using the cursor with a 🖱️ or 🖲️");
        this.addControlButton("🎮", controllersStartX + 80, this.maxHeight / 2 + 10, "Control the paddle the 🕹 or the ⬅️ and ➡️ buttons on the 🎮");
        if (supportsTouch) {
          this.addControlButton("👆", controllersStartX + 120, this.maxHeight / 2 + 10, "Control the paddle with your 👆 by touching its desired position");
        }

        ctx.font = "Bold 16px -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu";

        text = "Let's go!";
        const settingsWidth = ctx.measureText(text).width;
        this.startGamePath = new Path2D();
        this.startGamePath.rect(this.maxWidth / 2 - this.buttonWidth / 2 - 10, (this.maxHeight / 2) + menuSpacing * 3 - 16 - 5, this.buttonWidth + 20, 32);
        this.startGamePath.closePath();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillStyle = "rgba(225,225,225,0.5)";
        ctx.fill(this.startGamePath);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.stroke(this.startGamePath);
        ctx.fillStyle = "black";
        ctx.fillText(text, this.maxWidth / 2 - settingsWidth / 2, (this.maxHeight / 2) + menuSpacing * 3);
    }

    addControlButton(text, x, y, description) {
      this.ctx.fillStyle = "black";
      this.ctx.fillText(text, x, y);
      const measuredWidth = this.ctx.measureText(text).width;
      const path = new Path2D();
      path.rect(x - 5, y - this.controllerFontSize, measuredWidth + 10, this.controllerFontSize + 5);
      path.closePath();
      this.ctx.fillStyle = "#FFFFFF00";
      this.ctx.fill(path);
      this.ctx.lineWidth = 2;
      if (text === this.getPlayer1Control()) {
        this.ctx.strokeStyle = "green";
        writeHelp(description);
      } else {
        this.ctx.strokeStyle = "#00000000";
      }
      
      this.ctx.stroke(path);
      this.controllers.push({path: path, control: text, isPlayer1: true});
    }

    dispose() {
        this.unsubscribeToInputEvents();
    }

    subscribeToInputEvents() {
        this.onClick = this.clickedHandler.bind(this);
        document.addEventListener("click", this.onClick);
        this.onMouseMove = this.moveHandler.bind(this);
        document.addEventListener("mousemove", this.onMouseMove);
    }

    unsubscribeToInputEvents() {
      document.removeEventListener("click", this.onClick);
      document.removeEventListener("mousemove", this.onMouseMove);
    }

    clickedHandler(e) {
      e.preventDefault();
      const XY = this.getXY(e);
      if (this.ctx.isPointInPath(this.startGamePath, XY.x, XY.y)) {
        this.singlePlayer = true;
        if (this.control === "🖱️") {
          this.canvas.style.cursor = "default";
        } else {
          this.canvas.style.cursor = "none";
        }
        
        return;
      }

      this.controllers.forEach(control => {
        if (this.ctx.isPointInPath(control.path, XY.x, XY.y)) {
          this.setPlayer1Control(control.control);
          return;
        }
      });
    }

    moveHandler(e) {
      e.preventDefault();
      const XY = this.getXY(e);
      if(this.ctx.isPointInPath(this.startGamePath, XY.x, XY.y) || this.controllers.some((p) => this.ctx.isPointInPath(p.path, XY.x, XY.y))) {
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "default";
      }
    }

    getPlayer1Control() {
      this.control = localStorage.getItem("Player1Control") ?? (supportsTouch ? "👆" : "⌨️");
      return this.control;
    }

    setPlayer1Control(control) {
      localStorage.setItem("Player1Control", control);
    }
}