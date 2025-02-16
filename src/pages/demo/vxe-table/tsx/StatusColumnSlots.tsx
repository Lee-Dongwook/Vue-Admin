import type { VxeColumnPropTypes } from "vxe-table";

export const StatusColumnSlots: VxeColumnPropTypes.Slots = {
  default: ({ row, column }) => {
    const cellValue = row[column.field];
    const [type, value] = cellValue
      ? ["success", "success"]
      : ["danger", "danger"];
    return [
      <span class={`el-tag el-tag--${type} el-tag--plain`}>{value}</span>,
    ];
  },
};
