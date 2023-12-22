import type { IResponse } from "@/shared/types/IResponse";
import s from "./ResponseCard.module.scss";
import { BsTelephone } from "react-icons/bs";
import { IoMailOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { CiShoppingTag } from "react-icons/ci";
import { FaTelegram } from "react-icons/fa6";
import Link from "next/link";

interface Props {
  response: IResponse;
}

export const ResponseCard = ({ response }: Props) => {
  return (
    <div className={s.responseCard}>
      <div className={s.infoString}>
        <FaRegUser />
        <p className={s.name}>{response.name}</p>
      </div>
      <time dateTime={response.createdAt} className={s.date}>
        {response.createdAt}
      </time>
      <div className={s.infoString}>
        <CiShoppingTag />
        <span>{response.product}</span>
      </div>
      <div className={s.infoString}>
        <BsTelephone />
        <span>{response.phone}</span>
      </div>
      <div className={s.infoString}>
        <IoMailOutline />
        <span>{response.email}</span>
      </div>
      <div className={s.infoString}>
        <FaTelegram />
        <Link href={response.tgLink}>{response.tgLink}</Link>
      </div>
    </div>
  );
};
