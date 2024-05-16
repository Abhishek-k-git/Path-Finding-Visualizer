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
          <p className="mt-2">
            <strong>Dijkstra's algorithm</strong> is an algorithm for finding
            the shortest paths between nodes in a weighted graph, which may
            represent, for example, road networks. It was conceived by computer
            scientist <strong>Edsger W. Dijkstra</strong> in{" "}
            <strong>1956</strong> and published three years later. It picks the
            unvisited vertex with the lowest distance, calculates the distance
            through it to each unvisited neighbor, and updates the neighbor's
            distance if smaller. Mark visited (set to green) when done with
            neighbors.
          </p>
        ),
        guaranteedShortedPath: true,
        referenceLink: `https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm`,
        gif: `/assets/dijkstra.gif`,
      };
    case algorithm.BFS:
      return {
        title: "Breadth-first Search algorithm",
        description: (
          <div>
            <p className="mt-2">
              A standard <strong>BFS</strong> implementation puts each vertex of
              the graph into one of two categories:
            </p>
            <ul className="px-8 py-2 list-outside">
              <li className="list-disc">Visited</li>
              <li className="list-disc">Not Visited</li>
            </ul>
            <p className="mt-2">
              The purpose of the algorithm is to mark each vertex as visited
              while avoiding cycles. The algorithm works as follows:
            </p>
            <ul className="px-8 py-2 list-outside">
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
            <p className="mt-2">
              The graph might have two different disconnected parts so to make
              sure that we cover every vertex, we can also run the BFS algorithm
              on every node
            </p>
          </div>
        ),
        guaranteedShortedPath: true,
        referenceLink: `https://en.wikipedia.org/wiki/Breadth-first_search`,
        gif: `/assets/bfs.gif`,
      };
    case algorithm.DFS:
      return {
        title: "Depth-first Search algorithm",
        description: (
          <div>
            <p className="mt-2">
              <strong>Depth first Search</strong> is a recursive algorithm for
              searching all the vertices of a graph or tree data structure.
              Traversal means visiting all the nodes of a graph.
            </p>
            <p className="mt-2">
              A standard <strong>DFS</strong> implementation puts each vertex of
              the graph into one of two categories:
            </p>
            <ul className="px-8 py-2 list-outside">
              <li className="list-disc">Visited</li>
              <li className="list-disc">Not Visited</li>
            </ul>
            <p className="mt-2">
              The purpose of the algorithm is to mark each vertex as visited
              while avoiding cycles. The algorithm works as follows:
            </p>
            <ul className="px-8 py-2 list-outside">
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
          </div>
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
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-65 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-8">
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
                      {/* menu top items */}
                      <div className="flex items-start justify-between text-zinc-500">
                        <h2
                          id="slide-over-heading"
                          className="text-lg font-medium"
                        >
                          About algorithm
                        </h2>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="hover:text-black"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <IoClose className="h-8 w-8" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* content */}
                    <div>
                      {/* image */}
                      <div className="w-full flex items-center justify-center">
                        <img className="w-3/5 h-auto" src={info.gif} alt="" />
                      </div>
                      {/* title */}
                      <h1 className="text-xl font-bold text-black px-6 py-4">
                        {info.title}
                      </h1>
                      {/* details */}
                      <dl className="text-sm text-black px-6">
                        <dt className="text-zinc-500">Summary</dt>
                        <dd>{info?.description}</dd>
                      </dl>
                      {/* others */}
                      <div className="px-6 py-4 text-sm">
                        <span className="text-zinc-800">Shortest path</span>
                        <span
                          className={classNames(
                            info.guaranteedShortedPath
                              ? "bg-green-500"
                              : "bg-red-500",
                            "inline-block px-4 py-1 mx-4 font-semibold rounded-full text-white"
                          )}
                        >
                          {info?.guaranteedShortedPath
                            ? "Guaranteed"
                            : "Not guaranteed"}
                        </span>
                      </div>
                      <div className="px-6 mb-8 text-sm flex gap-2 items-center">
                        <span className="text-zinc-800">Read more</span>
                        <a
                          href={info.referenceLink}
                          target="__blank"
                          className="text-orange-500 inline-flex items-center font-medium underline mt-1 text-sm sm:col-span-2"
                        >
                          <FaLink className="h-4 w-4" />
                          webpage url
                        </a>
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
