import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDiagram, fetchAllDiagrams } from "../../redux/operations.js";
import { resetDiagrams } from "../../redux/diagramsSlice.js";
import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import {
  selectActiveDiagram,
  selectAllDiagrams,
} from "../../redux/selectors.js";

let nodeIdCounter = 1;
let edgeIdCounter = 1;
let groupIdCounter = 1;

const generateNodeId = () => `node-${nodeIdCounter++}`;
const generateEdgeId = () => `edge-${edgeIdCounter++}`;
const generateGroupId = () => `group-${groupIdCounter++}`;

const initialNodes = [];

const initialEdges = [];

export default function DiagramsPage() {
  const dispatch = useDispatch();
  const activeDiagram = useSelector(selectActiveDiagram);
  const allDiagrams = useSelector(selectAllDiagrams);
  console.log(allDiagrams);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    activeDiagram?.blocks || initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    activeDiagram?.connections || initialEdges
  );

  useEffect(() => {
    dispatch(resetDiagrams());
    const loadDiagrams = async () => {
      await dispatch(fetchAllDiagrams());
    };
    loadDiagrams();
  }, [dispatch]);

  useEffect(() => {
    if (allDiagrams.length > 0) {
      const firstDiagram = allDiagrams[0];
      setNodes(firstDiagram.blocks || initialNodes);
      setEdges(firstDiagram.connections || initialEdges);
    }
  }, [allDiagrams, setNodes, setEdges]);

  // useEffect(() => {
  //   if (activeDiagram?.id) {
  //     dispatch(
  //       updateDiagram({
  //         id: activeDiagram.id,
  //         blocks: nodes,
  //         connections: edges,
  //       })
  //     );
  //   }
  // }, [nodes, edges, activeDiagram?.id, dispatch]);

  const saveDiagram = useCallback(() => {
    const diagramData = {
      diagramName: `Diagram ${Date.now()}`,
      blocks: nodes,
      connections: edges,
    };

    dispatch(createDiagram(diagramData));
  }, [dispatch, nodes, edges]);

  const addNode = useCallback(() => {
    const newId = generateNodeId();
    const newNode = {
      id: newId,
      data: { label: `Node ${newId}` },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addGroup = useCallback(() => {
    const newGroupId = generateGroupId();
    const newGroup = {
      id: newGroupId,
      type: "group",
      data: { label: `Group ${newGroupId}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: {
        width: 200,
        height: 200,
        backgroundColor: "rgba(0, 128, 255, 0.2)",
      },
    };
    const childNodeId = generateNodeId();
    const childNode = {
      id: childNodeId,
      data: { label: `Node in ${newGroupId}` },
      position: { x: 10, y: 50 },
      parentId: newGroupId,
    };

    setNodes((nds) => [...nds, newGroup, childNode]);
  }, [setNodes]);

  const onConnect = useCallback(
    (connection) => {
      const newEdge = { ...connection, id: generateEdgeId() };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "94vh" }}>
      <h1>DiagramsPage</h1>
      <button
        onClick={addNode}
        style={{ position: "absolute", zIndex: 10, top: 10, left: 10 }}
      >
        Add Node
      </button>
      <button
        onClick={addGroup}
        style={{ position: "absolute", zIndex: 10, top: 10, left: 100 }}
      >
        Add Group
      </button>
      <button
        onClick={saveDiagram}
        style={{ position: "absolute", zIndex: 10, top: 10, left: 200 }}
      >
        Save Diagram
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
