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
import Unavailable from "@/shared/Unavailable/Unavailable";
import { showNotification } from "@/widgets/Notification/utils/showNotification";

import { ToastContainer } from "react-toastify";
import { language, translate } from "@/data/translate";

export const Header = () => {
  const pathName = usePathname();

  const userName = "Кирилл Киреев";
  const dropdownList = useRef<HTMLDivElement | null>(null);

  const handleOpen = () => {
    if (dropdownList.current) {
      dropdownList.current.classList.toggle(s.open);
    }
  };

  const showDontWorkingNotification = () => {
    showNotification("Страница пока недоступна", {
      type: "error",
      autoClose: 3000,
      theme: getTheme() ? "dark" : "light",
    });
  };

  useEffect(() => {
    getTheme();
  }, []);

  const isActivePage = (link: string) => {
    return pathName === link ? `${s.dropDownLink} ${s.active}` : s.dropDownLink;
  };

  return (
    <header className={s.header} data-tag="header">
      <ToastContainer />
      <div className={s.messages}>
        <Unavailable onClick={showDontWorkingNotification}>
          <Link
            href={"#"}
            className={s.messageLink}
            title={translate.header.letters[language]}
          >
            <IoMailOutline />
          </Link>
          <Link
            href={"#"}
            className={s.messageLink}
            title={translate.header.notifications[language]}
          >
            <IoIosNotificationsOutline />
          </Link>
        </Unavailable>
      </div>
      <div className={s.account}>
        <p className={s.name}>
          {translate.header.hello[language]}, {userName}
        </p>
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
          <Unavailable onClick={showDontWorkingNotification}>
            <Link href={"#"} className={isActivePage("#")} onClick={handleOpen}>
              <FaUser />
              <span>{translate.header.myProfile[language]}</span>
            </Link>
          </Unavailable>
          <Link
            href={"/settings"}
            className={isActivePage("/settings")}
            onClick={handleOpen}
          >
            <IoMdSettings />
            <span>{translate.header.settings[language]}</span>
          </Link>
          <Unavailable onClick={showDontWorkingNotification}>
            <Link href={"#"} className={isActivePage("#")} onClick={handleOpen}>
              <IoLogOut />
              <span>{translate.header.logout[language]}</span>
            </Link>
          </Unavailable>
        </div>
      </div>
    </header>
  );
};
