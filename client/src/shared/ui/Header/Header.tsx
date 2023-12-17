"use client";

import Link from "next/link";
import s from "./Header.module.scss";
import { IoMailOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import Image from "next/image";
import userPhoto from "@/data/userPhoto.jpeg";
import { useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { getTheme } from "@/features/getTheme";

export const Header = () => {
  const pathName = usePathname();

  const userName = "Кирилл Киреев";
  const dropdownList = useRef<HTMLDivElement | null>(null);

  const handleOpen = () => {
    if (dropdownList.current) {
      dropdownList.current.classList.toggle(s.open);
    }
  };

  useEffect(() => {
    getTheme();
  }, []);

  const isActivePage = (link: string) => {
    return pathName === link ? `${s.dropDownLink} ${s.active}` : s.dropDownLink;
  };

  return (
    <header className={s.header}>
      <div className={s.messages}>
        <Link href={"#"} className={s.messageLink}>
          <IoMailOutline />
        </Link>
        <Link href={"#"} className={s.messageLink}>
          <IoIosNotificationsOutline />
        </Link>
      </div>
      <div className={s.account}>
        <p className={s.name}>Привет, {userName}</p>
        <button className={s.userButton} onClick={handleOpen}>
          <Image
            className={s.userImage}
            src={userPhoto}
            alt={userName}
            width={30}
            height={30}
          />
        </button>
        <div className={s.dropDown} ref={dropdownList}>
          <Link href={"#"} className={isActivePage("#")}>
            <FaUser />
            <span>Мой профиль</span>
          </Link>
          <Link href={"/settings"} className={isActivePage("/settings")}>
            <IoMdSettings />
            <span>Настройки</span>
          </Link>
          <Link href={"#"} className={isActivePage("#")}>
            <IoLogOut />
            <span>Выход</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
