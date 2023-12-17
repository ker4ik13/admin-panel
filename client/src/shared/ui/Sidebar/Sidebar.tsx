"use client";

import Link from "next/link";
import Logo from "../Logo/Logo";
import s from "./Sidebar.module.scss";
import { usePathname } from "next/navigation";

// Icons
import { LuLayoutDashboard } from "react-icons/lu";
import { BiSolidDashboard } from "react-icons/bi";
import { MdOutlineFeedback, MdOutlineWorkOutline } from "react-icons/md";
import { MdFeedback, MdWork } from "react-icons/md";
import { IoMailOpenOutline, IoMailOutline } from "react-icons/io5";
import { FaUser, FaRegUser } from "react-icons/fa6";
export const Sidebar = () => {
  const pathName = usePathname();

  const isActivePage = (link: string) => {
    return pathName === link ? `${s.pageLink} ${s.active}` : s.pageLink;
  };
  const isActiveIcon = (link: string) => {
    return pathName === link ? true : false;
  };

  return (
    <aside className={s.sidebar}>
      <div className={s.logoWrapper}>
        <Logo />
      </div>
      <div className={s.pages}>
        <Link href={"/"} className={isActivePage("/")}>
          {isActiveIcon("/") ? <BiSolidDashboard /> : <LuLayoutDashboard />}
          <span>Дашборд</span>
        </Link>
        <Link href={"/responses"} className={isActivePage("/responses")}>
          {isActiveIcon("/responses") ? <MdFeedback /> : <MdOutlineFeedback />}
          <span>Отклики</span>
        </Link>
        <Link href={"/mailings"} className={isActivePage("/mailings")}>
          {isActiveIcon("/mailings") ? (
            <IoMailOpenOutline />
          ) : (
            <IoMailOutline />
          )}
          <span>Рассылки</span>
        </Link>
        <Link href={"/orders"} className={isActivePage("/orders")}>
          {isActiveIcon("/orders") ? <MdWork /> : <MdOutlineWorkOutline />}
          <span>Заказы</span>
        </Link>
        <Link href={"/users"} className={isActivePage("/users")}>
          {isActiveIcon("/users") ? <FaUser /> : <FaRegUser />}
          <span>Пользователи</span>
        </Link>
      </div>
    </aside>
  );
};
