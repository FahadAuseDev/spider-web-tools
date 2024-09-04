interface CanvasUtil {
  resizeCanvasOptimal: (
    canvas: HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number
  ) => HTMLCanvasElement;
  resizeCanvas: (
    canvas: HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number
  ) => HTMLCanvasElement;
}

// Define the Canvas object with the methods typed correctly.
const Canvas: CanvasUtil = {
  /**
   * Resize the canvas by halving the width and height. This produces better
   * sampling and the image quality is generally better.
   */
  resizeCanvasOptimal: (
    canvas: HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number
  ): HTMLCanvasElement => {
    let currentCanvas = canvas;
    let currentWidth = canvas.width;
    let currentHeight = canvas.height;
    let resizedCanvas: HTMLCanvasElement | undefined;

    while (currentWidth / 2 >= targetWidth) {
      currentWidth = currentWidth / 2;
      currentHeight = currentHeight / 2;
      resizedCanvas = Canvas.resizeCanvas(
        currentCanvas,
        currentWidth,
        currentHeight
      );
      currentCanvas = resizedCanvas;
    }

    if (currentWidth > targetWidth) {
      resizedCanvas = Canvas.resizeCanvas(
        currentCanvas,
        targetWidth,
        targetHeight
      );
      currentCanvas = resizedCanvas;
    }

    return currentCanvas;
  },

  /**
   * Simple resize of a canvas element.
   */
  resizeCanvas: (
    canvas: HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number
  ): HTMLCanvasElement => {
    const resizedCanvas = document.createElement("canvas");
    const resizedContext = resizedCanvas.getContext("2d");

    if (!resizedContext) {
      throw new Error("2D context not available");
    }

    resizedCanvas.width = targetWidth;
    resizedCanvas.height = targetHeight;
    resizedContext.drawImage(canvas, 0, 0, targetWidth, targetHeight);

    return resizedCanvas;
  },
};

export default Canvas;
