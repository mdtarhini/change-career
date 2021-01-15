import { NOTIFICATION_FETCHED, NOTIFICATION_DELETED } from "./types";
export const notificationFetched = (notificationKey, notificationData) => {
  return {
    type: NOTIFICATION_FETCHED,
    payload: { key: notificationKey, data: notificationData },
  };
};

export const notificationDeleted = (notificationKey) => {
  return { type: NOTIFICATION_DELETED, payload: notificationKey };
};
