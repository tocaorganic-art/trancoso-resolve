import { useEffect, useState, useCallback } from "react";

function detectStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function detectIos() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent || "";
  const isIosDevice = /iphone|ipad|ipod/i.test(ua);
  const isIpadOs = /macintosh/i.test(ua) && "ontouchend" in document;
  return isIosDevice || isIpadOs;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(detectStandalone);
  const isIos = detectIos();

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      localStorage.setItem("pwa_installed", "true");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      return { outcome: isIos ? "ios" : installed ? "installed" : "unavailable" };
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setInstalled(true);
      localStorage.setItem("pwa_installed", "true");
    }
    setDeferredPrompt(null);

    return { outcome };
  }, [deferredPrompt, isIos, installed]);

  return {
    canInstall: Boolean(deferredPrompt),
    installed,
    isIos,
    install,
  };
}

export default usePwaInstall;
