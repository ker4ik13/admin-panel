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
        <Link href="/admin/dashboard">
          {translate.sidebar.dashboard[language]}
        </Link>,
        "/admin/dashboard",
        <LuLayoutDashboard />
      ),
      getItem(
        <Link href="/admin/orders">{translate.sidebar.orders[language]}</Link>,
        "/admin/orders",
        <MdOutlineWorkOutline />
      ),
      getItem(
        <Link href="/admin/users">{translate.sidebar.users[language]}</Link>,
        "/admin/users",
        <FaRegUser />
      ),
      getItem(
        <Link href="/admin/articles">
          {translate.sidebar.articles[language]}
        </Link>,
        "/admin/articles",
        <MdOutlineArticle />
      ),
      getItem(
        <Link href="/admin/wallet">{translate.sidebar.wallet[language]}</Link>,
        "/admin/wallet",
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
        <Link href="/admin/responses">
          {translate.sidebar.responses[language]}
        </Link>,
        "/admin/responses",
        <MdOutlineFeedback />
      ),
      getItem(
        <Link href="/admin/mailings">
          {translate.sidebar.mailings[language]}
        </Link>,
        "/admin/mailings",
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
        <Link href="/admin/help">{translate.sidebar.help[language]}</Link>,
        "/admin/help",
        <IoIosHelpCircleOutline />
      ),
      getItem(
        <Link href="/admin/documentation">
          {translate.sidebar.documentation[language]}
        </Link>,
        "/admin/documentation",
        <IoDocumentOutline />
      ),
      getItem(
        <Link href="/admin/tools">{translate.sidebar.tools[language]}</Link>,
        "/admin/tools",
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
