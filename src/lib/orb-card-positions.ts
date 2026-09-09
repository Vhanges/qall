/** Shared store so orbiting cards can pass their last screen positions and DOM to the FeatureShowcase silo animation. */

export interface CardRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

let _positions: CardRect[] = [];
let _elements: HTMLElement[] = [];

export function setOrbCardPositions(positions: CardRect[]) {
  _positions = positions;
}

export function getOrbCardPositions(): CardRect[] {
  return _positions;
}

export function setOrbCardElements(elements: HTMLElement[]) {
  _elements = elements;
}

export function getOrbCardElements(): HTMLElement[] {
  return _elements;
}
