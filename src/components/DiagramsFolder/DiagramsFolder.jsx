import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { selectAllDiagrams } from "../../redux/selectors.js";

const nodeTypes = {
  resizableNode: MemoizedResizableNode,
  resizableGroup: MemoizedResizableGroup,
};

export default function DiagramsFolder() {
  const dispatch = useDispatch();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const currentDiagrama = useSelector(selectAllDiagrams);
  console.log(currentDiagrama);

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

  const handleNodeSelection = useCallback((selection) => {
    const selectedNode = selection.nodes[0];
    setSelectedNode(selectedNode);
  }, []);

  useEffect(() => {
    if (currentDiagrama.length > 0) {
      setNodes(currentDiagrama[0].blocks || []);
      setEdges(currentDiagrama[0].connections || []);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentDiagrama, setNodes, setEdges]);

  const updateDiagramHandler = useCallback(() => {
    const diagramData = {
      diagramName: currentDiagrama[0].diagramName || `Diagram ${Date.now()}`,
      blocks: nodes,
      connections: edges,
    };
    const diagramId = currentDiagrama[0]._id;
    console.log(diagramId);

    dispatch(updateDiagram({ id: diagramId, diagramData }));
  }, [currentDiagrama, nodes, edges, dispatch]);

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

  const deleteSelectedItem = useCallback(() => {
    if (!selectedGroup && !selectedNode) {
      alert("Select an item to delete!");
      return;
    }

    const idsToDelete = new Set(selectedNode);

    if (selectedGroup) {
      idsToDelete.add(selectedGroup);
    }

    if (selectedNode) {
      idsToDelete.add(selectedNode.id);
    }

    setNodes((nds) => nds.filter((node) => node.id !== selectedGroup));
    setEdges((eds) =>
      eds.filter(
        (edge) => edge.source !== selectedGroup && edge.target !== selectedGroup
      )
    );

    setSelectedGroup(null);
    setSelectedNode(null);
  }, [selectedGroup, selectedNode, setNodes, setEdges]);

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
        <button onClick={deleteSelectedItem}>Delete selected item</button>
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
