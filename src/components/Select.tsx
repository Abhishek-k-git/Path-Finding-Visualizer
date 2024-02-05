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
          <div className="relative md:ml-0 flex min-w-[250px] justify-start items-center gap-4 text-xs lg:text-sm">
            <Listbox.Button className="relative w-full cursor-default border-b-[1px] border-b-gray-900 bg-gray-900 py-2 pl-3 pr-4 text-left shadow-sm focus:outline-none">
              <span
                className={classNames(
                  selectedAlgo ? "text-white" : "text-gray-400",
                  "block truncate"
                )}
              >
                {selectedAlgo?.name || "Select an algorithm"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <LuChevronsUpDown
                  className="h-4 w-4 text-gray-400"
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
              <Listbox.Options className="absolute top-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
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
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <FaCheck className="h-5 w-5" aria-hidden="true" />
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
