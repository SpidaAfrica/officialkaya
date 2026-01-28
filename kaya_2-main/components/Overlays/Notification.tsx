"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import Media from "react-media";

import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { triggerNotification } from "@/state/store/slices/notification";
import clsx from "clsx";
import ClientOnlyPortal from "./ClientOnlyPortal";

// const notification = document.getElementById("notification")!;
export default function Notification() {
  const { show, icon, message, type } = useAppSelector(
    (state) => state.notification
  );
  const [domReady, setDomReady] = useState(false);

  const Icon = icon!;
  const iconStyle = `
    ${
      type === "error"
        ? "stroke-red-400"
        : type === "warning"
        ? "stroke-yellow-500"
        : type === "success"
        ? "stroke-green-400"
        : "stroke-primary"
    }
  `;
  // const textStyle = `
  //   ${
  //     type === "error"
  //       ? "text-red-400"
  //       : type === "warning"
  //       ? "text-yellow-500"
  //       : type === "success"
  //       ? "text-green-400"
  //       : "text-primary"
  //   }
  // `;
  // const shadowStyle = `
  //   ${
  //     type === "error"
  //       ? "shadow-red-400/20"
  //       : type === "warning"
  //       ? "shadow-yellow-500/20"
  //       : type === "success"
  //       ? "shadow-green-400/20"
  //       : "shadow-primary-3/20"
  //   }
  // `;

  const borderStyle = `
    ${
      type === "error"
        ? "border-red-400"
        : type === "warning"
        ? "border-yellow-500"
        : type === "success"
        ? "border-green-400"
        : "border-primary-3"
    }
  `;

  const dispatch = useAppDispatch();

  useEffect(() => {
    setDomReady(true);
  }, []);

  useEffect(() => {
    console.log("NOTIFICATION", show);
    const timer = setTimeout(() => {
      dispatch(
        triggerNotification({
          show: false,
        })
      );
    }, 4000);
    return () => clearTimeout(timer);
  }, [show, dispatch]);

  if (domReady) {
    if (typeof window === "object" && typeof window.document === "object") {
      return (
        <Media queries={{ small: { maxWidth: 768 } }}>
          {(matches) => {
            console.log("NOTIFICATION_SIZE: ", { matches });
            return (
              <AnimatePresence>
                {show && (
                  <ClientOnlyPortal selector={"#notification"}>
                    <motion.div
                      initial={{
                        opacity: 0,
                        translateX: matches.small ? 0 : "100%",
                        translateY: matches.small ? "-100%" : 0,
                        // scale: 0,
                      }}
                      animate={{
                        opacity: 1,
                        translateX: 0,
                        translateY: 0,
                        // scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        translateX: matches.small ? 0 : "100%",
                        translateY: matches.small ? "-100%" : 0,
                        // scale: 0,
                      }}
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      className={clsx(
                        "fixed inset-0 z-[100000] w-11/12_ flex items-end w-full p-3 mx-auto bg-white border rounded-2xl shadow-lg md:w-80 md:rounded-xl outline_ outline-primary_ border-primary-3_ ring-offset-4_ -top-4 md:top-auto md:bottom-16 md:right-16 md:left-auto md:mx-0 h-20 md:h-fit active:scale-90",
                        borderStyle
                        // shadowStyle
                      )}>
                      <div className="flex items-center w-full text-xl gap-2">
                        <span className="relative flex items-center justify-center">
                          <Icon
                            className={clsx("w-6 h-6 animate-ping", iconStyle)}
                          />
                          <Icon
                            className={clsx("absolute w-6 h-6", iconStyle)}
                          />
                        </span>
                        <div
                          className={clsx(
                            "w-full overflow-hidden text-gray-700 font-semibold text-ellipsis"
                            // textStyle
                          )}>
                          {message}
                        </div>
                      </div>
                    </motion.div>
                  </ClientOnlyPortal>
                )}
              </AnimatePresence>
            );
          }}
        </Media>
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
}
