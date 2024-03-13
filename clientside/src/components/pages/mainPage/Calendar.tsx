import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { JournalEntry } from "../../../lib/types/types";
import { getJournals } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";
import { DayInsights } from "./CalendarDayInsight";
function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState<Date | null>(null);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const authContext = useContext(AuthContext);

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  let selectedDayMeetings = selectedDay
    ? entries.filter((entry) => isSameDay(entry.timestamp, selectedDay as Date))
    : [];
  let colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
  ];

  useEffect(() => {
    const fetchEntries = async () => {
      if (authContext?.authTokens?.access) {
        try {
          const journals = await getJournals({
            access: authContext.authTokens.access,
          });

          setEntries(journals);
        } catch (error) {
          console.error("Error fetching entries:", error);
        }
      } else {
        console.log("Auth context or tokens are undefined/null");
      }
    };

    fetchEntries();
  }, []);

  interface CalendarHeaderProps {
    firstDayCurrentMonth: Date;
    previousMonth: () => void;
    nextMonth: () => void; // New callback function for resetting the journal state
  }
  const CalendarHeader = ({
    firstDayCurrentMonth,
    previousMonth,
    nextMonth,
  }: CalendarHeaderProps) => (
    <div className="flex items-center justify-between">
      <h2 className="flex-auto text-lg font-medium text-gray-900">
        {format(firstDayCurrentMonth, "MMMM yyyy")}
      </h2>
      <button
        type="button"
        onClick={previousMonth}
        className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700"
      >
        <span className="sr-only">Previous month</span>
        <FaChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        onClick={nextMonth}
        type="button"
        className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700"
      >
        <span className="sr-only">Next month</span>
        <FaChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );

  // WeekdayHeaders.tsx
  const WeekdayHeaders = () => (
    <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
      <div>S</div>
      <div>M</div>
      <div>T</div>
      <div>W</div>
      <div>T</div>
      <div>F</div>
      <div>S</div>
    </div>
  );
  interface DayGridProps {
    days: Date[];
    setSelectedDay: Dispatch<SetStateAction<Date | null>>;
    selectedDay: Date | null;
    entries: JournalEntry[];
  }

  // This is the day grid where you are able to select which day to see entries and insights for that day
  const DayGrid = ({
    days,
    setSelectedDay,
    selectedDay,
    entries,
  }: DayGridProps) => (
    <div className="grid grid-cols-7 mt-2 text-sm">
      {days.map((day, dayIdx) => (
        <div
          key={day.toString()}
          className={classNames(
            dayIdx === 0 && colStartClasses[getDay(day)],
            "py-1.5"
          )}
        >
          <button
            type="button"
            onClick={() => setSelectedDay(day)}
            className={classNames(
              "mx-auto flex h-8 w-8 items-center justify-center rounded-full py-1.5",
              dayIdx === 0 && colStartClasses[getDay(day)],
              isToday(day) && "text-red-500",
              isSameMonth(day, firstDayCurrentMonth)
                ? "text-gray-900"
                : "text-gray-400",
              !!selectedDay &&
                isEqual(day, selectedDay) &&
                "text-white bg-gray-900 font-semibold",
              !!selectedDay &&
                isEqual(day, selectedDay) &&
                isToday(day) &&
                "bg-red-500",
              !selectedDay && "hover:bg-gray-200",
              entries.some((entry) => isSameDay(entry.timestamp, day)) &&
                "bg-green-500 text-white"
            )}
          >
            <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
          </button>

          <div className="w-1 h-1 mx-auto mt-1">
            {entries.some((entry) => isSameDay(entry.timestamp, day)) && (
              <div className="w-1 h-1 rounded-full bg-sky-500"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  interface JournalEntriesProps {
    selectedDay: Date | null;
    selectedDayMeetings: JournalEntry[];
  }
  // JournalEntries.tsx
  const JournalEntries = ({
    selectedDay,
    selectedDayMeetings,
  }: JournalEntriesProps) => (
    <section className="mt-12 md:mt-0 md:pl-14">
      <h2 className="font-semibold text-gray-900">
        {selectedDay ? (
          <>
            Journal Entries for{" "}
            <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
              {format(selectedDay, "MMM dd, yyyy")}
            </time>
          </>
        ) : (
          "Select a day"
        )}
      </h2>
      <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
        {selectedDayMeetings.length > 0 ? (
          selectedDayMeetings.map((entry) => (
            <DayInsights entry={entry} key={entry.entryID} />
          ))
        ) : (
          <p>No Journal entries for today.</p>
        )}
      </ol>
    </section>
  );

  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl p-8 max-h-[60vh] overflow-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 lg:gap-4 md:gap-3 divide-y md:divide-y-0 lg:divide-x divide-gray-200">
          <div className="pb-4 md:pb-0 lg:pr-10">
            <CalendarHeader
              {...{ firstDayCurrentMonth, previousMonth, nextMonth }}
            />
            <WeekdayHeaders />
            <DayGrid {...{ days, setSelectedDay, selectedDay, entries }} />
          </div>
          <div
            className={`pt-4 md: pt-0 ${
              selectedDay ? "block" : "hidden xl:block"
            }`}
          >
            <JournalEntries {...{ selectedDay, selectedDayMeetings }} />
          </div>
        </div>
      </div>
    </div>
  );
}
