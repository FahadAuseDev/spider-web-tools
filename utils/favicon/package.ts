import Ico from "./Ico";
import Png from "./png";

export type IconPackage = {
  ico: string;
  png16: string;
  png32: string;
  // png150: string;
  png180: string;
  png192: string;
  png512: string;
};

const Package = {
  generate(canvas: HTMLCanvasElement): IconPackage {
    const ico = new Ico(canvas);
    const png = new Png(canvas);
    return {
      ico: ico.generate(),
      png16: png.generate(16),
      png32: png.generate(32),
      // png150: png.generate(150),
      png180: png.generate(180),
      png192: png.generate(192),
      png512: png.generate(512),
    };
  },
};

export default Package;
