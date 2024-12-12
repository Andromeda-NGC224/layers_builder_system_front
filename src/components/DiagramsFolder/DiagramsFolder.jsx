import { useCallback, useEffect, useState } from "react";
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
import { selectAllDiagrams, selectError } from "../../redux/selectors.js";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import css from "./DiagramsFolder.module.css";

const nodeTypes = {
  resizableNode: MemoizedResizableNode,
  resizableGroup: MemoizedResizableGroup,
};

export default function DiagramsFolder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const currentDiagrama = useSelector(selectAllDiagrams);

  const error = useSelector(selectError);

  const generateNodeId = () => `node-${uuidv4()}`;
  const generateEdgeId = () => `edge-${uuidv4()}`;
  const generateGroupId = () => `group-${uuidv4()}`;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onSelectionChange = useCallback((selection) => {
    if (!selection.nodes.length) {
      setSelectedGroup(null);
      setSelectedNode(null);
      return;
    }

    const selectedNode = selection.nodes[0];
    if (
      selectedNode.type === "group" ||
      selectedNode.type === "resizableGroup"
    ) {
      setSelectedGroup(selectedNode.id);
      setSelectedNode(null);
    } else {
      setSelectedGroup(null);
      setSelectedNode(selectedNode.id);
    }
  }, []);

  useEffect(() => {
    if (error === "Rejected") {
      navigate("/diagrams");
    }
    if (currentDiagrama.length > 0) {
      setNodes(currentDiagrama[0].blocks || []);
      setEdges(currentDiagrama[0].connections || []);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentDiagrama, setNodes, setEdges, error, navigate]);

  const addNodeToGroup = useCallback(() => {
    const parentExists = nodes.some((node) => node.id === selectedGroup);
    if (!parentExists) {
      alert("The selected group does not exist!");
      return;
    }

    const childNodeId = generateNodeId();
    const childNode = {
      id: childNodeId,
      type: "resizableNode",
      data: { label: `Node ${childNodeId.slice(0, 10)}` },
      position: { x: 50, y: 50 },
      parentId: selectedGroup,
      extent: "parent",
      dimensions: {
        width: 150,
        height: 50,
      },
      style: {
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
      newNodes.splice(parentIndex + 1, 0, childNode);

      dispatch(
        updateDiagram({
          id: currentDiagrama[0]._id,
          diagramData: {
            diagramName:
              currentDiagrama[0].diagramName || `Diagram ${Date.now()}`,
            blocks: newNodes,
            connections: edges,
          },
        })
      );

      return newNodes;
    });
  }, [nodes, selectedGroup, setNodes, dispatch, currentDiagrama, edges]);

  const addNestedGroup = useCallback(() => {
    const parentExists = nodes.some((node) => node.id === selectedGroup);
    if (!parentExists) {
      alert("The selected group does not exist!");
      return;
    }

    const newGroupId = generateGroupId();
    console.log(newGroupId);

    const nestedGroup = {
      id: newGroupId,
      type: "resizableGroup",
      data: { label: `Group ${newGroupId.slice(0, 10)}` },
      position: { x: 40, y: 40 },
      parentId: selectedGroup,
      extent: "parent",
      dimensions: {
        width: 180,
        height: 180,
      },
      style: {
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

      dispatch(
        updateDiagram({
          id: currentDiagrama[0]._id,
          diagramData: {
            diagramName:
              currentDiagrama[0].diagramName || `Diagram ${Date.now()}`,
            blocks: newNodes,
            connections: edges,
          },
        })
      );

      return newNodes;
    });
  }, [selectedGroup, nodes, setNodes, edges, dispatch, currentDiagrama]);

  const deleteSelectedItem = useCallback(() => {
    if (!selectedGroup && !selectedNode) {
      alert("Select an item to delete!");
      return;
    }

    const collectIdsToDelete = (parentId) => {
      const idsToDelete = new Set();
      const stack = [parentId];

      while (stack.length > 0) {
        const currentId = stack.pop();
        idsToDelete.add(currentId);

        nodes.forEach((node) => {
          if (node.parentId === currentId) {
            stack.push(node.id);
          }
        });
      }

      return idsToDelete;
    };

    let idsToDelete;

    if (selectedGroup) {
      idsToDelete = collectIdsToDelete(selectedGroup);
    } else if (selectedNode) {
      idsToDelete = new Set([selectedNode]);
    }

    const updatedNodes = nodes.filter((node) => !idsToDelete.has(node.id));
    const updatedEdges = edges.filter(
      (edge) => !idsToDelete.has(edge.source) && !idsToDelete.has(edge.target)
    );

    setNodes(updatedNodes);
    setEdges(updatedEdges);

    setSelectedGroup(null);
    setSelectedNode(null);

    if (currentDiagrama.length > 0) {
      dispatch(
        updateDiagram({
          id: currentDiagrama[0]._id,
          diagramData: {
            diagramName:
              currentDiagrama[0].diagramName || `Diagram ${Date.now()}`,
            blocks: updatedNodes,
            connections: updatedEdges,
          },
        })
      );
    }
  }, [
    selectedGroup,
    selectedNode,
    nodes,
    edges,
    dispatch,
    currentDiagrama,
    setNodes,
    setEdges,
  ]);

  const onConnect = useCallback(
    (connection) => {
      const newEdge = { ...connection, id: generateEdgeId() };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  return (
    <div className={css.mainContainer}>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 108,
          right: 10,
          display: "flex",
          gap: "10px",
        }}
      >
        {selectedGroup && (
          <button className={css.btnAdd} onClick={addNodeToGroup}>
            Add Node to Group
          </button>
        )}
        {selectedGroup && (
          <button className={css.btnAdd} onClick={addNestedGroup}>
            Add Nested Group
          </button>
        )}
        {selectedGroup || selectedNode ? (
          <button className={css.btnDelete} onClick={deleteSelectedItem}>
            Delete selected item
          </button>
        ) : null}
      </div>

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
