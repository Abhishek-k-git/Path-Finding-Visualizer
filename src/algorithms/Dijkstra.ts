import { cellInterface } from "../interfaces/index.ts";
import { getCells } from "../utilities/index.ts";

const getNeighbors = (currentCell: cellInterface, grid: cellInterface[][]) => {
  const neighbors: cellInterface[] = [];
  const { col, row } = currentCell;

  if (col > 0) neighbors.push(grid[row][col - 1]);

  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  if (row > 0) neighbors.push(grid[row - 1][col]);

  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);

  return neighbors.filter((n) => !n?.isVisited);
};

const traverseFurtherInGrid = (
  currentCell: cellInterface,
  grid: cellInterface[][]
) => {
  let remainingNeighbors = getNeighbors(currentCell, grid);
  for (let cell of remainingNeighbors) {
    cell.distance = currentCell.distance + 1;
    cell.previousCell = currentCell;
  }
};

export const Dijkstra = (
  grid: cellInterface[][],
  startCell: cellInterface,
  endCell: cellInterface
) => {
  let startTime = Date.now();
  let endTime;
  let unvisitedCells = getCells(grid); // clone
  startCell.distance = 0;
  let visitedCells: cellInterface[] = [];
  while (!!unvisitedCells.length) {
    unvisitedCells.sort((cellA, cellB) => cellA.distance - cellB.distance);
    let currentCell = unvisitedCells.shift(); // remove 1st cell

    if (!currentCell) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime] as const;
    }
    if (currentCell?.isWall) continue; // ignore walls
    if (currentCell?.distance === Infinity) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime] as const;
    } // the walls are closed
    currentCell.isVisited = true;
    visitedCells.push(currentCell);
    if (currentCell.cellNumber === endCell.cellNumber) {
      currentCell.isTarget = true;
      endTime = Date.now();
      return [visitedCells, endTime - startTime] as const;
    }
    traverseFurtherInGrid(currentCell, grid);
  }
};
