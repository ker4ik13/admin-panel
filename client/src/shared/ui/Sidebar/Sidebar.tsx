"use client";

import Link from "next/link";
import Logo from "../Logo/Logo";
import s from "./Sidebar.module.scss";
import { usePathname } from "next/navigation";
import { language, translate } from "@/data/translate";

// Icons
import { LuLayoutDashboard } from "react-icons/lu";
import { BiSolidDashboard } from "react-icons/bi";
import {
  MdOutlineFeedback,
  MdOutlineWorkOutline,
  MdFeedback,
  MdWork,
  MdArticle,
  MdOutlineArticle,
} from "react-icons/md";
import {
  IoDocument,
  IoMailOpenOutline,
  IoMailOutline,
  IoDocumentOutline,
  IoWallet,
  IoWalletOutline,
} from "react-icons/io5";
import { FaUser, FaRegUser } from "react-icons/fa6";
import {
  IoIosHelpCircle,
  IoIosHelpCircleOutline,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { PiToolbox, PiToolboxFill } from "react-icons/pi";
import { useRef } from "react";

interface IPage {
  name: string;
  href: string;
  activeIcon: JSX.Element;
  unactiveIcon: JSX.Element;
}

const mainPages: IPage[] = [
  {
    name: translate.sidebar.dashboard[language],
    href: "/",
    activeIcon: <BiSolidDashboard />,
    unactiveIcon: <LuLayoutDashboard />,
  },
  {
    name: translate.sidebar.orders[language],
    href: "/orders",
    activeIcon: <MdWork />,
    unactiveIcon: <MdOutlineWorkOutline />,
  },
  {
    name: translate.sidebar.users[language],
    href: "/users",
    activeIcon: <FaUser />,
    unactiveIcon: <FaRegUser />,
  },
  {
    name: translate.sidebar.articles[language],
    href: "/articles",
    activeIcon: <MdArticle />,
    unactiveIcon: <MdOutlineArticle />,
  },
  {
    name: translate.sidebar.wallet[language],
    href: "/wallet",
    activeIcon: <IoWallet />,
    unactiveIcon: <IoWalletOutline />,
  },
];

const communicationPages: IPage[] = [
  {
    name: translate.sidebar.responses[language],
    href: "/responses",
    activeIcon: <MdFeedback />,
    unactiveIcon: <MdOutlineFeedback />,
  },
  {
    name: translate.sidebar.mailings[language],
    href: "/mailings",
    activeIcon: <IoMailOpenOutline />,
    unactiveIcon: <IoMailOutline />,
  },
];

const helpPages: IPage[] = [
  {
    name: translate.sidebar.help[language],
    href: "/help",
    activeIcon: <IoIosHelpCircle />,
    unactiveIcon: <IoIosHelpCircleOutline />,
  },
  {
    name: translate.sidebar.documentation[language],
    href: "/documentation",
    activeIcon: <IoDocument />,
    unactiveIcon: <IoDocumentOutline />,
  },
  {
    name: translate.sidebar.tools[language],
    href: "/tools",
    activeIcon: <PiToolboxFill />,
    unactiveIcon: <PiToolbox />,
  },
];

export const Sidebar = () => {
  const pathName = usePathname();
  const sidebar = useRef<HTMLDivElement | null>(null);

  const isActivePage = (link: string) => {
    return pathName === link ? `${s.pageLink} ${s.active}` : s.pageLink;
  };
  const isActiveIcon = (link: string) => {
    return pathName === link ? true : false;
  };

  const handleOpenSidebar = () => {
    document
      .querySelector("aside[data-tag='aside']")
      ?.classList.toggle(s.close);
    document
      .querySelector("header[data-tag='header']")
      ?.classList.toggle(s.close);
    document.querySelector("main[data-tag='main']")?.classList.toggle(s.close);
  };

  return (
    <aside className={s.sidebar} ref={sidebar} data-tag="aside">
      <button
        type="button"
        className={s.openButton}
        onClick={handleOpenSidebar}
      >
        {sidebar.current?.className.includes(s.close) ? (
          <IoIosArrowForward />
        ) : (
          <IoIosArrowBack />
        )}
      </button>
      <div className={s.logoWrapper}>
        <Logo />
      </div>

      {/* Главные страницы */}
      <p className={s.pagesTitle}>Главное</p>
      <div className={s.pages}>
        {mainPages.map((page) => (
          <Link
            href={page.href}
            key={page.href}
            className={isActivePage(page.href)}
          >
            {isActiveIcon(page.href) ? page.activeIcon : page.unactiveIcon}
            <span>{page.name}</span>

            {/* <div className={s.new}>+99</div> */}
          </Link>
        ))}
      </div>

      {/* Страницы коммуникации */}
      <p className={s.pagesTitle}>Коммуникация</p>
      <div className={s.pages}>
        {communicationPages.map((page) => (
          <Link
            href={page.href}
            key={page.href}
            className={isActivePage(page.href)}
          >
            {isActiveIcon(page.href) ? page.activeIcon : page.unactiveIcon}
            <span>{page.name}</span>
          </Link>
        ))}
      </div>

      {/* Страницы помощи */}
      <p className={s.pagesTitle}>Помощь</p>
      <div className={s.pages}>
        {helpPages.map((page) => (
          <Link
            href={page.href}
            key={page.href}
            className={isActivePage(page.href)}
          >
            {isActiveIcon(page.href) ? page.activeIcon : page.unactiveIcon}
            <span>{page.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};
