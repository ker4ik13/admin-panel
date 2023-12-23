import { language, translate } from "@/data/translate";
import s from "../GeneralPage.module.scss";

const UsersPage = () => {
  return (
    <div className={s.page}>
      <h2 className={s.title}>{translate.sidebar.users[language]}</h2>
      <div className={s.pageWrapper}>
        <h4>Возможные роли пользователей</h4>
        {/* Добавить роли пользователей */}
      </div>
    </div>
  );
};

export default UsersPage;
