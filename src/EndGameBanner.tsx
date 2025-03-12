import './App.css'
import React from "react";

interface EndGameBannerProps {
  winnerNumber: number,
  color: string,
  GameEndInd: boolean,
  onClick: () => void
}

function EndGameBanner(props: EndGameBannerProps) {

  return (
    <>
      {!props.GameEndInd && (
        <div>
          <div style={{flex: 1}}>&nbsp;</div>
          <div style={{flex: 1}}>&nbsp;</div>
        </div>
      )}
      {props.GameEndInd && (
        <div style={{
          backgroundColor: "#888",
          fontWeight: "bold",
          position: "relative",
          top: 75
        }} onClick={props.onClick}>
          <div style={{color: props.color, flex: 1}}>Player {props.winnerNumber + 1} Wins!</div>
          <div style={{flex: 1}}>Click to play a new game</div>
        </div>
      )}
    </>
  )
}

export default React.memo(EndGameBanner)
