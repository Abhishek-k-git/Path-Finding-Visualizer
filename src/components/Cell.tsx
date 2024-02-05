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
      className={`cell lg:w-6 w-4 lg:h-6 h-4 inline-flex justify-center items-center aspect-square border-[0.1px] border-dashed border-indigo-500 ${
        isStartPoint ? "!bg-green-300" : ""
      } ${isEndPoint ? "!bg-gray-200" : ""} ${
        isWall ? "!bg-gray-900 wall-animate" : ""
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
