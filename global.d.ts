/* globals.d.ts */
interface ParticleSliderOptions {
  sliderId: string;
  container: HTMLElement;
  ptlGap: number;
  ptlSize: number;
  width: number;
  height: number;
}

declare class ParticleSlider {
  constructor(options: ParticleSliderOptions);
  init(reload?: boolean): void;
}

interface Window {
  ParticleSlider: typeof ParticleSlider;
}

