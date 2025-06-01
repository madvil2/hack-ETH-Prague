import { Routes, Route, Navigate } from "react-router-dom";

import DefaultLayout from "@/components/DefaultLayout/DefaultLayout";
import { routesConfig } from "./routes/routesConfig";
import { WebSocketProvider } from "./context/WebSocketContext";
import { NitroliteClientWrapper } from "./context/NitroliteClientWrapper";

const App = () => {
  return (
    <WebSocketProvider>
      <NitroliteClientWrapper>
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
      </NitroliteClientWrapper>
    </WebSocketProvider>
  );
};

export default App;
