import { useDispatch, useSelector } from "react-redux";
import "@xyflow/react/dist/style.css";

import DiagramsFolder from "../../components/DiagramsFolder/DiagramsFolder.jsx";
import AsideNavigation from "../../components/AsideNavigation/AsideNavigation.jsx";

import css from "./DiagramsPage.module.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { resetDiagrams } from "../../redux/diagramsSlice.js";
import { fetchOneDiagram } from "../../redux/operations.js";

export default function DiagramsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(resetDiagrams());
    dispatch(fetchOneDiagram(id));
  }, [dispatch, id]);

  const nodes = useSelector(
    (state) => state.diagrams.diagrams[0]?.blocks || []
  );

  return (
    <div className={css.mainContainer}>
      <AsideNavigation nodes={nodes} />
      <div className={css.diagramContainer}>
        <DiagramsFolder />
      </div>
    </div>
  );
}
