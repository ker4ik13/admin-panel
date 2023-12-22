import styles from "./Unavailable.module.scss";
import { MouseEvent } from "react";

interface UnavailableProps {
  children: React.ReactNode;
  onClick?: () => any;
}

const stopClick = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

const Unavailable = ({ children, onClick }: UnavailableProps) => {
  return (
    <div
      className={styles.unavailable}
      onClick={(event) => {
        stopClick(event);
        if (onClick) {
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
};

export default Unavailable;
