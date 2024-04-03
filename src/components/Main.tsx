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
import { PiPathBold } from "react-icons/pi";
import { MdOutlineSpeed } from "react-icons/md";
import { HiMiniCubeTransparent } from "react-icons/hi2";
import { IoTrashBin } from "react-icons/io5";
import { TbArrowCurveLeft } from "react-icons/tb";
import { TbArrowCurveRight } from "react-icons/tb";

const Main = () => {
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
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
      <SideOver
        algo={showInfoOf}
        onClose={() => {
          setShowInfoOf(null);
        }}
      />

      <div className="w-full h-screen md:w-2/6 max-w-md md:p-4">
        <div className="w-full h-screen md:bg-zinc-950 md:rounded-2xl md:p-2 md:h-full md:flex md:flex-col md:justify-between">
          {/* select button */}
          <div className="w-full max-w-[320px] md:max-w-[420px] absolute md:relative md:my-2 top-0 left-1/2 -translate-x-1/2 z-[500]">
            <div className="w-full px-2 py-1 my-2 rounded-xl shadow-xl bg-indigo-500">
              <Select selectedAlgo={selectedAlgo} onSelect={setSelectedAlgo} />
              <button
                disabled={!selectedAlgo}
                onClick={() =>
                  selectedAlgo ? visualizeAlgo(selectedAlgo?.type) : null
                }
                className="flex items-center justify-center w-full p-2 text-xs font-semibold tracking-wider rounded-lg bg-indigo-400 text-white disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {selectedAlgo ? "Apply" : "Select"}
              </button>
            </div>
          </div>
          <div>
            {/* controls */}
            <div className="w-full max-w-[220px] md:max-w-[420px] absolute md:relative top-[70px] left-1/2 -translate-x-1/2 z-[200] md:top-auto flex flex-col">
              {/* generate maze */}
              <div className="w-full my-4 py-1 px-1 lg:px-2 rounded-lg bg-zinc-800 text-white">
                <span className="hidden md:block text-xs px-2 font-semibold text-white text-opacity-60 tracking-wide">
                  Generate Maze
                </span>
                <div className="flex flex-row gap-1 md:gap-2 md:mt-1 md:rounded-lg bg-zinc-900">
                  {/* random maze */}
                  <button
                    className="w-1/2 flex flex-row items-center justify-center gap-1 md:gap-2 text-white p-1 md:px-2 md:py-3 rounded-lg text-xs disabled:bg-opacity-10 disabled:cursor-not-allowed"
                    onClick={() => {
                      setRenderFlag(!renderFlag);
                      clearBoard(); // just to be sure that board and path is cleared
                      generateRandomMaze(gridBoardCells.current);
                    }}
                  >
                    <HiMiniCubeTransparent className="h-3 w-3" />
                    Random
                  </button>
                  {/* recursive maze */}
                  <button
                    className="w-1/2 flex flex-row items-center justify-center gap-1 md:gap-2 text-white p-1 md:px-2 md:py-3 rounded-lg text-xs disabled:bg-opacity-10 disabled:cursor-not-allowed"
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
                    <HiMiniCubeTransparent className="h-3 w-3" />
                    Recursive
                  </button>
                </div>
              </div>
            </div>
            {/* boards */}
            <div className="absolute md:relative bottom-[80px] md:bottom-auto left-4 md:left-auto md:w-full gap-4 md:gap-0 flex flex-col md:flex-row my-4 md:bg-zinc-800 text-white">
              <div className="w-1/2 flex flex-col gap-4 md:gap-2 md:flex-row">
                {/* clear board */}
                <button
                  onClick={() => {
                    clearBoard();
                    setRenderFlag(!renderFlag);
                  }}
                  className="z-[500] bg-red-600 w-10 h-10 rounded-full md:bg-transparent md:rounded-none md:h-auto relative md:w-1/2 flex items-center justify-center border-r border-white border-opacity-10"
                >
                  <IoTrashBin className="h-4 w-4 md:h-3 md:w-3 text-red-100 md:text-red-500" />
                  <span className="hidden md:block absolute top-2/3 left-1/2 -translate-x-1/2">
                    <TbArrowCurveLeft className="h-6 w-6 text-red-500" />
                  </span>
                  <span className="hidden md:block absolute text-nowrap top-[110%] left-1/2 -translate-x-1/2 text-xs bg-red-500 px-2 py-1 rounded-lg">
                    clear board
                  </span>
                </button>
                {/* clear path */}
                <button
                  onClick={() => {
                    clearPath();
                  }}
                  className="z-[500] bg-red-600 w-10 h-10 rounded-full md:bg-transparent md:rounded-none md:h-auto relative md:w-1/2 flex items-center justify-center border-r border-white border-opacity-10"
                >
                  <PiPathBold className="h-4 w-4 md:h-3 md:w-3 text-red-100 md:text-red-500" />
                  <span className="hidden md:block absolute top-2/3 left-1/2 -translate-x-1/2">
                    <TbArrowCurveRight className="h-6 w-6 text-red-500" />
                  </span>
                  <span className="hidden md:block absolute text-nowrap top-[110%] left-1/2 -translate-x-1/2 text-xs bg-red-500 px-2 py-1 rounded-lg">
                    clear path
                  </span>
                </button>
              </div>
              {/* speed */}
              <div className="w-1/2 p-1 z-[500]">
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
                  className="w-full"
                >
                  <span className="hidden md:flex w-full flex-row items-center justify-center gap-2 bg-zinc-900 text-white px-2 py-3 rounded-lg text-xs disabled:bg-opacity-10 disabled:cursor-not-allowed">
                    <MdOutlineSpeed className="h-3 w-3" />
                    {speed}
                  </span>
                  <span className="flex items-center justify-center md:hidden w-10 h-10 bg-zinc-950 rounded-full">
                    <svg
                      width="34px"
                      height="34px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {speed === "fast" ? (
                        <path
                          d="M20.1691 10.2177C20.7024 11.3675 21 12.649 21 13.9999C21 15.4684 20.6483 16.8547 20.0245 18.0793C19.7216 18.674 19.0839 18.9999 18.4165 18.9999H5.58351C4.91613 18.9999 4.27839 18.674 3.97547 18.0793C3.3517 16.8547 3 15.4684 3 13.9999C3 9.02931 7.02944 4.99988 12 4.99988C13.3231 4.99988 14.5795 5.28539 15.711 5.79817M12.7071 13.2929C12.3166 12.9024 11.6834 12.9024 11.2929 13.2929C10.9024 13.6834 10.9024 14.3166 11.2929 14.7071C11.6834 15.0976 12.3166 15.0976 12.7071 14.7071C13.0976 14.3166 13.0976 13.6834 12.7071 13.2929ZM12.7071 13.2929L19.0711 6.92893"
                          stroke="blue"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : speed === "medium" ? (
                        <path
                          d="M15 5.51215C18.4956 6.74766 21 10.0814 21 14C21 15.4685 20.6483 16.8549 20.0245 18.0794C19.7216 18.6741 19.0839 19 18.4165 19H5.58351C4.91613 19 4.27839 18.6741 3.97547 18.0794C3.3517 16.8549 3 15.4685 3 14C3 10.0814 5.50442 6.74766 9 5.51215M12 12.9999C11.4477 12.9999 11 13.4477 11 13.9999C11 14.5522 11.4477 14.9999 12 14.9999C12.5523 14.9999 13 14.5522 13 13.9999C13 13.4477 12.5523 12.9999 12 12.9999ZM12 12.9999V3.99994"
                          stroke="yellow"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <path
                          d="M3.83093 10.2178C3.29764 11.3677 3 12.6491 3 14C3 15.4685 3.3517 16.8548 3.97547 18.0794C4.27839 18.6741 4.91613 19 5.5835 19H18.4165C19.0839 19 19.7216 18.6741 20.0245 18.0794C20.6483 16.8548 21 15.4685 21 14C21 9.02944 16.9706 5 12 5C10.6769 5 9.42046 5.28551 8.28897 5.79829M11.2929 13.293C11.6834 12.9025 12.3166 12.9025 12.7071 13.293C13.0976 13.6835 13.0976 14.3167 12.7071 14.7072C12.3166 15.0978 11.6834 15.0978 11.2929 14.7072C10.9024 14.3167 10.9024 13.6835 11.2929 13.293ZM11.2929 13.293L4.92893 6.92905"
                          stroke="red"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* statistics */}
          <div className="w-full max-w-[320px] md:max-w-[420px] md:my-2 md:px-1 lg:px-2 md:py-1 rounded-lg md:bg-zinc-800 text-white absolute md:relative bottom-1 md:bottom-auto left-1/2 -translate-x-1/2 z-[300]">
            <span className="hidden md:block text-xs px-2 font-semibold text-white text-opacity-60 tracking-wide">
              Result
            </span>
            <div className="bg-zinc-950 md:bg-zinc-900 rounded-xl md:mt-1 py-2 md:py-0">
              <StatSection
                stats={[
                  {
                    name: "Scanned",
                    data: cellsScanned.toString(),
                  },
                  {
                    name: "Traveled",
                    data: cellsTraveled.toString(),
                  },
                  {
                    name: "Time",
                    data: `${timeTaken?.toFixed(2)}ms`,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      {/* grid div */}
      <div
        className="w-full px-2 absolute md:relative top-[30px] z-[100] md:w-4/6"
        style={{ height: `calc(100vh - 60px)` }}
      >
        <div className="h-full w-full">
          {/* know more */}
          {selectedAlgo ? (
            <div className="absolute z-[80]">
              <button
                className="bg-indigo-500 text-white text-xs underline px-2 py-1"
                onClick={() => {
                  setShowInfoOf(selectedAlgo.type);
                }}
              >
                Know more
                <FaArrowRight className="h-3 w-3 ml-1 font-bold inline-block" />
              </button>
            </div>
          ) : null}
          {/* grid */}
          <div className="grid grid-cols-gridmap overflow-auto w-full h-full">
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
      </div>
    </div>
  );
};

export default Main;
