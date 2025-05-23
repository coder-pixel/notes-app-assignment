// type for note document specifiying the properties
export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt?: Date;
  createdAt: Date;
  synced: boolean;
};
