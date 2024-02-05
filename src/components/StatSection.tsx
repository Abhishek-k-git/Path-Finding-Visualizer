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
    <ul role="list" className="flex flex-wrap gap-2">
      {stats.map((stat) => (
        <li
          key={stat.name}
          className="text-xs p-2 bg-indigo-500 text-white rounded-full flex flex-row items-center gap-2"
        >
          <span>{stat.name}</span>
          <span className="text-xs px-2 rounded-full bg-indigo-100 text-indigo-700">
            {stat.data}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default StatSection;
