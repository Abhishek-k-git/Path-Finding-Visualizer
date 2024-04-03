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
          <div className="relative z-[600]">
            <Listbox.Button className="relative text-sm flex items-center justify-between w-full px-2 py-2 cursor-default focus:outline-none">
              <span
                className={classNames(
                  selectedAlgo ? "text-white" : "text-indigo-50",
                  "block truncate text-xs"
                )}
              >
                {selectedAlgo?.name || "Choose an algorithm"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <LuChevronsUpDown
                  className={classNames(
                    selectedAlgo ? "text-white" : "text-indigo-50",
                    "h-4 w-4"
                  )}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute left-1/2 top-full -translate-x-1/2 text-sm max-h-60 w-full overflow-auto rounded-lg bg-white px-2 py-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                        active ? "text-white bg-indigo-500" : "text-gray-600",
                        "relative cursor-default select-none py-2 rounded-md w-full flex flex-row items-center justify-center gap-2"
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
                              active ? "text-white" : "text-indigo-500",
                              ""
                            )}
                          >
                            <FaCheck className="h-3 w-3" aria-hidden="true" />
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
