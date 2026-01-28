export type SavedLocation = {
  id: string;
  name: string;
  address: string;
  icon?: React.ReactNode;
  type?: "home" | "work" | "other";
};
