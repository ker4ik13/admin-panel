import { type INotification } from "../Notification"


interface IShowNotification extends INotification {
  setIsOpen: (props: INotification) => void;
  secondsBeforeClose: number;
}

export const showNotification = ({ isOpen, myref, setIsOpen, text, type, secondsBeforeClose }: IShowNotification) => {

  // Показ уведомления
  setIsOpen({
    isOpen: isOpen,
    myref: myref,
    text: text,
    type: type,
  })

  // Закрытие уведомления по таймеру
  setTimeout(() => {
     setIsOpen({
    isOpen: false,
    myref: myref,
    text: text,
    type: type,
  })
  }, secondsBeforeClose);

}