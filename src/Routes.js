import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Skeleton,
  Stack,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
// import Loader from "shareComponent/Loader";
// import ProtectedRoutes from "routes/ProtectedRoutes"; //Authenticated routes
// import PublicRoute from "routes/PublicRoute";
// import PrivateRoute from "routes/PrivateRoute";
import LoginPage from "./Auth/SignIn";
import Dashboard from "./components/Dashboard";
import UserProfileEdit from "./profile";
import { Transactions } from "./components/Transactions";
import { SourceUpload } from "./components/SourceUpload";
import CoinDetails from "./components/CoinDetails";
import WalletApp from "./components/Wallet";

const SidebarWithHeader = lazy(() => import("./components/SideNavBar"));
// const LoginPage = lazy(() => import("./Auth/SignIn"));
const Register = lazy(() => import("./Auth/SignUp"));
// const ForgotPassword = lazy(() => import("components/ForgotPassword"));
// const NoFoundComponent = lazy(() => import("components/NoFoundComponent"));
export const isLogin = () => {
  if (localStorage.getItem("TOKEN_KEY")) {
    return true;
  }

  return false;
};
const PrivateRoute = ({ children }) => {
  const isAuthenticated = true;

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/" />;
};

const PublicRoute = ({ component: Element, restricted, ...rest }) => {
  const isAuthenticated = true;
  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? <Element /> : <Navigate replace to="/dashboard" />
      }
    />
  );
};
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const App = () => {
  const isAuthenticated = true;
  //   const isAuthenticated = getToken();

  return (
    <Router>
      <Suspense
        fallback={
          <Stack>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        }
      >
        <Routes>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/connectwallet" element={<WalletApp />} />

          <Route path="/signup" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/fileUpload" element={<SourceUpload />} />
          <Route path="/coindetails/:id/:quantity" element={<CoinDetails />} />

          <Route path="/profile" element={<UserProfileEdit />} />
          {/* <Route path="/" element={<SidebarWithHeader />} /> */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
          {/* <PublicRoute restricted={false} element={Register} path="/" />
          <PublicRoute restricted={true} element={LoginPage} path="/signin" />
          <PrivateRoute element={SidebarWithHeader} path="/dashboard" /> */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
