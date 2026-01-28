"use client";
export const dynamic = "force-dynamic";

import { Ref, useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import Overlay from "./Overlay";
import { AnimatePresence, motion } from "framer-motion";
import ClientOnlyPortal from "./ClientOnlyPortal";
import clsx from "clsx";
import Media from "react-media";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { closeModal } from "@/state/store/slices/modal";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Modal() {
  const {
    showModal,
    modalMessage,
    actionConfirm,
    actionCancel,
    disableOnClick,
    content,
    className,
  } = useAppSelector((state) => state.modal);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const close = useCallback(() => {
    router.replace(pathname + "?" + createQueryString("menu", "false"));
  }, [createQueryString, pathname, router]);

  const cancel = () => {
    if (actionCancel) {
      actionCancel();
      close(); // NOTE: Might need to remove this
    } else {
      dispatch(closeModal());
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    console.log({ showModal });
  }, [showModal]);

  useEffect(() => {
    setDomReady(true);
  }, []);

  if (domReady) {
    if (typeof window === "object") {
      return (
        <>
          {/* {showModal && ( */}
          <ClientOnlyPortal selector={"#modal"}>
            <Overlay
              show={showModal}
              handleShowOverlay={() => cancel}
              closeOnClick={disableOnClick}
              className="z-[999]"
            />
            <Media queries={{ small: { maxWidth: 640 } }}>
              {(matches) => (
                <AnimatePresence>
                  {showModal && (
                    // <div className="relative w-full bg-red-400 h-full sm:w-fit sm:h-fit">
                    <motion.div
                      ref={modalRef as Ref<HTMLDivElement>}
                      className={clsx(
                        "bg-background fixed rounded w-full sm:w-fit z-[999] h-3/5 sm:h-auto bottom-0 sm:bottom-auto sm:-translate-x-1/2 sm:left-1/2 sm:-translate-y-1/2 sm:top-1/2 overflow-clip before:w-16 before:h-1 before:rounded-3xl before:bg-gray-200 before:mx-auto before:z-[1000] before:absolute before:inset-0 before:mt-3 md:before:hidden",
                        className
                      )}
                      transition={{ type: "keyframes", duration: 0.2 }}
                      initial={{
                        y: matches.small ? "100%" : 50,
                        opacity: matches.small ? 1 : 0,
                        left: "50%",
                        x: "-50%",
                      }}
                      animate={{
                        y: matches.small ? 0 : "-50%",
                        opacity: 1,
                        left: "50%",
                        x: "-50%",
                      }}
                      exit={{
                        y: matches.small ? "100%" : 50,
                        opacity: matches.small ? 1 : 0,
                        left: "50%",
                        x: "-50%",
                      }}
                      drag={matches.small ? "y" : false}
                      dragElastic={
                        {
                          // bottom: 0.5,
                          // top: 0.5,
                        }
                      }
                      dragDirectionLock={true}
                      dragConstraints={{ left: 0, right: 0, top: 0 }}
                      onDragEnd={(_, info) => {
                        const offset = info.offset.y;

                        if (offset > 100) {
                          cancel();
                        }
                      }}>
                      <div className="absolute z-[999] cursor-pointer right-3 top-3">
                        <button
                          onClick={() => {
                            cancel();
                          }}>
                          <X className="!stroke-gray-500 w-6 h-6" />
                        </button>
                      </div>
                      <div className="h-full pb-5 pt-6 sm:pt-0 sm:pb-0 flex flex-col">
                        {content ? (
                          content
                        ) : (
                          <div className="w-full justify-center overflow-y-auto !py-8 sm:pb-0 overscroll-none items-center sm:w-[60vw] lg:w-[30rem] mx-auto px-5">
                            <div>
                              {/* <figure
                                className={clsx(
                                  "w-12 h-12 rounded-full flex items-center justify-center bg-primary/10",
                                  type === "error" && "bg-red-400/10",
                                  type === "warning" && "bg-yellow-400/10",
                                )}
                              ></figure> */}
                            </div>
                            <div className="overflow-auto space-y-4 flex-1 pb-4">
                              <div>
                                <div className="font-bold text-2xl">
                                  {modalMessage?.title}
                                </div>
                                <div className={"break-word"}>
                                  {modalMessage?.text}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div
                          className={
                            "flex flex-col-reverse md:flex-row gap-2 md:gap-4 justify-around mt-auto w-[90%] mx-auto pb-12 sm:pb-4"
                          }>
                          {actionCancel && (
                            <Button
                              variant={"outline"}
                              className="text-primary"
                              onClick={() => {
                                cancel();
                              }}>
                              Cancel
                            </Button>
                          )}
                          {actionConfirm && (
                            <Button
                              className="w-full"
                              onClick={() => {
                                actionConfirm();
                                dispatch(closeModal());
                              }}>
                              Confirm
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    // </div>
                  )}
                </AnimatePresence>
              )}
            </Media>
            {/* </motion.div> */}
          </ClientOnlyPortal>
          {/* )} */}
        </>
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
}
