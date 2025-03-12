import './App.css'
import React from "react";

interface PegProps {
  boardSize: number,
  spacing: number,
  placement: number,
  color?: string,
  x: number,
  y: number,
  z: number,
  selected: boolean,
  onClick: (x: number, y: number, z: number) => void
}

function Peg(props: PegProps) {
  const spacing = props.spacing;
  const size = props.boardSize;
  const placement = props.placement;
  const x = props.x;
  const y = props.y;
  const z = props.z;
  let color = "#FFF";
  if (props.color) {
    color = props.color
  }

  return (
    <>
      <circle fill={color} r={props.selected ? 6 : 8}
              cy={placement + y * spacing}
              cx={placement + (size - z) * spacing * .5 + x * spacing}
              onClick={() => props.onClick(y, x, z)}></circle>
      {props.selected && (<circle fill={"none"}
                            stroke={color} r={9}
                            cy={placement + y * spacing}
                            cx={placement + (size - z) * spacing * .5 + x * spacing}
                            onClick={() => props.onClick(y, x, z)}></circle>)}
    </>
  )
}

export default React.memo(Peg)
