import { Link } from "react-router-dom";
import css from "./Hero.module.css";

export const Hero = () => {
  return (
    <div className={css.hero}>
      <div className={css.overlay}></div>
      <h1 className={css.title}>Layers Builder System of your dreams</h1>
      <h2 className={css.subtitle}>
        You can save everything you want in our Canvas Layers View.
      </h2>

      <Link className={css.btnAuth} to="/diagrams">
        Go to your layers
      </Link>
    </div>
  );
};
