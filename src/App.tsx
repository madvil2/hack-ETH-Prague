import { Routes, Route, Navigate } from "react-router-dom";

import DefaultLayout from "@/components/DefaultLayout/DefaultLayout";
import { routesConfig } from "./routes/routesConfig";

const App = () => {
  return (
    <>
      <Routes>
        {routesConfig.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <DefaultLayout>
                <Component />
              </DefaultLayout>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
