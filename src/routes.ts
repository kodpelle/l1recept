import type { JSX } from 'react';
import { createElement } from 'react';
// page components
import LoginPage from "./pages/LoginPage";
import registerPage from './pages/RegisterPage';
import RecipesListPage from './pages/RecipesListPage';

interface Route {
  element: JSX.Element;
  path: string;
  loader?: Function;
  menuLabel?: string;
  index?: number;
  parent?: string;
}


export default [
  LoginPage,
  registerPage,
  RecipesListPage
]
  // map the route property of each page component to a Route
  .map(x => (({ element: createElement(x), ...x.route }) as Route))
  // sort by index (and if an item has no index, sort as index 0)
  .sort((a, b) => (a.index || 0) - (b.index || 0));