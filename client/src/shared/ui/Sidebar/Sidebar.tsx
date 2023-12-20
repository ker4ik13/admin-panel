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
import { useEffect, useRef } from "react";

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

  // const getOpen = (): string => {
  //   return typeof window !== "undefined" && window.innerWidth < 768
  //     ? `${s.sidebar} ${s.close}`
  //     : s.sidebar;
  // };

  return (
    <aside className={s.sidebar} ref={sidebar} data-tag="aside">
      <button
        type="button"
        className={s.openButton}
        onClick={handleOpenSidebar}
      >
        <IoIosArrowBack />
        {/* {sidebar.current?.className.includes(s.open) ? (
            <IoIosArrowBack />
          ) : (
            <IoIosArrowForward />
          )} */}
      </button>
      <div className={s.logoWrapper}>
        <Logo />
      </div>
      <p className={s.pagesTitle}>Главное</p>
      <div className={s.pages}>
        <Link href={"/"} className={isActivePage("/")}>
          {isActiveIcon("/") ? <BiSolidDashboard /> : <LuLayoutDashboard />}
          <span>{translate.sidebar.dashboard[language]}</span>
        </Link>
        <Link href={"/orders"} className={isActivePage("/orders")}>
          {isActiveIcon("/orders") ? <MdWork /> : <MdOutlineWorkOutline />}
          <span>{translate.sidebar.orders[language]}</span>
        </Link>
        <Link href={"/users"} className={isActivePage("/users")}>
          {isActiveIcon("/users") ? <FaUser /> : <FaRegUser />}
          <span>{translate.sidebar.users[language]}</span>
        </Link>
        <Link href={"/articles"} className={isActivePage("/articles")}>
          {isActiveIcon("/articles") ? <MdArticle /> : <MdOutlineArticle />}
          <span>{translate.sidebar.articles[language]}</span>
        </Link>
        <Link href={"/wallet"} className={isActivePage("/wallet")}>
          {isActiveIcon("/wallet") ? <IoWallet /> : <IoWalletOutline />}
          <span>{translate.sidebar.wallet[language]}</span>
        </Link>
      </div>
      <p className={s.pagesTitle}>Коммуникация</p>
      <div className={s.pages}>
        <Link href={"/responses"} className={isActivePage("/responses")}>
          {isActiveIcon("/responses") ? <MdFeedback /> : <MdOutlineFeedback />}
          <span>{translate.sidebar.responses[language]}</span>
        </Link>
        <Link href={"/mailings"} className={isActivePage("/mailings")}>
          {isActiveIcon("/mailings") ? (
            <IoMailOpenOutline />
          ) : (
            <IoMailOutline />
          )}
          <span>{translate.sidebar.mailings[language]}</span>
        </Link>
      </div>
      <p className={s.pagesTitle}>Помощь</p>
      <div className={s.pages}>
        <Link href={"/help"} className={isActivePage("/help")}>
          {isActiveIcon("/help") ? (
            <IoIosHelpCircle />
          ) : (
            <IoIosHelpCircleOutline />
          )}
          <span>{translate.sidebar.help[language]}</span>
        </Link>
        <Link
          href={"/documentation"}
          className={isActivePage("/documentation")}
        >
          {isActiveIcon("/documentation") ? (
            <IoDocument />
          ) : (
            <IoDocumentOutline />
          )}
          <span>{translate.sidebar.documentation[language]}</span>
        </Link>
      </div>
    </aside>
  );
};
