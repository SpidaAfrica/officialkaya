"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type OverlayProps = {
  children?: React.ReactNode;
  closeOnClick?: boolean;
  handleShowOverlay?(show?: boolean): () => void;
  show: boolean;
  className?: string;
};

export default function Overlay({
  children,
  closeOnClick,
  handleShowOverlay,
  show,
  className,
}: OverlayProps) {
  const overlayStyles = `fixed h-svh w-screen bg-black/60 z-20tt ${
    closeOnClick && "cursor-pointer"
  } top-0 left-0 flex items-center justify-center backdrop-blur-sm_` as React.HTMLAttributes<HTMLDivElement>["className"];

  useEffect(() => {
    if (show) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Escape") {
          handleShowOverlay?.();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleShowOverlay, show]);

  return (
    <AnimatePresence>
      {show &&
        (children ? (
          <motion.div
            onClick={() => closeOnClick && handleShowOverlay?.()}
            title={closeOnClick ? "close" : ""}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={overlayStyles}>
            <OverlayChild show={show}>{children}</OverlayChild>
          </motion.div>
        ) : (
          <motion.div
            onClick={() => closeOnClick && handleShowOverlay?.()}
            title={closeOnClick ? "close" : ""}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${overlayStyles} ${className}`}
          />
        ))}
    </AnimatePresence>
  );
}

function OverlayChild({
  show,
  children,
}: {
  show: boolean;
  children?: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* 
className={`fixed h-svh w-screen bg-primary/80 ${
            closeOnClick && "cursor-pointer"
          } before:w-full before:h-full before:absolute before:left-0 before:bg-primary before:opacity-40 top-0 left-0 flex items-center justify-center z-50 active:backdrop-blur-lg backdrop-blur-sm`}
*/

/*
 <AnimatePresence>
      {show &&
        (children ? (
          <motion.div
            className={
              "fixed h-svh w-screen bg-primary/80  before:w-full before:h-full before:absolute before:left-0 before:bg-primary before:opacity-40 top-0 left-0 flex items-center justify-center z-50 backdrop-blur-sm   "
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnClick ? () => handleShowOverlay() : () => {}}
            title={closeOnClick ? "close" : ""}
          >
            <AnimatePresence>
              {show && (
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  exit={{ y: 50 }}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={"fixed h-svh w-screen bg-red-400 top-0 left-0 "}
            onClick={closeOnClick ? () => handleShowOverlay() : () => {}}
            title={closeOnClick ? "close" : ""}
          />
        ))}
    </AnimatePresence>
*/
