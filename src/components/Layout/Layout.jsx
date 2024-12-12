import { Suspense } from "react";
import Loader from "../Loader/Loader.jsx";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {
  return (
  <Suspense fallback={<Loader />}>
    {children}
    <Toaster position="top-center" reverseOrder={false} />
  </Suspense>);
}
