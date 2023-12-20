"use client";
import { useEffect, useState } from "react";
import s from "../GeneralPage.module.scss";
import { getTheme } from "@/features/getTheme";
import { showNotification } from "@/widgets/Notification/utils/showNotification";
import { language, translate } from "@/data/translate";

export const SettingsPage = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = getTheme();
    if (theme) {
      document.body.classList.add("dark");
      setIsDark(true);
    }
    localStorage.setItem("darkTheme", JSON.stringify(theme));
  }, []);

  // Изменение темы
  const handleDark = () => {
    if (getTheme()) {
      localStorage.setItem("darkTheme", "false");
      document.body.classList.remove("dark");
      setIsDark(false);
      showNotification(translate.notification.lightThemeOn[language], {
        type: "success",
        autoClose: 2000,
        theme: "light",
        hideProgressBar: true,
      });
    } else {
      localStorage.setItem("darkTheme", "true");
      document.body.classList.add("dark");
      setIsDark(true);
      showNotification(translate.notification.darkThemeOn[language], {
        type: "success",
        autoClose: 2000,
        theme: "dark",
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className={s.page}>
      <h2 className={s.title}>{translate.settings.title[language]}</h2>
      <div className={s.settings}>
        <div className={s.stringInput}>
          <label htmlFor="theme" className={s.inputLabel}>
            {translate.settings.darkTheme[language]}
          </label>
          <div className={s.checkboxWrapper}>
            <input
              type="checkbox"
              name="theme"
              id="theme"
              checked={isDark}
              onChange={handleDark}
              className={s.checkbox}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
