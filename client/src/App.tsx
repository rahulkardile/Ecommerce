import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./Components/Header";
import Loader from "./Components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addUser, initialStates, noUser } from "./redux/Slices/UserSlice";
import Protected from "./Components/Protected";
import ProtectedPage from "./pages/Protected";
import Profile from "./pages/Profile";
import { useAllProductsQuery } from "./redux/API/Product";
import ListProduct from "./pages/ListProduct";
import NotFound from "./pages/NotFound";

const Search = lazy(() => import("./pages/Search"));
const About = lazy(() => import("./pages/About"));
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Order = lazy(() => import("./pages/Order"));
const CheckOut = lazy(() => import("./pages/CheckOut"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Shipping = lazy(() => import("./pages/Shipping"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));

// Admin Routes
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const CheckLogin = async () => {
      try {
        const res = await fetch("/api/user/is-login");
        const data = await res.json();

        if (data.success === true) {
          dispatch(addUser(data.user));
          console.log(data);
        } else {
          dispatch(noUser());
        }
      } catch (error) {
        console.log(error);
      }
    };

    CheckLogin();
  }, []);

  const { user, loading } = useSelector(
    (state: { UserSlices: initialStates }) => state.UserSlices
  );
  console.log(user);

  return (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/list-Product" element={<ListProduct />} />
          <Route path="/protected" element={<ProtectedPage />} />

          {/* login user Routes */}
          <Route
            element={
              <Protected
                isAuthenticated={user ? true : false}
                redirect="/login"
              />
            }
          >
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shipping" element={<Shipping />} />
          </Route>
            <Route path="/pay" element={<CheckOut />} />

          {/* Admin Routes */}
          <Route
            element={
              <Protected
                isAuthenticated={user?.email ? true : false}
                adminOnly={true}
                admin={user?.role === "admin" ? true : false}
                redirect="/protected"
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
