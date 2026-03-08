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

export interface ObservationTable {
  id: string;
  title: string;
  columns: TableColumn[];
  numRows: number;
}

export interface ImageItem {
  id: string;
  file: File | null;
  preview: string | null;
  caption: string;
}

export type ContentItem = 
  | { type: "text"; id: string; section: string; content: string }
  | { type: "table"; id: string; data: ObservationTable }
  | { type: "image"; id: string; data: ImageItem };

export interface ExperimentData {
  title: string;
  content: ContentItem[];
}

// Legacy support
export interface LegacyExperimentData {
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
