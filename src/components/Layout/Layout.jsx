import { Suspense } from "react";
import Loader from "../Loader/Loader.jsx";

export default function Layout({ children }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}
