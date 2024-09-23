export type RecordModel = {
  data: RecordItemModel;
  tree_index: number;
  root: string;
  proof: string[];
};

export type RecordItemModel = {
  title: string;
  name: string;
  issueDate: string;
  address: string;
  issuerAddress: string;
  description: string;
};
