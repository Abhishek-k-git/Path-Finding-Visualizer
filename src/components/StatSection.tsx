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
    <ul
      role="list"
      className="w-full flex flex-row items-center justify-evenly gap-2"
    >
      {stats.map((stat) => (
        <li
          key={stat.name}
          className="h-[56px] md:h-[64px] w-1/3 rounded-3xl md:rounded-2xl aspect-square flex flex-col items-center justify-center bg-zinc-100"
        >
          <p className="text-xs text-zinc-500 capitalize">{stat.name}</p>
          <p className="text-md md:text-lg lg:text-xl text-black">
            {stat.data}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default StatSection;
