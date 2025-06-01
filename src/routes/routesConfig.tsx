import MainPage from "../pages/MainPage/MainPage";
import GamePage from "../pages/GamePage/GamePage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import LevelEditorPage from "../pages/LevelEditorPage/LevelEditorPage";
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
  {
    path: paths.settings,
    component: SettingsPage,
    requiresAuth: false,
  },
  {
    path: paths.levelEditor,
    component: LevelEditorPage,
    requiresAuth: false,
  },
];
