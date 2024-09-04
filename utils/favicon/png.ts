import Canvas from "./canvas";

export default class Png {
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  generate(size: number): string {
    const resizedCanvas = Canvas.resizeCanvasOptimal(this.canvas, size, size);
    return resizedCanvas.toDataURL();
  }
}
