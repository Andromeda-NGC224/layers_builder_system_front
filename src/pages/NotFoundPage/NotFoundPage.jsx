import { Link } from "react-router-dom";
import css from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={css.notFoundPage}>
      <h3 className={css.notFoundPageTitle}>
        Sorry, but this page does not exist!
      </h3>
      <Link to="/" className={css.notFoundPageLink}>
        Go to the home page.
      </Link>
    </div>
  );
}
