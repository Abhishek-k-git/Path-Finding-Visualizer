export enum algorithm {
  DIJKSTRA = "DIJKSTRA",
  BFS = "BFS",
  DFS = "DFS",
}

export interface cellInterface {
  cellNumber: number;
  row: number;
  col: number;
  isVisited: boolean;
  isWall: boolean;
  isStartPoint: boolean;
  isEndPoint: boolean;
  distance: number;
  previousCell: cellInterface | null;
  isTarget?: boolean;
}

export interface optionInterface {
  name: string;
  type: algorithm;
  onClick: () => void;
}

export interface props {
  algo: algorithm | null;
  onClose: () => void;
}
