import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { algorithm, optionInterface } from "../interfaces/index.ts";
import { classNames } from "../utilities/index.ts";

import { FaCheck } from "react-icons/fa6";
import { LuChevronsUpDown } from "react-icons/lu";

const Select: React.FC<{
  selectedAlgo: optionInterface | null;
  onSelect: (algo: optionInterface) => void;
}> = ({ selectedAlgo, onSelect }) => {
  return (
    <Listbox
      value={selectedAlgo}
      onChange={(value) => {
        if (!value) return;
        onSelect(value);
      }}
    >
      {({ open }) => (
        <>
          <div className="text-sm h-full flex items-center text-black">
            <Listbox.Button className="relative flex items-center justify-between w-full p-2 cursor-pointer focus:outline-none">
              <span className="block truncate">
                {selectedAlgo?.name || "Select Algorithm"}
              </span>
              <span>
                <LuChevronsUpDown className="h-4 w-4" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in-out duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute left-1/2 -translate-x-1/2 -top-[300%] md:top-full max-h-60 w-full overflow-auto rounded-3xl bg-white px-2 py-4 shadow-lg">
                {[
                  {
                    name: "Dijkstra's algorithm",
                    type: algorithm.DIJKSTRA,
                  },
                  {
                    name: "Breadth-first Search",
                    type: algorithm.BFS,
                  },
                  {
                    name: "Depth-first Search",
                    type: algorithm.DFS,
                  },
                ].map((algo) => (
                  <Listbox.Option
                    key={algo.type}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-zinc-100" : "",
                        "cursor-default select-none py-2 my-1 rounded-2xl w-full flex flex-row items-center justify-center gap-2"
                      )
                    }
                    value={algo}
                  >
                    {({ active }) => (
                      <>
                        <span
                          className={classNames(
                            algo.type === selectedAlgo?.type
                              ? "font-semibold"
                              : "font-normal",
                            "block truncate"
                          )}
                        >
                          {algo.name}
                        </span>

                        {algo.type === selectedAlgo?.type ? (
                          <span
                            className={classNames(
                              active ? "text-black" : "text-orange-400",
                              ""
                            )}
                          >
                            <FaCheck className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default Select;
