import { language, translate } from "@/data/translate";
import s from "../GeneralPage.module.scss";

const MainPage = () => {
  return (
    <div className={s.page}>
      <h2 className={s.title}>{translate.main.title[language]}</h2>
    </div>
  );
};

export default MainPage;
