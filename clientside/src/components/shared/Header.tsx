import React, { Fragment, useContext } from "react";
import {
  HiOutlineBell,
  HiOutlineChatAlt,
  HiOutlineSearch,
  HiChevronDoubleDown,
} from "react-icons/hi";
import { Popover, Transition, Menu } from "@headlessui/react";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import TrackTasks from "../pages/trackTasksPage/TrackTasks";
useNavigate;
export default function Header() {
  let { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 h-16 px-4 flex justify-between items-center border-b border-gray-200">
      {/* //this is the popover for tracking tasks in our website*/}
      <div className=" w-full max-w-sm px-4">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
                ${open ? "text-black" : "text-black/90"}
                group justify-items-end inline-flex items-center rounded-md bg-warm-orange px-3 py-2 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
              >
                <span>Track Tasks</span>
                <HiChevronDoubleDown
                  className={`${open ? "text-white-300" : "text-white-300/70"}
                  ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-blue-300/80`}
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                  {/* this is where my track tasks are being displayed */}
                  <div className="bg-gray-50 overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                    <TrackTasks />
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>

      <div className="flex items-center gap-2 mr-2">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-100",
                  "p-1.5 rounded inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                )}
              >
                <HiOutlineChatAlt fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">
                      Messages
                    </strong>
                    <div className="mt-2 py-1 text-sm">
                      This is messages pannel
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-100",
                  "p-1.5 rounded inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                )}
              >
                <HiOutlineBell fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">
                      Notifications
                    </strong>
                    <div className="mt-2 py-1 text-sm">
                      This is notifications pannel
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Menu
          as="div"
          className="relative inline-block text-left rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <div>
            <Menu.Button className="ml-2 inline-flex">
              <span className="sr-only">Open User Menu</span>
              <div
                className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage:
                    'url("https://source.unsplash.com/80x80?face")',
                }}
              >
                <span className="sr-only">Hugh Jackson</span>
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            {/* Mark this component as `static` */}
            <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-40 rounded-sm shadow-sm p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active && "bg-gray-100",
                      "text-gray-700 focus:bg-gray-200 cursor-pointer rounded-sm  ring-opacity-5 px-4 py-2"
                    )}
                    onClick={() => navigate("/profile")}
                  >
                    Your Profile
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => navigate("/settings")}>
                    Settings
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <div>{user && <p>Hello, {user.username}</p>}</div>
      </div>
    </div>
  );
}
