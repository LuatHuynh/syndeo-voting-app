import { createBrowserRouter } from "react-router-dom";
import { getBasePath } from "@/utils/zma";
import PaddleApp from "@/pages/paddle";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <PaddleApp />,
    },
  ],
  { basename: getBasePath() },
);

export default router;
