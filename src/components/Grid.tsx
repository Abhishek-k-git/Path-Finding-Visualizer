import React, { useEffect, useRef, useState } from "react";
import {
  algorithm,
  cellInterface,
  optionInterface,
} from "../interfaces/index.ts";
import { getCellObj, getPath } from "../utilities/index.ts";
import Cell from "./Cell.tsx";
import { SideOver } from "./SideOver.tsx";
import StatSection from "./StatSection.tsx";
import Select from "./Select.tsx";
import {
  generateRandomMaze,
  generateRecursiveMaze,
} from "../utilities/index.ts";

import { BFS } from "../algorithms/BFS.ts";
import { DFS } from "../algorithms/DFS.ts";
import { Dijkstra } from "../algorithms/Dijkstra.ts";

import { FaArrowRight } from "react-icons/fa6";
import { BsPlay } from "react-icons/bs";
import { GrClear } from "react-icons/gr";
import { PiPathBold } from "react-icons/pi";
import { MdOutlineSpeed } from "react-icons/md";
import { HiMiniCubeTransparent } from "react-icons/hi2";

const Grid = () => {
  // useRef
  const gridBoardCells = useRef(getCellObj());

  // useState
  const [startPoint, setStartPoint] = useState<cellInterface | null>(null);
  const [endPoint, setEndPoint] = useState<cellInterface | null>(null);
  const [foundPath, setFoundPath] = useState<cellInterface[] | null>(null);

  const [cellsScanned, setCellsScanned] = useState(0);
  const [cellsTraveled, setCellsTraveled] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [renderFlag, setRenderFlag] = useState(false);

  const [selectedAlgo, setSelectedAlgo] = useState<optionInterface | null>(
    null
  );
  const [showInfoOf, setShowInfoOf] = useState<algorithm | null>(null);
  const [speed, setSpeed] = useState<"slow" | "medium" | "fast">("medium");

  // get Speed
  const getSpeedMultiplier = () => {
    switch (speed) {
      case "fast":
        return {
          algo: 3,
          path: 15,
        };
      case "medium":
        return {
          algo: 10,
          path: 20,
        };
      case "slow":
        return {
          algo: 100,
          path: 125,
        };
    }
  };

  // reset Board
  const resetBoardData = () => {
    document.querySelectorAll(`.cell`).forEach((item) => {
      if (item.classList.contains("cell-visited")) {
        item.classList.remove("cell-visited");
      }
      if (item.classList.contains("cell-path")) {
        item.classList.remove("cell-path");
      }
    });
    setFoundPath(null);
    setCellsScanned(0);
    setCellsTraveled(0);
    setTimeTaken(0);
  };

  // clear path
  const clearPath = () => {
    gridBoardCells.current = getCellObj(true, false, gridBoardCells.current);
    // only reset path and ignore walls
    resetBoardData();
  };

  // clear Board
  const clearBoard = () => {
    gridBoardCells.current = getCellObj(true, true, gridBoardCells.current);
    resetBoardData();
  };

  // on Mouse Enter
  const onMouseEnter = (indRow: number, indCol: number) => {
    setRenderFlag(!renderFlag);
    let element = gridBoardCells.current[indRow];
    if (!isMouseDown) return;
    if (element[indCol].isStartPoint || element[indCol].isEndPoint) return;

    element[indCol].isWall = !element[indCol].isWall;
  };

  // on Cell Click
  const onCellClick = (cell: cellInterface, indRow: number, indCol: number) => {
    let clickedCell = gridBoardCells.current[indRow][indCol];
    if (clickedCell.isWall) {
      clickedCell.isWall = false;
      return;
    }
    if (cell.cellNumber === startPoint?.cellNumber) {
      setStartPoint(null);
      clickedCell.isStartPoint = false;
      clickedCell.distance = Infinity;
      return;
    }
    if (cell.cellNumber === endPoint?.cellNumber) {
      setEndPoint(null);
      clickedCell.isEndPoint = false;
      return;
    }

    if (startPoint && endPoint) {
      clickedCell.isWall = true;
      return;
    }
    if (!startPoint) {
      setStartPoint({
        ...clickedCell,
        isStartPoint: true,
        distance: 0,
      });
      clickedCell.isStartPoint = true;
      clickedCell.distance = 0;
    } else if (startPoint) {
      setEndPoint({
        ...clickedCell,
        isEndPoint: true,
      });
      clickedCell.isEndPoint = true;
    }
  };

  // animate algorithm
  const animateAlgo = (
    visitedCells: cellInterface[],
    path: cellInterface[]
  ) => {
    for (let i = 0; i < visitedCells.length; i++) {
      setTimeout(() => {
        const cell = visitedCells[i];
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " cell-visited";
        if (cell.isTarget) {
          setFoundPath(path);
        }
      }, (getSpeedMultiplier().algo || 10) * i);
    }
  };

  // animate path
  const animatePath = (path: cellInterface[]) => {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const cell = path[i];
        setCellsTraveled(i + 1);
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " cell-path";
      }, (getSpeedMultiplier().path || 25) * i);
    }
  };

  // visualize algorithm
  const visualizeAlgo = (type: algorithm) => {
    if (!startPoint || !endPoint) {
      alert("Please mark starting and ending point");
      return;
    }
    let grid = gridBoardCells.current;
    let start = grid[startPoint.row][startPoint.col];
    let end = grid[endPoint.row][endPoint.col];
    let visitedCells: cellInterface[] = [];
    switch (type) {
      case algorithm.DIJKSTRA:
        let [dCells, DTime] = Dijkstra(grid, start, end) || [];
        visitedCells = dCells || [];
        setTimeTaken(DTime || 0);
        break;
      case algorithm.DFS:
        let [DFSCells, DFSTime] = DFS(grid, start, end) || [];
        visitedCells = DFSCells || [];
        setTimeTaken(DFSTime || 0);
        break;
      case algorithm.BFS:
        let [BFSCells, BFSTime] = BFS(grid, start, end) || [];
        visitedCells = BFSCells || [];
        setTimeTaken(BFSTime || 0);
        break;
    }
    const path = getPath(end);
    setCellsScanned(visitedCells.length);
    animateAlgo(visitedCells, path);
  };

  useEffect(() => {
    if (foundPath && startPoint && endPoint) {
      animatePath(foundPath);
    }
  }, [foundPath]);

  return (
    <div className="bg-yellow-100">
      <SideOver
        algo={showInfoOf}
        onClose={() => {
          setShowInfoOf(null);
        }}
      />
      <div className="bg-slate-950 p-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs lg:text-sm">
          <div className="flex align-center justify-between flex-col md:flex-row w-full">
            <div className="flex flex-wrap mb-4 md:mb-0">
              <Select selectedAlgo={selectedAlgo} onSelect={setSelectedAlgo} />
              <button
                disabled={!selectedAlgo}
                onClick={() =>
                  selectedAlgo ? visualizeAlgo(selectedAlgo?.type) : null
                }
                className="items-center w-fit disabled:opacity-75 disabled:cursor-not-allowed inline-flex bg-indigo-600 text-white px-3 rounded-r-sm"
              >
                <BsPlay className="h-5 w-5" />
                {/* {selectedAlgo
                  ? `Visualize ${selectedAlgo?.name}`
                  : "Select an algorithm"} */}
              </button>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-4">
              <button
                onClick={() => {
                  clearBoard();
                  setRenderFlag(!renderFlag);
                }}
                className="items-center w-fit disabled:opacity-75 disabled:cursor-not-allowed inline-flex bg-red-500 text-white px-4 py-2 rounded-sm"
              >
                <GrClear className="h-3 w-3 mr-1" /> Clear board
              </button>
              <button
                onClick={() => {
                  clearPath();
                }}
                className="items-center w-fit disabled:opacity-75 disabled:cursor-not-allowed inline-flex bg-red-500 text-white px-4 py-2 rounded-sm"
              >
                <PiPathBold className="h-3 w-3 mr-1" /> Clear path
              </button>
              <button
                onClick={() => {
                  setSpeed(
                    speed === "fast"
                      ? "medium"
                      : speed === "medium"
                      ? "slow"
                      : "fast"
                  );
                }}
                className="items-center w-fit disabled:opacity-75 disabled:cursor-not-allowed inline-flex bg-yellow-500 text-white px-4 py-2 rounded-sm"
              >
                <MdOutlineSpeed className="h-4 w-3 mr-1" /> Speed: {speed}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-200">
        <div className="flex lg:px-0 px-4 py-4 max-w-5xl mx-auto items-center justify-between text-xs lg:text-sm gap-2">
          <div className="flex flex-wrap gap-x-2 gap-y-4">
            <button
              className="items-center w-fit disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-white px-4 py-2"
              onClick={() => {
                setRenderFlag(!renderFlag);
                clearBoard(); // just to be sure that board and path is cleared
                generateRandomMaze(gridBoardCells.current);
              }}
            >
              <HiMiniCubeTransparent className="h-3 w-3 mr-1 text-xs" />{" "}
              Generate random maze
            </button>
            <span
              className="md:block hidden h-4 w-px bg-gray-600"
              aria-hidden="true"
            />
            <button
              className="items-center w-fit disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-white px-4 py-2"
              onClick={() => {
                setRenderFlag(!renderFlag);
                clearBoard(); // just to be sure that board and path is cleared
                generateRecursiveMaze(
                  gridBoardCells.current,
                  startPoint,
                  endPoint
                );
              }}
            >
              <HiMiniCubeTransparent className="h-3 w-3 mr-1 text-xs" />
              Generate recursive maze
            </button>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-4">
            <div className="flex gap-6 justify-center max-w-7xl mx-auto items-center">
              <StatSection
                stats={[
                  {
                    name: "Cells scanned",
                    data: cellsScanned.toString(),
                  },
                  {
                    name: "Cells traveled",
                    data: cellsTraveled.toString(),
                  },
                  {
                    name: "Time taken",
                    data: `${timeTaken?.toFixed(2)}ms`,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      {selectedAlgo ? (
        <div className="flex my-3 w-full mx-auto justify-end max-w-7xl">
          <button
            className="mx-4 text-indigo-700 inline-flex items-center text-xs lg:text-sm font-medium underline"
            onClick={() => {
              setShowInfoOf(selectedAlgo.type);
            }}
          >
            Know more about {selectedAlgo?.name}{" "}
            <FaArrowRight className="h-3 w-3 ml-1 font-bold" />
          </button>
        </div>
      ) : null}
      <div className="grid grid-cols-gridmap overflow-auto w-full px-4 justify-start md:justify-center items-center my-3">
        {gridBoardCells.current.map((row, rowIndex) => {
          return (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => {
                return (
                  <Cell
                    key={colIndex}
                    id={`cell-${cell.row}-${cell.col}`}
                    onMouseDown={() => {
                      setIsMouseDown(true);
                    }}
                    onMouseEnter={() => {
                      onMouseEnter(rowIndex, colIndex);
                    }}
                    onMouseUp={() => {
                      setIsMouseDown(false);
                    }}
                    onClick={() => {
                      onCellClick(cell, rowIndex, colIndex);
                    }}
                    {...cell}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
