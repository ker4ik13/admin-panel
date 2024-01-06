"use client";

import userPhoto from "@/data/userPhoto.jpeg";
import { getTheme } from "@/features/getTheme";
import Unavailable from "@/shared/Unavailable/Unavailable";
import { showNotification } from "@/widgets/Notification/utils/showNotification";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa6";
import { IoIosNotificationsOutline, IoMdSettings } from "react-icons/io";
import { IoLogOut, IoMailOutline } from "react-icons/io5";
import s from "./Header.module.scss";

import { language, translate } from "@/data/translate";
import { AuthService } from "@/services/auth.service";
import { UserService } from "@/services/user.service";
import { IUser } from "@/shared/types/IUser";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

export const Header = () => {
  const [user, setUser] = useState({} as IUser);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await UserService.getMe();
        if (response) {
          setUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const pathName = usePathname();
  const router = useRouter();

  const dropdownList = useRef<HTMLDivElement | null>(null);

  const handleOpen = () => {
    if (dropdownList.current) {
      dropdownList.current.classList.toggle(s.open);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    router.push("/admin/auth");
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
        {user.name && (
          <p className={s.name}>
            {translate.header.hello[language]},{" "}
            {`${user.name} ${user.lastName}`}
          </p>
        )}
        <button className={s.userButton} onClick={handleOpen}>
          <Image
            className={s.userImage}
            src={userPhoto}
            alt={user.name || "Пользователь"}
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
            href={"/admin/settings"}
            className={isActivePage("/admin/settings")}
            onClick={handleOpen}
          >
            <IoMdSettings />
            <span>{translate.header.settings[language]}</span>
          </Link>
          <button type="button" className={s.dropDownLink} onClick={logout}>
            <IoLogOut />
            <span>{translate.header.logout[language]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
