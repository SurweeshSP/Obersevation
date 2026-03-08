export interface SubColumn {
  id: string;
  name: string;
  unit: string;
}

export interface TableColumn {
  id: string;
  type: "column" | "group";
  name: string;
  unit?: string;
  subColumns?: SubColumn[];
}

export interface ExperimentData {
  title: string;
  aim: string;
  apparatus: string;
  procedure: string;
  diagramFile: File | null;
  diagramPreview: string | null;
  columns: TableColumn[];
  numRows: number;
  result: string;
}
