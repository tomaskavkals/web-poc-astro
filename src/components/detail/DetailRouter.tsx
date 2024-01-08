import {
  Link,
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
} from "@tanstack/react-router";

const DetailRouter = ({ basePath }: { basePath: string }) => {
  const rootRoute = new RootRoute({
    component: () => (
      <>
        <div className="flex gap-2 p-2">
          <Link
            to=""
            className="px-4 py-2 text-base text-gray-900 bg-gray-200 border-2 border-gray-300 border-solid rounded-md"
          >
            Summary
          </Link>
          <Link
            to="h2h"
            className="px-4 py-2 text-base text-gray-900 bg-gray-200 border-2 border-gray-300 border-solid rounded-md"
          >
            H2H
          </Link>
          <Link
            to="odds"
            className="px-4 py-2 text-base text-gray-900 bg-gray-200 border-2 border-gray-300 border-solid rounded-md"
          >
            Odds
          </Link>
        </div>
        <hr />
        <Outlet />
      </>
    ),
  });

  const summaryRoute = new Route({
    getParentRoute: () => rootRoute,
    path: `${basePath}/`,
    component: function Summary() {
      return (
        <div className="p-2">
          <h1 className="text-3xl">Summary tab</h1>
        </div>
      );
    },
  });

  const h2hRoute = new Route({
    getParentRoute: () => rootRoute,
    path: `${basePath}/h2h`,
    component: function H2H() {
      return (
        <div className="p-2">
          <h1 className="text-3xl">H2H tab</h1>
        </div>
      );
    },
  });

  const oddsRoute = new Route({
    getParentRoute: () => rootRoute,
    path: `${basePath}/odds`,
    component: function Odds() {
      return (
        <div className="p-2">
          <h1 className="text-3xl">Odds tab</h1>
        </div>
      );
    },
  });

  const routeTree = rootRoute.addChildren([summaryRoute, h2hRoute, oddsRoute]);

  const router = new Router({ routeTree });

  return <RouterProvider router={router} />;
};

export default DetailRouter;
