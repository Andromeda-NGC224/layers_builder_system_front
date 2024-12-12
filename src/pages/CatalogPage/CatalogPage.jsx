import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetDiagrams } from "../../redux/diagramsSlice.js";
import { createDiagram, fetchAllDiagrams } from "../../redux/operations.js";
import { selectAllDiagrams } from "../../redux/selectors.js";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import css from "./CatalogPage.module.css";
import { FaProjectDiagram } from "react-icons/fa";
import ModalForm from "../../components/ModalForm/ModalForm.jsx";

export default function CatalogPage() {
  const dispatch = useDispatch();
  const allDiagrams = useSelector(selectAllDiagrams);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadDiagrams = async () => {
      await dispatch(resetDiagrams());
      await dispatch(fetchAllDiagrams());
    };
    loadDiagrams();
  }, [dispatch]);

  const createNewDiagram = useCallback(
    (diagramName) => {
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
        diagramName: diagramName || `Diagram ${Date.now()}`,
        blocks: initialNodes,
        connections: [],
      };
      dispatch(createDiagram(diagramData));
    },
    [dispatch]
  );

  return (
    <div className={css.mainContainer}>
      <div className={css.containerTitleAndBtn}>
        <div>
          <h1>There are all diagrams</h1>
          <h2>Select one of them to see the diagram</h2>
        </div>
        <button className={css.btnCreate} onClick={() => setIsModalOpen(true)}>
          Create a new Diagram
        </button>
      </div>
      <ul className={css.list}>
        {allDiagrams.map((diagram) => (
          <li className={css.listItem} key={diagram._id}>
            <FaProjectDiagram />
            <Link to={`/diagrams/${diagram._id}`}>{diagram.diagramName}</Link>
          </li>
        ))}
      </ul>
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createNewDiagram}
      />
    </div>
  );
}
