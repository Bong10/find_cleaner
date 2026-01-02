// utils/useNotificationsSocket.js
// Hook that subscribes to the singleton notifications socket manager
import { useEffect, useRef, useState } from "react";
import { notificationsSocketManager } from "@/utils/notificationsSocketManager";

export const useNotificationsSocket = ({
  enabled = true,
  onEvent,
} = {}) => {
  const [isConnected, setIsConnected] = useState(notificationsSocketManager.isConnected);
  
  // Use ref for callback to avoid re-subscribing on every render
  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled) return;

    const handleEvent = (data) => {
      // Update connection state
      setIsConnected(notificationsSocketManager.isConnected);
      // Forward event to caller via ref (stable reference)
      onEventRef.current?.(data);
    };

    const unsubscribe = notificationsSocketManager.addListener(handleEvent);

    // Sync initial connection state
    setIsConnected(notificationsSocketManager.isConnected);

    return () => {
      unsubscribe();
    };
  }, [enabled]); // Only re-run when enabled changes, NOT when onEvent changes

  return {
    isConnected,
  };
};
