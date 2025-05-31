import MainPage from "../pages/MainPage/MainPage";
import GamePage from "../pages/GamePage/GamePage";
import paths from "./paths";

export const routesConfig = [
  {
    path: paths.index,
    component: MainPage,
    requiresAuth: true,
  },
  {
    path: paths.game,
    component: GamePage,
    requiresAuth: false,
  },
];
