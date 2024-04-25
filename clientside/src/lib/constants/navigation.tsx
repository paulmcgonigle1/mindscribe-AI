import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineAnnotation,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
} from "react-icons/hi";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Journal",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "statistics",
    label: "Statistics",
    path: "/statistics",
    icon: <HiOutlineCube />,
  },
  {
    key: "improvements",
    label: "Improvements",
    path: "/improvements",
    icon: <HiOutlineAnnotation />,
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: "settings",
    label: "Settings",
    path: "/settings",
    icon: <HiOutlineCog />,
  },
];
