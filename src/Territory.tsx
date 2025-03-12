import './App.css'
import React from "react";

interface TerritoryProps {
  x: number;
  y: number;
  spacing: number;
  placement: number
  midPoint: number
  color: string;
}

function Territory(props: TerritoryProps) {
  const midPoint = props.midPoint
  const spacing = props.spacing;
  const placement = props.placement;

  function PlaceTerritory(i: number, k: number) {
    const offset = Math.abs(midPoint - i);
    let flipInd = false;
    const sizeX = 10;
    const incrementX = spacing/2;
    const incrementY = spacing;

    let baseX = placement + 15;
    let baseY = placement + 40;
    let baseY2 = placement + 20;

    baseX += (offset-1) * incrementX;
    baseX += k * incrementX;
    baseY += i * incrementY;
    baseY2 += i * incrementY;

    flipInd = k % 2 === 1;
    flipInd = i >= midPoint ? !flipInd : flipInd;
    if (flipInd) {
      const flipY = -30;
      const flipY2 = 10;
      baseY += flipY;
      baseY2 += flipY2;
    }
    if (i >= midPoint) {
      baseX += incrementX;
    }

    return `${baseX},${baseY} ${baseX+sizeX},${baseY2} ${baseX+sizeX+sizeX},${baseY}`
  }

  return (
    <>
      <polygon points={PlaceTerritory(props.y, props.x)} style={{fill: props.color}}/>
    </>
  )
}

export default React.memo(Territory)
