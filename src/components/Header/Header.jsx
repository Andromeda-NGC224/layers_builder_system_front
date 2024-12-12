import { Link, NavLink } from "react-router-dom";
import css from "./Header.module.css";
import clsx from "clsx";

export default function Header() {
  const NavLinkStyle = ({ isActive }) => {
    return clsx(css.link, isActive && css.active);
  };

  return (
    <>
      <header className={css.header}>
        <Link to="/" className={css.logo}>
          <span className={css.logoPartFOLDER}>Layers</span>
          <span className={css.logoPartAPP}>Builder</span>
        </Link>

        <nav className={css.nav}>
          <ul className={css.list}>
            <li>
              <NavLink to="/" className={NavLinkStyle}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/diagrams" className={NavLinkStyle}>
                Catalog
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
