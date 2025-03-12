import './App.css'
import React from "react";

interface BorderProps {
  border: Border;
  boardSize: number;
  board: number[][];
  spacing: number;
  placement: number
  strokeColor?: string;
}

function Border(props: BorderProps) {
  const spacing = props.spacing;
  const size = props.boardSize;
  const placement = props.placement;
  let stroke = "#FFF";
  if (props.strokeColor) {
    stroke = props.strokeColor
  }

  return (
    <>
      <line stroke={stroke}
            x1={placement + (size - props.board[props.border[0][0]].length) * spacing * .5 + props.border[0][1] * spacing}
            y1={placement + props.border[0][0] * spacing}
            x2={placement + (size - props.board[props.border[1][0]].length) * spacing * .5 + props.border[1][1] * spacing}
            y2={placement + props.border[1][0] * spacing}
            ></line>
    </>
  )
}

export default React.memo(Border)
