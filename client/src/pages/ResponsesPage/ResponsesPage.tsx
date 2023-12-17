import { mockResponses } from "@/data/mockResponses";
import s from "../GeneralPage.module.scss";
import { ResponseCard } from "@/shared/ui/ResponseCard/ResponseCard";

export const ResponsesPage = () => {
  return (
    <div className={s.page}>
      <h2 className={s.title}>Отклики</h2>
      <div className={s.responses}>
        {mockResponses.map((response, i) => (
          <ResponseCard response={response} key={i} />
        ))}
      </div>
    </div>
  );
};
