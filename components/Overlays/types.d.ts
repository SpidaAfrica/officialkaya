// MODAL
type ModalState = {
  showModal: boolean;
  modalMessage?: {
    title: string | React.ReactNode;
    text: string | React.ReactNode;
    icon?: React.FC<React.SVGProps<SVGElement>>;
  };
  actionConfirm?(): void;
  actionCancel?(): void;
  disableOnClick: boolean;
  content?: React.ReactNode | JSX.Element;
  className?: string;
  // type?: "info" | "error" | "warning" | "success";
};

type TriggerModal = {
  message?: ModalState["modalMessage"];
  confirm?(): void;
  cancel?(): void;
  clickToDisable?: boolean;
  show?: boolean;
  // type?: ModalState["type"];
  content?: ModalState["content"];
  className?: string;
};

type TriggerNotification = {
  message?: string | React.ReactNode;
  show?: boolean;
  type?: ModalState["type"];
  icon?: React.FC<React.SVGProps<SVGElement>>;
};

// NOTIFICATION
type NotificationState = TriggerNotification;
