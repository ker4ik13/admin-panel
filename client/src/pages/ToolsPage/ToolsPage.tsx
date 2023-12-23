import { language, translate } from "@/data/translate";
import s from "../GeneralPage.module.scss";

const ToolsPage = () => {
  return (
    <div className={s.page}>
      <h2 className={s.title}>{translate.sidebar.tools[language]}</h2>
    </div>
  );
};

export default ToolsPage;
