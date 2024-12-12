import { Suspense } from "react";
import Loader from "../Loader/Loader.jsx";
import { Toaster } from "react-hot-toast";
import Header from "../Header/Header.jsx";

export default function Layout({ children }) {
  return (
    <Suspense fallback={<Loader />}>
      <Header />
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </Suspense>
  );
}
