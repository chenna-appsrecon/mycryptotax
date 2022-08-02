import React from "react";
import { Route } from "react-router-dom";
import SidebarWithHeader from "../SideNavBar";

const DashboardLayout = ({ children }) => (
  <SidebarWithHeader>{children}</SidebarWithHeader>
);

const DashboardLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <DashboardLayout>
          <Component {...props} />
        </DashboardLayout>
      )}
    />
  );
};

export default DashboardLayoutRoute;
