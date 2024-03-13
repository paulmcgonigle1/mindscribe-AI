import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { format } from "date-fns";

import { useState, useContext, Fragment } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import AuthContext from "../../../context/AuthContext";
import { Insight, JournalEntry } from "../../../lib/types/types";
import { getInsightForJournalEntry } from "../../../services/JournalService";
import ModalComponent from "./ModalComponent";

export function DayInsights({ entry }: { entry: JournalEntry }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insight, setInsight] = useState<Insight | null>(null);
  const authContext = useContext(AuthContext);

  function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(" ");
  }

  //use service to get insight for selectedEntry

  const fetchAndSetInsight = async (entryId: number) => {
    if (authContext?.authTokens?.access) {
      try {
        const insights = await getInsightForJournalEntry(
          { access: authContext.authTokens.access },
          entryId
        );
        // If insights are returned as an array and you want the first one:
        if (insights.length > 0) {
          setInsight(insights[0]);
        } else {
          // Handle the case where there are no insights
          console.log(`No insights found for entry ID: ${entryId}`);
          setInsight(null); // Or however you want to handle this case
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    } else {
      console.log("Authentication tokens are not available.");
    }
  };
  //handles click on the entry to get insights for that entry
  const handleEntryClick = (entry: JournalEntry) => {
    fetchAndSetInsight(entry.entryID);
    setIsModalOpen(true);
    console.log(
      "Entry " + entry.entryID + " clicked" + entry.content.slice(0, 10)
    );
  };
  //close modal
  const handleCloseModal = (event: any) => {
    event.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <li
      onClick={() => handleEntryClick(entry)}
      className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100"
    >
      <div className="flex-auto">
        <p className="text-gray-900">Journal Entry: {entry.entryID}</p>
        <p className="mt-0.5">
          <time dateTime={new Date(entry.timestamp).toISOString()}>
            {format(new Date(entry.timestamp), "h:mm a")}
          </time>{" "}
          \n - {entry.content}
        </p>
        {insight && (
          <ModalComponent
            insight={insight}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>

      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <BsThreeDotsVertical className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}
