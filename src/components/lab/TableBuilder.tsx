import { Plus, Columns3, GripVertical, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { TableColumn, SubColumn } from "@/types/experiment";
import TablePreview from "./TablePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  columns: TableColumn[];
  numRows: number;
  onColumnsChange: (cols: TableColumn[]) => void;
  onNumRowsChange: (n: number) => void;
}

const genId = () => Math.random().toString(36).slice(2, 9);

const TableBuilder = ({ columns, numRows, onColumnsChange, onNumRowsChange }: Props) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const addColumn = () => {
    onColumnsChange([...columns, { id: genId(), type: "column", name: "", unit: "" }]);
  };

  const addGroup = () => {
    const id = genId();
    onColumnsChange([...columns, { id, type: "group", name: "", subColumns: [] }]);
    setExpandedGroups((prev) => new Set(prev).add(id));
  };

  const addSubColumn = (groupId: string) => {
    onColumnsChange(
      columns.map((c) =>
        c.id === groupId && c.type === "group"
          ? { ...c, subColumns: [...(c.subColumns || []), { id: genId(), name: "", unit: "" }] }
          : c
      )
    );
  };

  const updateColumn = (id: string, field: string, value: string) => {
    onColumnsChange(columns.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const updateSubColumn = (groupId: string, subId: string, field: string, value: string) => {
    onColumnsChange(
      columns.map((c) =>
        c.id === groupId && c.type === "group"
          ? {
              ...c,
              subColumns: c.subColumns?.map((s) => (s.id === subId ? { ...s, [field]: value } : s)),
            }
          : c
      )
    );
  };

  const removeColumn = (id: string) => {
    onColumnsChange(columns.filter((c) => c.id !== id));
  };

  const removeSubColumn = (groupId: string, subId: string) => {
    onColumnsChange(
      columns.map((c) =>
        c.id === groupId && c.type === "group"
          ? { ...c, subColumns: c.subColumns?.filter((s) => s.id !== subId) }
          : c
      )
    );
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const moveColumn = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= columns.length) return;
    const newCols = [...columns];
    [newCols[index], newCols[newIndex]] = [newCols[newIndex], newCols[index]];
    onColumnsChange(newCols);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={addColumn} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Column
        </Button>
        <Button onClick={addGroup} size="sm" variant="outline" className="gap-1.5">
          <Columns3 className="h-4 w-4" /> Add Column Group
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted-foreground">Rows:</span>
          <Input
            type="number"
            min={1}
            max={50}
            value={numRows}
            onChange={(e) => onNumRowsChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column Structure */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Table Structure</h4>
          {columns.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border py-16 flex flex-col items-center gap-2 text-muted-foreground">
              <Columns3 className="h-10 w-10 opacity-40" />
              <p className="font-medium">No columns added yet</p>
              <p className="text-xs">Click "Add Column" or "Add Column Group" to start</p>
            </div>
          ) : (
            <div className="space-y-2">
              {columns.map((col, idx) => (
                <div key={col.id} className="rounded-lg border border-border bg-card shadow-sm">
                  <div className="flex items-center gap-2 p-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveColumn(idx, -1)}
                        disabled={idx === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                      >
                        <GripVertical className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveColumn(idx, 1)}
                        disabled={idx === columns.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                      >
                        <GripVertical className="h-3 w-3" />
                      </button>
                    </div>

                    {col.type === "group" && (
                      <button onClick={() => toggleGroup(col.id)} className="text-muted-foreground">
                        {expandedGroups.has(col.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )}

                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      col.type === "group" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {col.type === "group" ? "Group" : "Col"}
                    </span>

                    <Input
                      value={col.name}
                      onChange={(e) => updateColumn(col.id, "name", e.target.value)}
                      placeholder={col.type === "group" ? "Group name" : "Column name"}
                      className="flex-1 h-8 text-sm"
                    />
                    {col.type === "column" && (
                      <Input
                        value={col.unit || ""}
                        onChange={(e) => updateColumn(col.id, "unit", e.target.value)}
                        placeholder="Unit"
                        className="w-24 h-8 text-sm"
                      />
                    )}
                    <button
                      onClick={() => removeColumn(col.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sub columns */}
                  {col.type === "group" && expandedGroups.has(col.id) && (
                    <div className="border-t border-border bg-muted/20 p-3 pl-12 space-y-2">
                      {col.subColumns?.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                            Sub
                          </span>
                          <Input
                            value={sub.name}
                            onChange={(e) => updateSubColumn(col.id, sub.id, "name", e.target.value)}
                            placeholder="Sub-column name"
                            className="flex-1 h-8 text-sm"
                          />
                          <Input
                            value={sub.unit}
                            onChange={(e) => updateSubColumn(col.id, sub.id, "unit", e.target.value)}
                            placeholder="Unit"
                            className="w-24 h-8 text-sm"
                          />
                          <button
                            onClick={() => removeSubColumn(col.id, sub.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <Button
                        onClick={() => addSubColumn(col.id)}
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-xs h-7"
                      >
                        <Plus className="h-3 w-3" /> Add Sub Column
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Preview</h4>
          <div className="rounded-xl border-2 border-dashed border-border p-4 min-h-[200px]">
            <TablePreview columns={columns} numRows={numRows} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableBuilder;
