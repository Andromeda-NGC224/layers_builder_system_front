import { memo } from "react";
import { NodeResizer } from "@xyflow/react";

const ResizableGroup = ({ data, selected }) => {
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <div style={{ padding: 10 }}>{data.label}</div>
    </>
  );
};

const MemoizedResizableGroup = memo(ResizableGroup);
export default MemoizedResizableGroup;
