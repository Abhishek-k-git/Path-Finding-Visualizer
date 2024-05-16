import React, { HTMLAttributes } from "react";
import { cellInterface } from "../interfaces/index.ts";

import { RiMapPin5Line } from "react-icons/ri";
import { AiOutlineTrophy } from "react-icons/ai";

const Cell: React.FC<cellInterface & HTMLAttributes<HTMLDivElement>> = ({
  cellNumber,
  row,
  col,
  isVisited,
  isWall,
  isStartPoint,
  isEndPoint,
  distance,
  previousCell,
  isTarget,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`cell w-8 inline-flex justify-center items-center aspect-square border border-dashed border-zinc-200 ${
        isStartPoint
          ? "!bg-orange-400 rounded-full border-none animate-pulse text-white"
          : ""
      } ${
        isEndPoint
          ? "!bg-red-600 rounded-full animate-bounce border-none text-white"
          : ""
      } ${isWall ? "!bg-zinc-400 wall-animate border-none" : ""}`}
    >
      {isStartPoint ? (
        <RiMapPin5Line className="h-4 w-4" />
      ) : isEndPoint ? (
        <AiOutlineTrophy className="h-4 w-4" />
      ) : null}
    </div>
  );
};

export default Cell;
