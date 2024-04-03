import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { algorithm, props } from "../interfaces/index.ts";
import { classNames } from "../utilities/index.ts";

import { IoClose } from "react-icons/io5";
import { FaLink } from "react-icons/fa6";

const getAlgoInfo = (type: algorithm | null) => {
  switch (type) {
    case algorithm.DIJKSTRA:
      return {
        title: "Dijkstra's algorithm",
        description: (
          <>
            <strong>Dijkstra's algorithm</strong> is an algorithm for finding
            the shortest paths between nodes in a weighted graph, which may
            represent, for example, road networks. It was conceived by computer
            scientist <strong>Edsger W. Dijkstra</strong> in{" "}
            <strong>1956</strong> and published three years later. It picks the
            unvisited vertex with the lowest distance, calculates the distance
            through it to each unvisited neighbor, and updates the neighbor's
            distance if smaller. Mark visited (set to green) when done with
            neighbors.
          </>
        ),
        guaranteedShortedPath: true,
        referenceLink: `https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm`,
        gif: `/assets/dijkstra.gif`,
      };
    case algorithm.BFS:
      return {
        title: "Breadth-first Search algorithm",
        description: (
          <>
            A standard <strong>BFS</strong> implementation puts each vertex of
            the graph into one of two categories: <br />
            <ul className="m-2 ml-6">
              <li className="list-disc">Visited</li>
              <li className="list-disc">Not Visited</li>
            </ul>
            <br />
            The purpose of the algorithm is to mark each vertex as visited while
            avoiding cycles. The algorithm works as follows: <br />
            <ul className="ml-6 mt-2">
              <li className="list-decimal">
                Start by putting any one of the graph's vertices at the back of
                a queue.
              </li>
              <li className="list-decimal">
                Take the front item of the queue and add it to the visited list.
              </li>
              <li className="list-decimal">
                Create a list of that vertex's adjacent nodes. Add the ones
                which aren't in the visited list to the back of the queue.
              </li>
              <li className="list-decimal">
                Keep repeating steps 2 and 3 until the queue is empty.
              </li>
            </ul>
            <br />
            The graph might have two different disconnected parts so to make
            sure that we cover every vertex, we can also run the BFS algorithm
            on every node
          </>
        ),
        guaranteedShortedPath: true,
        referenceLink: `https://en.wikipedia.org/wiki/Breadth-first_search`,
        gif: `/assets/bfs.gif`,
      };
    case algorithm.DFS:
      return {
        title: "Depth-first Search algorithm",
        description: (
          <>
            <strong>Depth first Search</strong> is a recursive algorithm for
            searching all the vertices of a graph or tree data structure.
            Traversal means visiting all the nodes of a graph. <br /> A standard{" "}
            <strong>DFS</strong> implementation puts each vertex of the graph
            into one of two categories: <br />
            <ul className="m-2 ml-6">
              <li className="list-disc">Visited</li>
              <li className="list-disc">Not Visited</li>
            </ul>
            <br />
            The purpose of the algorithm is to mark each vertex as visited while
            avoiding cycles. The algorithm works as follows: <br />
            <ul className="ml-6 mt-2">
              <li className="list-decimal">
                Start by putting any one of the graph's vertices on top of a
                stack.
              </li>
              <li className="list-decimal">
                Take the top item of the stack and add it to the visited list.
              </li>
              <li className="list-decimal">
                Create a list of that vertex's adjacent nodes. Add the ones
                which aren't in the visited list to the top of the stack.
              </li>
              <li className="list-decimal">
                Keep repeating steps 2 and 3 until the stack is empty.
              </li>
            </ul>
          </>
        ),
        guaranteedShortedPath: false,
        referenceLink: `https://en.wikipedia.org/wiki/Depth-first_search`,
        gif: `/assets/dfs.gif`,
      };
    default:
      return null;
  }
};

export const SideOver: React.FC<props> = ({ algo, onClose }) => {
  const [info, setInfo] = useState<ReturnType<typeof getAlgoInfo>>(null);

  useEffect(() => {
    let algorithmInfo = getAlgoInfo(algo);
    setInfo(algorithmInfo);
  }, [algo]);

  if (!algo || !info) return null;

  return (
    <Transition.Root show={!!algorithm} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-30 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2
                          id="slide-over-heading"
                          className="text-lg font-medium text-gray-900"
                        >
                          About algorithm
                        </h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <IoClose className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div>
                      <div className="pb-1 sm:pb-6">
                        <div>
                          <div className="relative h-40 sm:h-56">
                            <img
                              className="absolute h-full w-full object-contain"
                              src={info.gif}
                              alt=""
                            />
                          </div>
                          <div className="mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6">
                            <div className="sm:flex-1">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                    {info?.title}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pt-5 pb-5 sm:px-0 sm:pt-0">
                        <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                              Summary
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p>{info?.description}</p>
                            </dd>
                          </div>
                          <div>
                            <p className="block text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                              Shortest path
                            </p>
                            <span
                              className={classNames(
                                info.guaranteedShortedPath
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800",
                                "inline-flex mt-2 items-center rounded-full px-3.5 py-1.5 text-xs font-medium"
                              )}
                            >
                              {info?.guaranteedShortedPath
                                ? "Guaranteed"
                                : "Not guaranteed"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                              Website
                            </p>
                            <a
                              href={info.referenceLink}
                              target="__blank"
                              className="text-indigo-700 inline-flex items-center font-medium underline mt-1 text-sm sm:col-span-2"
                            >
                              <FaLink className="h-4 w-4 mr-2" /> reference link
                            </a>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
