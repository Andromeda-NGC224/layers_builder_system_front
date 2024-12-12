import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetDiagrams } from "../../redux/diagramsSlice.js";
import { createDiagram, fetchAllDiagrams } from "../../redux/operations.js";
import { selectAllDiagrams } from "../../redux/selectors.js";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function CatalogPage() {
  const dispatch = useDispatch();
  const allDiagrams = useSelector(selectAllDiagrams);
  console.log(allDiagrams);

  useEffect(() => {
    const loadDiagrams = async () => {
      await dispatch(resetDiagrams());
      await dispatch(fetchAllDiagrams());
    };
    loadDiagrams();
  }, [dispatch]);

  const createNewDiagram = useCallback(() => {
    const parentGroupId = `group-${uuidv4()}`;
const childGroup1Id = `group-${uuidv4()}`;
const childGroup2Id = `group-${uuidv4()}`;

    const initialNodes = [
      {
        id: parentGroupId,
        type: "resizableGroup",
        data: { label: `Main Group` },
        position: { x: 0, y: 0 },
        style: {
          width: "90vw",
          height: "90vh",
          backgroundColor: "rgba(0, 128, 255, 0.2)",
        },
        draggable: true,
        selectable: true,
      },
      {
        id: childGroup1Id,
        type: "resizableGroup",
        data: { label: `Strategy to Readiness` },
        position: { x: 20, y: 20 },
        parentId: parentGroupId,
        extent: "parent",
        style: {
          width: "48%",
          height: "85%",
          backgroundColor: "rgba(255, 128, 0, 0.2)",
        },
        draggable: true,
        selectable: true,
      },
      {
        id: childGroup2Id,
        type: "resizableGroup",
        data: { label: `Operetions` },
        position: { x: 60, y: 20 },
        parentId: parentGroupId,
        extent: "parent",
        style: {
          width: "48%",
          height: "85%",
          backgroundColor: "rgba(255, 128, 0, 0.2)",
        },
        draggable: true,
        selectable: true,
      },
    ];

    const diagramData = {
      diagramName: `Diagram ${Date.now()}`,
      blocks: initialNodes,
      connections: [],
    };
    dispatch(createDiagram(diagramData));
  }, [dispatch]);

  return (
    <div>
      <h1>There are all diagrams</h1>
      <h2>Select one of them to see the diagram</h2>
      <button onClick={createNewDiagram}>Create a new Diagram</button>
      <ul>
        {allDiagrams.map((diagram) => (
          <li key={diagram._id}>
            <Link to={`/diagrams/${diagram._id}`}>{diagram.diagramName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
