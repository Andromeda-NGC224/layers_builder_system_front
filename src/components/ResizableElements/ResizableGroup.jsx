import { memo } from "react";
import { NodeResizer } from "@xyflow/react";

const ResizableGroup = ({ data, selected }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <div style={{ padding: 10 }}>{data.label}</div>
    </div>
  );
};

const MemoizedResizableGroup = memo(ResizableGroup);
export default MemoizedResizableGroup;
