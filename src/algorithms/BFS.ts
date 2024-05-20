import { cellInterface } from "../interfaces/index.ts";

// Visit your neighbors
export function BFS(
  grid: cellInterface[][],
  startCell: cellInterface,
  endCell: cellInterface
): [cellInterface[], number] {
  let startTime = Date.now();
  let endTime;

  let unvisitedCellsQueue: cellInterface[] = [startCell]; // FIFO queue
  let visitedCells: cellInterface[] = [];

  startCell.isVisited = true;

  while (unvisitedCellsQueue.length > 0) {
    let currentCell = unvisitedCellsQueue.pop();

    if (!currentCell) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    const { col, row, cellNumber, isVisited } = currentCell;

    if (cellNumber !== startCell.cellNumber && isVisited) continue;

    visitedCells.push(currentCell);

    if (cellNumber === endCell.cellNumber) {
      currentCell.isTarget = true;
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    if (
      // right
      col + 1 < grid[0].length &&
      !grid[row][col + 1].isWall &&
      !grid[row][col + 1].isVisited
    ) {
      grid[row][col + 1].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row][col + 1]);
      currentCell.isVisited = true;
    }

    if (
      // top
      row - 1 >= 0 &&
      !grid[row - 1][col].isWall &&
      !grid[row - 1][col].isVisited
    ) {
      grid[row - 1][col].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row - 1][col]);
      currentCell.isVisited = true;
    }

    if (
      // bottom
      row + 1 < grid.length &&
      !grid[row + 1][col].isWall &&
      !grid[row + 1][col].isVisited
    ) {
      grid[row + 1][col].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row + 1][col]);
      currentCell.isVisited = true;
    }

    if (
      // left
      col - 1 >= 0 &&
      !grid[row][col - 1].isWall &&
      !grid[row][col - 1].isVisited
    ) {
      grid[row][col - 1].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row][col - 1]);
      currentCell.isVisited = true;
    }
  }
  endTime = Date.now();
  return [visitedCells, endTime - startTime];
}
