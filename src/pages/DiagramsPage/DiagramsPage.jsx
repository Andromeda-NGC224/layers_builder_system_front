import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDiagrams } from "../../redux/operations.js";
import { resetDiagrams } from "../../redux/diagramsSlice.js";
import "@xyflow/react/dist/style.css";
import { selectAllDiagrams } from "../../redux/selectors.js";
import DiagramsList from "../../components/DiagramsList/DiagramsList.jsx";
import AsideNavigation from "../../components/AsideNavigation/AsideNavigation.jsx";

import css from "./DiagramsPage.module.css";

export default function DiagramsPage() {
  const dispatch = useDispatch();
  const allDiagrams = useSelector(selectAllDiagrams);
  const nodes = useSelector(
    (state) => state.diagrams.diagrams[0]?.blocks || []
  );
  console.log(allDiagrams);

  useEffect(() => {
    const loadDiagrams = async () => {
      await dispatch(resetDiagrams());
      await dispatch(fetchAllDiagrams());
    };
    loadDiagrams();
  }, [dispatch]);

  return (
    <div className={css.mainContainer}>
      <AsideNavigation nodes={nodes} />
      <div className={css.diagramContainer}>
        <DiagramsList allDiagrams={allDiagrams} />
      </div>
    </div>
  );
}
