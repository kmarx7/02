"use client";

import { useState, useEffect, useCallback } from "react";

export function useNotification() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const notify = useCallback(
    (title: string, body: string, icon?: string) => {
      if (permission !== "granted") return;
      new Notification(title, { body, icon });
    },
    [permission]
  );

  return { permission, requestPermission, notify };
}
