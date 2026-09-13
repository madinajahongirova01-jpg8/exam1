import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./Layout/Layout";

const About = lazy(() => import("./components/About"));
const Details = lazy(() => import("./Page/Details"));

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <About />
            </Suspense>
          ),
        },
     {
  path: "details/:id",
  element: <Details />,
}
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}