import React from "react";

const StatSection: React.FC<{
  stats: {
    name: string;
    // icon: (
    //   props: React.ComponentProps<"svg"> & {
    //     title?: string;
    //     titleId?: string;
    //   }
    // ) => JSX.Element;
    data: string;
  }[];
}> = ({ stats }) => {
  return (
    <ul role="list" className="flex flex-row items-center justify-evenly">
      {stats.map((stat) => (
        <li
          key={stat.name}
          className="text-xs gap-1 p-2 flex flex-col items-center justify-center"
        >
          <span>{stat.name}</span>
          <span className="text-xs text-indigo-500">{stat.data}</span>
        </li>
      ))}
    </ul>
  );
};

export default StatSection;
