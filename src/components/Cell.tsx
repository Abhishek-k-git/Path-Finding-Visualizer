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
      className={`cell lg:w-5 w-4 inline-flex justify-center items-center aspect-square border-[0.1px] border-dotted border-zinc-600 ${
        isStartPoint ? "!bg-green-500 text-green-50" : ""
      } ${isEndPoint ? "!bg-indigo-500 text-indigo-50" : ""} ${
        isWall ? "!bg-zinc-950 !bg-opacity-50 wall-animate" : ""
      }`}
    >
      {isStartPoint ? (
        <RiMapPin5Line className="h-4 w-4 font-bold" />
      ) : isEndPoint ? (
        <AiOutlineTrophy className="h-4 w-4 font-bold" />
      ) : null}
    </div>
  );
};

export default Cell;
