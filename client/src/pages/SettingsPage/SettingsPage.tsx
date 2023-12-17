"use client";
import { useEffect, useRef, useState } from "react";
import s from "../GeneralPage.module.scss";
import { getTheme } from "@/features/getTheme";
import {
  type INotification,
  Notification,
} from "@/widgets/Notification/Notification";
import { showNotification } from "@/widgets/Notification/utils/showNotification";

export const SettingsPage = () => {
  const notification = useRef<HTMLDivElement | null>(null);

  const [isDark, setIsDark] = useState(false);
  const [isNotification, setIsNotification] = useState<INotification>({
    isOpen: false,
    myref: notification,
    text: "",
    type: "info",
  });

  useEffect(() => {
    const theme = getTheme();
    if (theme) {
      document.body.classList.add("dark");
      setIsDark(true);
    }
    localStorage.setItem("darkTheme", JSON.stringify(theme));
  }, []);

  const handleDark = () => {
    if (getTheme()) {
      localStorage.setItem("darkTheme", "false");
      document.body.classList.remove("dark");
      setIsDark(false);

      showNotification({
        isOpen: true,
        myref: notification,
        secondsBeforeClose: 2000,
        setIsOpen: setIsNotification,
        text: "Темная тема отключена",
        type: "info",
      });
    } else {
      localStorage.setItem("darkTheme", "true");
      document.body.classList.add("dark");
      setIsDark(true);

      showNotification({
        isOpen: true,
        myref: notification,
        secondsBeforeClose: 3000,
        setIsOpen: setIsNotification,
        text: "Темная тема включена",
        type: "info",
      });
    }
  };

  return (
    <div className={s.page}>
      <h2 className={s.title}>Настройки</h2>
      <div className={s.settings}>
        <div className={s.stringInput}>
          <label htmlFor='theme' className={s.inputLabel}>
            Темная тема
          </label>
          <div className={s.checkboxWrapper}>
            <input
              type='checkbox'
              name='theme'
              id='theme'
              checked={isDark}
              onChange={handleDark}
              className={s.checkbox}
            />
          </div>
        </div>
      </div>
      <Notification
        isOpen={isNotification.isOpen}
        myref={isNotification.myref}
        setIsOpen={setIsNotification}
        text={isNotification.text}
        type={isNotification.type}
      />
    </div>
  );
};
