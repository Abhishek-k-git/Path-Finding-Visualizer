import { cellInterface } from "../interfaces/index.ts";

export const initCell: cellInterface = {
  cellNumber: 0,
  row: 0,
  col: 0,
  isVisited: false,
  isWall: false,
  isStartPoint: false,
  isEndPoint: false,
  distance: Infinity,
  previousCell: null,
  isTarget: false,
};

export const getCellObj = (
  resetOnlyPath: boolean = false,
  resetOnlyWall: boolean = false,
  grid?: cellInterface[][]
): cellInterface[][] => {
  let gridCells: cellInterface[][] = grid || [];
  let cellNumber: number = 0;
  let rowNum: number = 30;
  let colNum: number = 52;

  for (let indRow = 0; indRow < rowNum; indRow++) {
    let currRow: cellInterface[] = [];
    for (let indCol = 0; indCol < colNum; indCol++) {
      if ((resetOnlyPath || resetOnlyWall) && grid) {
        grid[indRow][indCol].isVisited = false;
        if (resetOnlyWall) grid[indRow][indCol].isWall = false;
        grid[indRow][indCol].distance = Infinity;
        grid[indRow][indCol].isTarget = false;
        grid[indRow][indCol].previousCell = null;
      } else {
        currRow.push({ ...initCell, row: indRow, col: indCol, cellNumber });
      }

      cellNumber++;
    }

    if (!resetOnlyPath) {
      gridCells.push(currRow);
    }
  }

  return gridCells;
};

export const getCells = (grid: cellInterface[][]) => {
  let cellsArr: cellInterface[] = [];
  [...grid].forEach((row) => {
    row.forEach((cell) => {
      cellsArr.push(cell);
    });
  });
  return cellsArr;
};

export const getPath = (endPoint: cellInterface) => {
  let path = getShortestPathCells(endPoint) || [];
  return path;
};

export function getShortestPathCells(endPoint: cellInterface) {
  let pathCells = [];
  let currentCell: cellInterface | null = endPoint;
  while (currentCell) {
    pathCells.push(currentCell);
    currentCell = currentCell.previousCell;
  }
  return pathCells;
}

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const generateOddRand = (numArr: number[]) => {
  let max = numArr.length - 1;
  let randNum = Math.floor(Math.random() * (max / 2));

  if (randNum % 2 === 0) {
    if (randNum === max) randNum -= 1;
    else randNum += 1;
  }
  return numArr[randNum];
};

export const generateRandWithin = (maxVal: number) => {
  let randNum = Math.floor(Math.random() * (maxVal / 2));
  if (randNum % 2 !== 0) {
    if (randNum === maxVal) randNum -= 1;
    else randNum += 1;
  }
  return randNum;
};

export const generateRandomMaze = (grid: cellInterface[][]) => {
  let gridArr = getCells(grid);
  for (let indRow = 0; indRow < gridArr.length; indRow++) {
    let element = gridArr[indRow];
    if (element.isStartPoint || element.isEndPoint) continue;
    element.isWall = element.cellNumber % Math.ceil(Math.random() * 10) === 0;
  }
};

const addWalls = (
  grid: cellInterface[][],
  direction: "up-down" | "right-left",
  num: number,
  horizontal: number[],
  vertical: number[],
  startNode: cellInterface | null,
  finishNode: cellInterface | null
) => {
  let isStartFinish = false;
  let cellToBeWall = []; // keeping an array to add gaps once we push into it

  if (direction === "up-down") {
    if (vertical.length === 2) return;
    for (let cellRow of vertical) {
      if (
        (cellRow === startNode?.row && num === startNode?.col) ||
        (cellRow === finishNode?.row && num === finishNode?.col)
      ) {
        isStartFinish = true;
        continue;
      }
      cellToBeWall.push([cellRow, num]);
    }
  } else {
    if (horizontal.length === 2) return;
    for (let cellCol of horizontal) {
      if (
        (num === startNode?.row && cellCol === startNode?.col) ||
        (num === finishNode?.row && cellCol === finishNode?.col)
      ) {
        isStartFinish = true;
        continue;
      }
      cellToBeWall.push([num, cellCol]);
    }
  }
  if (!isStartFinish) {
    let rand = generateRandWithin(cellToBeWall.length);
    // Add gap into the wall
    cellToBeWall = [
      ...cellToBeWall.slice(0, rand),
      ...cellToBeWall.slice(rand + 1),
    ];
  }
  for (let wall of cellToBeWall) {
    grid[wall[0]][wall[1]].isWall = true;
  }
};

const setRecursiveWalls = (
  horizontal: number[],
  vertical: number[],
  grid: cellInterface[][],
  startNode: cellInterface | null,
  finishNode: cellInterface | null
) => {
  if (horizontal.length < 2 || vertical.length < 2) return; // stop recursion if we can't split further
  let direction: "up-down" | "right-left" = "up-down";
  let num: number = 0;
  if (horizontal.length > vertical.length) {
    direction = "up-down";
    num = generateOddRand(horizontal);
  }
  if (horizontal.length <= vertical.length) {
    direction = "right-left";
    num = generateOddRand(vertical);
  }

  // recursive part where the approach to
  // start vertical or horizontal is dependent on direction variable
  if (direction === "up-down") {
    addWalls(grid, direction, num, horizontal, vertical, startNode, finishNode);
    setRecursiveWalls(
      horizontal.slice(0, horizontal.indexOf(num)),
      vertical,
      grid,
      startNode,
      finishNode
    );
    setRecursiveWalls(
      horizontal.slice(horizontal.indexOf(num) + 1),
      vertical,
      grid,
      startNode,
      finishNode
    );
  } else {
    addWalls(grid, direction, num, horizontal, vertical, startNode, finishNode);
    setRecursiveWalls(
      horizontal,
      vertical.slice(0, vertical.indexOf(num)),
      grid,
      startNode,
      finishNode
    );
    setRecursiveWalls(
      horizontal,
      vertical.slice(vertical.indexOf(num) + 1),
      grid,
      startNode,
      finishNode
    );
  }
};

export const generateRecursiveMaze = (
  grid: cellInterface[][],
  startNode: cellInterface | null,
  finishNode: cellInterface | null
) => {
  let horizontal = Array(grid[0].length)
    .fill("_")
    .map((_, i) => i);
  let vertical = Array(grid.length)
    .fill("_")
    .map((_, i) => i);

  setRecursiveWalls(horizontal, vertical, grid, startNode, finishNode);
};
