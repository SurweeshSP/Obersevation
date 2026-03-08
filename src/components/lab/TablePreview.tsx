import { TableColumn } from "@/types/experiment";

interface Props {
  columns: TableColumn[];
  numRows: number;
}

const TablePreview = ({ columns, numRows }: Props) => {
  if (columns.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        Table preview will appear here
      </div>
    );
  }

  const hasGroups = columns.some((c) => c.type === "group");

  // Calculate total leaf columns
  const getLeafCount = (col: TableColumn) =>
    col.type === "group" && col.subColumns ? col.subColumns.length : 1;
  const totalCols = columns.reduce((sum, c) => sum + getLeafCount(c), 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          {/* Top header row */}
          <tr className="bg-primary/5">
            {columns.map((col) => (
              <th
                key={col.id}
                colSpan={getLeafCount(col)}
                rowSpan={col.type === "column" && hasGroups ? 2 : 1}
                className="border border-border px-3 py-2.5 text-foreground font-semibold text-center"
              >
                {col.name}
                {col.type === "column" && col.unit && (
                  <span className="text-muted-foreground font-normal ml-1">({col.unit})</span>
                )}
              </th>
            ))}
          </tr>
          {/* Sub-header row if groups exist */}
          {hasGroups && (
            <tr className="bg-primary/5">
              {columns.map((col) =>
                col.type === "group" && col.subColumns
                  ? col.subColumns.map((sub) => (
                      <th
                        key={sub.id}
                        className="border border-border px-3 py-2 text-foreground font-medium text-center text-xs"
                      >
                        {sub.name}
                        {sub.unit && (
                          <span className="text-muted-foreground font-normal ml-1">({sub.unit})</span>
                        )}
                      </th>
                    ))
                  : null
              )}
            </tr>
          )}
        </thead>
        <tbody>
          {Array.from({ length: numRows }).map((_, i) => (
            <tr key={i} className="hover:bg-muted/30">
              {Array.from({ length: totalCols }).map((_, j) => (
                <td key={j} className="border border-border px-3 py-2.5 text-center text-muted-foreground">
                  —
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePreview;
