import './App.css'
import React from "react";
import Territory from "./Territory.tsx";
import Border from "./Border.tsx";
import Peg from "./Peg.tsx";
import EndGameBanner from "./EndGameBanner.tsx";

function Game() {
  const startSize = 4;
  const endSize = 7;
  const spacing = 50;
  const boardPlacement = 100;
  function InitBoard() {
    const boardInit: number[][] = []
    for (let i = startSize; i <= endSize; i++) {
      boardInit.push(Array(i).fill(0))
    }
    for (let i = endSize - 1; i >= startSize; i--) {
      boardInit.push(Array(i).fill(0))
    }
    return boardInit
  }

  const startSizeTerritory = startSize + 3;
  const territoryRows = endSize - startSize;
  function InitTerritory() {
    const territoryInit = []
    let territorySize = startSizeTerritory;
    for (let i = 0; i < territoryRows; i++) {
      territoryInit.push(Array(territorySize).fill(-1))
      territorySize+=2;
    }
    for (let i = 0; i < territoryRows; i++) {
      territorySize-=2;
      territoryInit.push(Array(territorySize).fill(-1))
    }
    return territoryInit
  }

  function InitPlayers() {
    return [["Player One", "#F00", maxTerritories], ["Player Two", "#00F", maxTerritories]] as Player[];
  }

  function InitOpenTerritory() {
    let territoryCount = 0;
    for (let i = 0; i < territory.length; i++) {
      territoryCount += territory[i].length
    }
    return territoryCount;
  }

  const [board, setBoard] = React.useState(InitBoard());
  const [territory, setTerritory] = React.useState<Territories>(InitTerritory());
  const [openTerritory, setOpenTerritory] = React.useState(InitOpenTerritory());
  const [selected, setSelected] = React.useState<Point | null>(null);
  const [territoryBorders, setTerritoryBorders] = React.useState<Border[]>([]);
  const [maxTerritories, setMaxTerritories] = React.useState(21);
  const [players, setPlayers] = React.useState<Player[]>(InitPlayers())
  const [playerTurn, setPlayerTurn] = React.useState(0);
  const [possibleMoves, setPossibleMoves] = React.useState<Point[]>([]);
  const [Winner, setWinner] = React.useState(-1);
  const [midPoint, setMidPoint] = React.useState((board.length - 1) / 2);

  const NewGame = React.useCallback(() => {
    if (!GetGameEndInd) {
      return
    }
    setBoard(InitBoard());
    setTerritory(InitTerritory());
    setSelected(null);
    setTerritoryBorders([]);
    setPlayerTurn(0);
    setWinner(-1);
    setMidPoint((board.length - 1) / 2);
    setMaxTerritories(21);
    setPlayers(InitPlayers());
  }, [Winner]);

  const GetGameEndInd = React.useMemo(() => {
    return Winner !== -1;
  }, [Winner]);

  React.useEffect(() => {
    CalculatePossibleMoves();
  }, [selected]);

  React.useEffect(() => {
    let territories = maxTerritories
    let playerNumber = -1;
    players.forEach((player, index) => {
      if (player[2] <= 0) {
        playerNumber = index;
      }
      territories = Math.min(territories, player[2]);
      if (territories == player[2]) {
        playerNumber = index;
      }
    })
    if (playerNumber !== -1 && (territories <= 0 || openTerritory <= 0)) {
      setWinner(playerNumber);
    }
  }, [openTerritory, players]);

  function CalculatePossibleMoves() {
    if (selected === null) {
      setPossibleMoves([]);
    }
    else {
      const moves: Point[] = [];
      let offset = 0;
      let selectedLocation = "middle";
      if (selected[0] < midPoint) {
        offset = midPoint - Math.abs(selected[0] - midPoint);
        selectedLocation = "top";
      }
      else if (selected[0] > midPoint) {
        offset = midPoint - Math.abs(selected[0] - midPoint);
        selectedLocation = "bottom";
      }

      for (let i = 0; i < board.length; i++) {
        let location = "middle";
        if (i < midPoint) {
          location = "top";
        }
        else if (i > midPoint) {
          location = "bottom";
        }
        for (let k = 0; k < board[i].length; k++) {
          const y = i;
          let x = k;
          if (selectedLocation !== "middle" && selectedLocation !== location) {
            if (selectedLocation === "top") {
              x+=offset;
            } else {
              x+=offset;
            }
            if (selected[1] === board[selected[0]].length-1)
            {
              x-=3;
            }
          }

          if ((Math.abs(selected[0] - y) === 3
          && Math.abs(selected[1] - x) === 0)
          || (Math.abs(selected[0] - y) === 0
              && Math.abs(selected[1] - x) === 3)
          || ((selectedLocation !== "middle" || selected[1] - x > 0) && Math.abs(selected[0] - y) === 3
            && Math.abs(selected[1] - x) === 3)
          ) {
            const move: Point = [...selected];
            move[0] = i;
            move[1] = k;
            move[2] = board[move[0]].length
            const territoryBorders = GenerateTerritoryBorder([selected[0], selected[1]], [move[0], move[1]]);
            if (territoryBorders.length > 0)
              moves.push(move);
          }
        }
      }
      setPossibleMoves(moves);
      // console.log(selected);
      // console.log(moves);
    }
  }

  function FindTerritoryByPoint(prevPoint: TerritoryPoint, newPoint: TerritoryPoint) {
    return territoryBorders.findIndex(z => z[0][0] == prevPoint[0] && z[0][1] == prevPoint[1] && z[1][0] == newPoint[0] && z[1][1] == newPoint[1]
      || z[1][0] == prevPoint[0] && z[1][1] == prevPoint[1] && z[0][0] == newPoint[0] && z[0][1] == newPoint[1])
  }

  function GenerateTerritoryBorder(x: TerritoryPoint, y: TerritoryPoint) {
    if (y[1] < x[1])
    {
      const temp = x;
      x = y;
      y = temp;
    }
    // console.log("x,y",x,y)
    const xSign = -1 * Math.sign(x[0] - y[0])
    let ySign = -1 * Math.sign(x[1] - y[1])
    const yDelta = Math.abs(x[0] - y[0])
    const xDelta = Math.abs(x[1] - y[1])
    const crossMidpointInd = yDelta !== 0 && yDelta !== 3 || xDelta !== 0 && xDelta !== 3;
    let i = x[0];
    let k = x[1];
    const territoryList: Border[] = []
    let prevPoint: TerritoryPoint = [x[0], x[1]];
    for (let iter = 0; iter < 3; iter++) {
      i+=xSign;
      k+=ySign;
      if (i == midPoint && crossMidpointInd) {
        ySign -= ySign
      }
      const newPoint: TerritoryPoint = [i,k]
      if (FindTerritoryByPoint(prevPoint, newPoint) === -1) {
        territoryList.push([prevPoint,newPoint]);
      }
      prevPoint = newPoint;
    }
    // console.log("list",territoryList);
    // console.log("border",territoryBorders);
    return territoryList;
  }

  function ClaimTerritory(border: Border, point: TerritoryPoint) {
    if (FindTerritoryByPoint(border[0], point) !== -1 && FindTerritoryByPoint(border[1], point) !== -1 && players[playerTurn][2] > 0) {
      const [y, x] = CalculateTerritory(border[0], border[1], point);
      territory[y][x] = playerTurn
      setOpenTerritory(openTerritory-1);
      players[playerTurn][2] -= 1;
      setPlayers(players);
      setTerritory(territory);
    }
  }

  function ClaimTerritories(border: Border) {
    // up/down
    if (border[0][0] == border[1][0]) {
      const y = border[0][0];
      const x = border[0][1];
      let top = 0;
      let bottom = 0;
      if (border[0][0] < midPoint) {
        bottom = 1;
      }
      if (border[0][0] > midPoint) {
        top = 1;
      }
      const pointTop: TerritoryPoint = [y-1, x+top]
      const pointBottom: TerritoryPoint = [y+1, x+bottom]
      ClaimTerritory(border, pointTop);
      ClaimTerritory(border, pointBottom);
    }
    else if (border[0][1] == border[1][1]) {
      const y = Math.min(border[0][0], border[1][0]);
      const y2 = Math.max(border[0][0], border[1][0]);
      const x = border[0][1];
      let top = 0;
      let bottom = 0;
      if (y < midPoint) {
        bottom = 1;
        top = -1;
      }
      if (y2 > midPoint) {
        bottom = -1;
        top = 1;
      }
      const pointTop: TerritoryPoint = [y, x+top]
      const pointBottom: TerritoryPoint = [y2, x+bottom]
      console.log(pointTop,pointBottom, border[0], border[1]);
      ClaimTerritory(border, pointTop);
      ClaimTerritory(border, pointBottom);
    }
    else if (border[0][1] != border[1][1]) {
      const y = Math.min(border[0][0], border[1][0]);
      const y2 = Math.max(border[0][0], border[1][0]);
      let top = 0;
      let bottom = 0;
      if (y < midPoint) {
        top = (y == border[1][0] ? border[1][1] : border[0][1]) + 1;
        bottom = (y2 == border[1][0] ? border[1][1] : border[0][1]) - 1;
      }
      if (y2 > midPoint) {
        top = (y == border[1][0] ? border[1][1] : border[0][1]) - 1;
        bottom = (y2 == border[1][0] ? border[1][1] : border[0][1]) + 1;
      }
      const pointTop: TerritoryPoint = [y, top]
      const pointBottom: TerritoryPoint = [y2, bottom]
      ClaimTerritory(border, pointTop);
      ClaimTerritory(border, pointBottom);
    }
  }

  function CreateTerritoryBorder(x: TerritoryPoint, y: TerritoryPoint) {
    const newTerritory = GenerateTerritoryBorder(x, y)
    newTerritory.forEach((territory) => {
      if (openTerritory > 0 && players[playerTurn][2] > 0) {
        ClaimTerritories(territory);
      }
      territoryBorders.push(territory);
    })
    // console.log("border",territoryBorders);
    return newTerritory.length;
  }

  function Press(i: number, k: number, g: number) {
    if (GetGameEndInd) return undefined;

    if (selected !== null && selected[0] == i && selected[1] == k && selected[2] == g) {
      setSelected(null);
    } else if (selected !== null) {
      const index = possibleMoves.findIndex(x => x[0] == i && x[1] == k && x[2] == g);
      const territoryBorders = GenerateTerritoryBorder([selected[0],selected[1]], [i,k]);
      if (index !== -1 && territoryBorders.length > 0) {
        CreateTerritoryBorder([selected[0], selected[1]], [i,k])
        setSelected(null);
        setPlayerTurn((playerTurn+1) % players.length);
      }
    }
    else
      setSelected([i,k,g]);
    return undefined;
  }

  function Cancel(e: React.MouseEvent<SVGSVGElement>) {
    setSelected(null);
    e.preventDefault();
  }

  function SelectedInd(i: number, k: number, g: number) {
    if (!selected)
      return false;
    return selected[0] == i && selected[1] == k && selected[2] == g;
  }

  function GetPlayerColor(player: number) {
    if (player < 0) {return ""}
    return players[player][1];
  }

  function MoveInd(i: number, k: number, g: number) {
    if (selected === null) {
      return false;
    }
    const index = possibleMoves.findIndex(x => x[0] == i && x[1] == k && x[2] == g);
    return index !== -1;
  }

  function CircleColor(i: number, k: number, g: number) {
    const selectedInd = SelectedInd(i, k, g);
    if (selectedInd) {
      return GetPlayerColor(playerTurn);
    }
    else
    {
      if(MoveInd(i, k, g)) {
        return GetPlayerColor(playerTurn);
      }

      return "#FFF"
    }
  }

  const CalculateTerritory = React.useCallback((x: TerritoryPoint, y: TerritoryPoint, z: TerritoryPoint) => {
    const points = [x, y, z];
    const minY = Math.min(x[0], y[0], z[0]);
    const maxY = Math.max(x[0], y[0], z[0]);
    let territoryIndex = 0;
    let counter = 0;
    for (let i = 0; i < 3; i++) {
      if (maxY <= midPoint && minY == points[i][0]) {
        territoryIndex += points[i][1];
        counter++;
      }
      if (maxY > midPoint && maxY == points[i][0]) {
        territoryIndex += points[i][1];
        counter++;
      }

    }
    if (maxY <= midPoint && counter == 1) {
      territoryIndex *= 2
    }
    if (maxY > midPoint && counter == 1) {
      territoryIndex *= 2
    }
    return [minY, territoryIndex]
  }, [midPoint]);

  function GetPoints(number: number) {
    let points = 0;
    territory.forEach((ter) => {
      ter.forEach((p) => {
        if (p == number) {
          points++;
        }
      })
    })
    return points;
  }

  return (
    <>
      <EndGameBanner GameEndInd={GetGameEndInd} onClick={NewGame} color={GetPlayerColor(Winner)} winnerNumber={Winner} />
      <div style={{backgroundColor: "#888", fontWeight: "bold", display: "flex", alignItems: "center"}}>
        <div style={{color: GetPlayerColor(0), flex: 1}}>
          Player 1: {GetPoints(0)}
        </div>
        <div style={{color: GetPlayerColor(1), flex: 1}}>
          Player 2: {GetPoints(1)}
        </div>
      </div>
      <svg
        viewBox="0 0 500 500"
        width="500"
        height="500" className={"border-solid border-gray-400 border"}
        onContextMenu={Cancel}
        onClick={NewGame}>
        {territoryBorders.map((line, i) =>
          <Border placement={boardPlacement} spacing={spacing} border={line} boardSize={endSize} board={board} key={"line" + i} />
        )}
        {board.map((arr, y) =>
          <React.Fragment key={y}>
            {arr.map((_, x) =>
              <Peg placement={boardPlacement} x={x} y={y} z={arr.length} color={CircleColor(y, x, arr.length)} boardSize={endSize} spacing={spacing} selected={SelectedInd(y, x, arr.length)} onClick={Press} key={`circle_${y}_${x}`}/>
            )}
          </React.Fragment>
        )}
        {territory.map((arr, y) =>
          <React.Fragment key={y}>
            {arr.map((playerTurn, x) =>
              <Territory placement={boardPlacement} spacing={spacing} x={x} y={y} midPoint={midPoint} color={GetPlayerColor(playerTurn)} key={`triangle_${y}_${x}`}/>
            )}
          </React.Fragment>
        )}
      </svg>
    </>
  )
}

export default Game
