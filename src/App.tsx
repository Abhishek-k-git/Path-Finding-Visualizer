import React, { useEffect, useRef, useState } from "react";
import {
  algorithm,
  cellInterface,
  optionInterface,
} from "./interfaces/index.ts";
import { getCellObj, getPath } from "./utilities/index.ts";
import Cell from "./components/Cell.tsx";
import { SideOver } from "./components/SideOver.tsx";
import StatSection from "./components/StatSection.tsx";
import Select from "./components/Select.tsx";
import {
  generateRandomMaze,
  generateRecursiveMaze,
} from "./utilities/index.ts";
import { classNames } from "./utilities/index.ts";

import { BFS } from "./algorithms/BFS.ts";
import { DFS } from "./algorithms/DFS.ts";
import { Dijkstra } from "./algorithms/Dijkstra.ts";

import { MdCancelScheduleSend } from "react-icons/md";
import {
  GiMaze,
  GiPerspectiveDiceSixFacesRandom,
  GiPathDistance,
} from "react-icons/gi";
import { FaChessBoard } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { AiOutlineSliders } from "react-icons/ai";

const App = () => {
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
  const [mazeOption, setMazeOption] = useState(0);

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
    setMazeOption(0);
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
        let [DCells, DTime] = Dijkstra(grid, start, end) || [];
        visitedCells = DCells || [];
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
    <div className="w-full max-w-6xl h-full flex flex-col md:flex-row mx-auto items-center justify-center md:pt-6 lg:p-6 bg-white">
      <SideOver
        algo={showInfoOf}
        onClose={() => {
          setShowInfoOf(null);
        }}
      />

      {/* left div / option panel */}
      <div className="left-div h-full text-sm">
        <div className="w-full h-full md:pr-4 md:flex md:flex-col">
          {/* select algorithm */}
          <div className="z-[30] h-[64px] w-[95%] md:w-full max-w-xl fixed bottom-4 left-1/2 -translate-x-1/2 md:relative md:bottom-0 flex flex-row p-2 gap-1 rounded-full shadow-xl md:shadow-none shadow-zinc-300 bg-white md:bg-zinc-100 text-black">
            <div className="h-[48px] px-4 bg-zinc-100 md:bg-white rounded-full flex-grow items-center">
              <Select selectedAlgo={selectedAlgo} onSelect={setSelectedAlgo} />
            </div>
            <button
              disabled={!selectedAlgo}
              onClick={() =>
                selectedAlgo ? visualizeAlgo(selectedAlgo?.type) : null
              }
              className={classNames(
                selectedAlgo ? "shadow" : "",
                "w-[48px] h-[48px] flex items-center justify-center rounded-full bg-orange-400 text-orange-100 disabled:bg-white disabled:text-black disabled:cursor-not-allowed"
              )}
            >
              {selectedAlgo ? (
                <IoSend className="w-4 h-4" />
              ) : (
                <MdCancelScheduleSend className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="overflow-auto md:border md:border-zinc-100 shadow-sm rounded-3xl md:px-2 md:py-4 md:my-4">
            {/* speed */}
            <div className="md:w-full">
              <div
                onClick={() => {
                  setSpeed(
                    speed === "fast"
                      ? "medium"
                      : speed === "medium"
                      ? "slow"
                      : "fast"
                  );
                }}
                className="md:w-full cursor-pointer z-[20] fixed bottom-[104px] left-4 md:relative md:bottom-0 md:left-0"
              >
                {/* for larger devices */}
                <div className="hidden md:overflow-hidden md:relative w-full md:flex flex-row items-center justify-center gap-2 border border-orange-200 text-orange-500 px-2 py-3 rounded-3xl disabled:text-opacity-75 disabled:cursor-not-allowed">
                  <span className="flex items-center justify-center gap-2">
                    <AiOutlineSliders className="w-4 h-4" />
                    <span>Speed:</span>
                  </span>
                  <span className="font-semibold">{speed}</span>
                  <span
                    className={classNames(
                      speed === "fast"
                        ? "w-full"
                        : speed === "medium"
                        ? "w-2/3"
                        : "w-1/3",
                      "md:absolute top-0 left-0 h-full bg-orange-400 bg-opacity-15"
                    )}
                  ></span>
                </div>
                {/* for smaller devices */}
                <span className="flex items-center justify-center md:hidden w-14 h-14 bg-orange-400 rounded-full">
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
              </div>
            </div>

            {/* clear options */}
            <div className="w-full font-semibold">
              <p className="p-2 mt-4 text-zinc-500 hidden md:block">
                Clear options
              </p>
              <div className="z-20 text-white md:text-orange-400 fixed top-[88px] md:top-0 left-4 sm:left-1/2 md:left-0 sm:-translate-x-1/2 md:translate-x-0 md:relative flex flex-row items-center justify-center gap-8 md:gap-2">
                {/* clear board */}
                <div
                  className="md:w-1/2 md:gap-2 select-none flex flex-col items-center justify-center border-0 md:border-2 border-orange-300 rounded-lg cursor-pointer md:p-4"
                  onClick={() => {
                    clearBoard();
                    setRenderFlag(!renderFlag);
                  }}
                >
                  <span className="w-8 h-8 bg-orange-500 rounded-full p-3 box-content md:box-border md:bg-transparent md:w-full md:h-full">
                    <FaChessBoard className="w-full h-full" />
                  </span>
                  <span className="hidden md:block">Clear board</span>
                </div>
                {/* clear path */}
                <div
                  className="md:w-1/2 md:gap-2 select-none flex flex-col items-center justify-center border-0 md:border-2 border-orange-300 rounded-lg cursor-pointer md:p-4"
                  onClick={() => {
                    clearPath();
                  }}
                >
                  <span className="w-8 h-8 bg-orange-500 rounded-full p-3 box-content md:box-border md:bg-transparent md:w-full md:h-full">
                    <GiPathDistance className="w-full h-full" />
                  </span>
                  <span className="hidden md:block">Clear path</span>
                </div>
              </div>
            </div>

            {/* generate maze */}
            <div className="w-full font-semibold">
              <p className="p-2 mt-4 text-zinc-500 hidden md:block">
                Generate maze
              </p>
              <div className="flex flex-row w-full items-center justify-center gap-8 md:gap-2">
                {/* random maze */}
                <div
                  className={classNames(
                    mazeOption == 1
                      ? "text-orange-400 border-orange-300"
                      : "text-zinc-400 border-zinc-300",
                    "z-[20] fixed bottom-[172px] left-0 md:relative md:bottom-0 md:w-1/2 select-none flex flex-col items-center justify-center border-0 md:border-2 rounded-lg cursor-pointer p-4"
                  )}
                  onClick={() => {
                    setMazeOption(1);
                    setRenderFlag(!renderFlag);
                    clearBoard();
                    setMazeOption(1);
                    generateRandomMaze(gridBoardCells.current);
                  }}
                >
                  <span className="w-10 h-10 bg-black rounded-full p-2 box-content md:box-border md:bg-transparent md:w-full md:h-full">
                    <GiPerspectiveDiceSixFacesRandom className="w-full h-full" />
                  </span>
                  <span className="text-sm font-semibold hidden md:block">
                    Random Maze
                  </span>
                </div>
                {/* recursive Maze */}
                <div
                  className={classNames(
                    mazeOption == 2
                      ? "text-orange-500 border-orange-400"
                      : "text-zinc-400 border-zinc-300",
                    "z-[20] fixed bottom-[254px] left-0 md:relative md:bottom-0 md:w-1/2 select-none flex flex-col items-center justify-center border-0 md:border-2 rounded-lg cursor-pointer p-4"
                  )}
                  onClick={() => {
                    setRenderFlag(!renderFlag);
                    clearBoard();
                    setMazeOption(2);
                    generateRecursiveMaze(
                      gridBoardCells.current,
                      startPoint,
                      endPoint
                    );
                  }}
                >
                  <span className="w-10 h-10 bg-black rounded-full p-2 box-content md:box-border md:bg-transparent md:w-full md:h-full">
                    <GiMaze className="w-full h-full" />
                  </span>
                  <span className="text-sm font-semibold hidden md:block">
                    Recursive Maze
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* right div / grid div */}
      <div className="right-div h-full relative bg-zinc-100 md:rounded-3xl overflow-hidden">
        <div className="h-full w-full overflow-auto py-12">
          {/* know more */}
          {selectedAlgo ? (
            <div className="fixed md:absolute z-[40] select-none top-[88px] md:top-[96px] right-4">
              <button
                className="bg-black text-white font-semibold text-xs py-2 px-4 rounded-full"
                onClick={() => {
                  setShowInfoOf(selectedAlgo.type);
                }}
              >
                Know more
              </button>
            </div>
          ) : null}

          {/* statistical data */}
          <div className="z-[30] w-[95%] md:w-full max-w-xl h-[72px] md:h-[80px] fixed md:absolute top-2 left-1/2 -translate-x-1/2 rounded-3xl flex flex-row p-2 shadow-xl shadow-zinc-300 bg-white text-black">
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

          {/* grid */}
          <div className="grid grid-cols-gridmap w-full h-full">
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

export default App;
