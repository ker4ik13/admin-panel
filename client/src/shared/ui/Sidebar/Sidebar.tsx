"use client";

import { language, translate } from "@/data/translate";
import { usePathname } from "next/navigation";
import Logo from "../Logo/Logo";
import s from "./Sidebar.module.scss";

// Icons
import { useRef, useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { IoIosHelpCircleOutline } from "react-icons/io";
import {
  IoDocumentOutline,
  IoMailOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  MdOutlineArticle,
  MdOutlineFeedback,
  MdOutlineWorkOutline,
} from "react-icons/md";
import { PiToolbox } from "react-icons/pi";

// Ant design
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Menu, type MenuProps } from "antd";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    "Главное",
    "main-pages",
    null,
    [
      getItem(
        <Link href="/">{translate.sidebar.dashboard[language]}</Link>,
        "/",
        <LuLayoutDashboard />
      ),
      getItem(
        <Link href="/orders">{translate.sidebar.orders[language]}</Link>,
        "/orders",
        <MdOutlineWorkOutline />
      ),
      getItem(
        <Link href="/users">{translate.sidebar.users[language]}</Link>,
        "/users",
        <FaRegUser />
      ),
      getItem(
        <Link href="/articles">{translate.sidebar.articles[language]}</Link>,
        "/articles",
        <MdOutlineArticle />
      ),
      getItem(
        <Link href="/wallet">{translate.sidebar.wallet[language]}</Link>,
        "/wallet",
        <IoWalletOutline />
      ),
    ],
    "group"
  ),
  { type: "divider" },
  getItem(
    "Коммуникация",
    "communication-pages",
    null,
    [
      getItem(
        <Link href="/responses">{translate.sidebar.responses[language]}</Link>,
        "/responses",
        <MdOutlineFeedback />
      ),
      getItem(
        <Link href="/mailings">{translate.sidebar.mailings[language]}</Link>,
        "/mailings",
        <IoMailOutline />
      ),
    ],
    "group"
  ),
  getItem(
    "Помощь",
    "help-pages",
    null,
    [
      getItem(
        <Link href="/help">{translate.sidebar.help[language]}</Link>,
        "/help",
        <IoIosHelpCircleOutline />
      ),
      getItem(
        <Link href="/documentation">
          {translate.sidebar.documentation[language]}
        </Link>,
        "/documentation",
        <IoDocumentOutline />
      ),
      getItem(
        <Link href="/tools">{translate.sidebar.tools[language]}</Link>,
        "/tools",
        <PiToolbox />
      ),
    ],
    "group"
  ),
];

export const Sidebar = () => {
  const pathName = usePathname();
  const sidebar = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    handleOpenSidebar();
  };

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
      <Button type="primary" onClick={toggleCollapsed} className={s.openButton}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>

      <Link href="/" className={s.logoWrapper}>
        <Logo />
      </Link>

      <Menu
        defaultSelectedKeys={[pathName || "/"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        className={s.menu}
      />
    </aside>
  );
};
