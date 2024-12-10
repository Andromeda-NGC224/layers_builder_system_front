import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateDiagram } from "../../redux/operations.js";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import MemoizedResizableNode from "../ResizableElements/ResizableNode.jsx";
import MemoizedResizableGroup from "../ResizableElements/ResizableGroup.jsx";

const nodeTypes = {
  resizableNode: MemoizedResizableNode,
  resizableGroup: MemoizedResizableGroup,
};

export default function DiagramsList({ allDiagrams }) {
  const dispatch = useDispatch();
  const [selectedGroup, setSelectedGroup] = useState(null);

  const counterRef = useRef({
    node: Date.now(),
    edge: Date.now(),
    group: Date.now(),
  });

  const generateNodeId = () => `node-${counterRef.current.node++}`;
  const generateEdgeId = () => `edge-${counterRef.current.edge++}`;
  const generateGroupId = () => `group-${counterRef.current.group++}`;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onSelectionChange = useCallback((selection) => {
    if (!selection.nodes.length) {
      setSelectedGroup(null);
      return;
    }

    const selectedNode = selection.nodes[0];
    if (
      selectedNode.type === "group" ||
      selectedNode.type === "resizableGroup"
    ) {
      setSelectedGroup(selectedNode.id);
    } else {
      setSelectedGroup(null);
    }
  }, []);

  useEffect(() => {
    if (allDiagrams.length > 0) {
      const firstDiagram = allDiagrams[0];
      setNodes(firstDiagram.blocks || []);
      setEdges(firstDiagram.connections || []);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [allDiagrams, setNodes, setEdges]);

  const updateDiagramHandler = useCallback(() => {
    const diagramData = {
      diagramName: allDiagrams[0].diagramName || `Diagram ${Date.now()}`,
      blocks: nodes,
      connections: edges,
    };
    const diagramId = allDiagrams[0]._id;
    dispatch(updateDiagram({ id: diagramId, diagramData }));
  }, [allDiagrams, nodes, edges, dispatch]);

  const addNode = useCallback(() => {
    const newId = generateNodeId();
    const newNode = {
      id: newId,
      type: "resizableNode",
      data: { label: `Node ${newId}` },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addGroup = useCallback(() => {
    const newGroupId = generateGroupId();
    const newGroup = {
      id: newGroupId,
      type: "resizableGroup",
      data: { label: `Group ${newGroupId}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: {
        width: 200,
        height: 200,
        backgroundColor: "rgba(0, 128, 255, 0.2)",
      },
      draggable: true,
      selectable: true,
      resizing: true,
    };

    setNodes((nds) => [...nds, newGroup]);
  }, [setNodes]);

  const addNodeToGroup = useCallback(() => {
    if (!selectedGroup) {
      alert("First choose a group!");
      return;
    }
    const parentExists = nodes.some((node) => node.id === selectedGroup);
    if (!parentExists) {
      alert("The selected group does not exist!");
      return;
    }

    const childNodeId = generateNodeId();
    const childNode = {
      id: childNodeId,
      type: "resizableNode",
      data: { label: `Node ${childNodeId}` },
      position: { x: 50, y: 50 },
      parentId: selectedGroup,
      extent: "parent",
      draggable: true,
      selectable: true,
    };

    setNodes((nds) => {
      const parentIndex = nds.findIndex((n) => n.id === selectedGroup);
      if (parentIndex === -1) return nds;

      const newNodes = [...nds];
      newNodes.splice(parentIndex + 1, 0, childNode);
      return newNodes;
    });
  }, [selectedGroup, nodes, setNodes]);

  const addNestedGroup = useCallback(() => {
    if (!selectedGroup) {
      alert("Select the parent group first!");
      return;
    }

    const parentExists = nodes.some((node) => node.id === selectedGroup);
    if (!parentExists) {
      alert("The selected group does not exist!");
      return;
    }

    const newGroupId = generateGroupId();
    const nestedGroup = {
      id: newGroupId,
      type: "resizableGroup",
      data: { label: `Group ${newGroupId}` },
      position: { x: 40, y: 40 },
      parentId: selectedGroup,
      extent: "parent",
      style: {
        width: 180,
        height: 180,
        backgroundColor: "rgba(255, 128, 0, 0.2)",
        padding: 10,
      },
      draggable: true,
      selectable: true,
    };

    setNodes((nds) => {
      const parentIndex = nds.findIndex((n) => n.id === selectedGroup);
      if (parentIndex === -1) return nds;

      const newNodes = [...nds];
      newNodes.splice(parentIndex + 1, 0, nestedGroup);
      return newNodes;
    });
  }, [selectedGroup, nodes, setNodes]);

  const onConnect = useCallback(
    (connection) => {
      const newEdge = { ...connection, id: generateEdgeId() };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 10,
          left: 10,
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={addNode}>Add Node</button>
        <button onClick={addGroup}>Add Group</button>
        <button
          onClick={addNodeToGroup}
          style={{ opacity: selectedGroup ? 1 : 0.5 }}
          disabled={!selectedGroup}
        >
          Add Node to Group
        </button>
        <button
          onClick={addNestedGroup}
          style={{ opacity: selectedGroup ? 1 : 0.5 }}
          disabled={!selectedGroup}
        >
          Add Nested Group
        </button>
        <button onClick={updateDiagramHandler}>Update Diagram</button>
      </div>

      {selectedGroup && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: 50,
            right: 10,
            padding: "5px 10px",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
          }}
        >
          Selected Group: {selectedGroup}
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        selectNodesOnDrag={false}
        fitView
        style={{ backgroundColor: "#F7F9FB" }}
      >
        <MiniMap />
        <Controls />
        <Background color="#E6E6E6" />
      </ReactFlow>
    </div>
  );
}
