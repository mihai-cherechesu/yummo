import { NotificationManager } from "react-notifications";

export function createNotification(
  type,
  message,
  title,
  timeout = 3000,
  callback = () => console.log("Support Ukraine")) {

  switch (type) {
    case 'info':
      NotificationManager.info(message, title, timeout);
      break;
    case 'success':
      NotificationManager.success(message, title, timeout);
      break;
    case 'warning':
      NotificationManager.warning(message, title, timeout);
      break;
    case 'error':
      NotificationManager.error(message, title, timeout, callback);
      break;
  }
}