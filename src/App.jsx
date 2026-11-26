import { BrowserRouter, Routes, Route } from "react-router";
import CartProvider from "./context/CartProvider.jsx";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import VendorPage from "./pages/VendorPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import SeedPage from "./pages/SeedPage.jsx";
import BecomeVendorPage from "./pages/BecomeVendorPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="login" element={<LoginPage />} />
                            <Route path="register" element={<RegisterPage />} />
                            {/* Everything inside ProtectedRoute needs a signed-in user */}
                            <Route element={<ProtectedRoute />}>
                                <Route index element={<HomePage />} />
                                <Route path="vendor/:id" element={<VendorPage />} />
                                <Route path="cart" element={<CartPage />} />
                                <Route path="orders" element={<OrdersPage />} />
                                <Route path="become-vendor" element={<BecomeVendorPage />} />
                            </Route>

                            {/* Role-based routes */}
                            <Route element={<RoleRoute roles={["vendor"]} />}>
                                <Route path="dashboard" element={<DashboardPage />} />
                            </Route>
                            <Route element={<RoleRoute roles={["admin"]} />}>
                                <Route path="admin" element={<AdminPage />} />
                            </Route>
                            {import.meta.env.DEV && (
                                <Route element={<RoleRoute roles={["admin"]} />}>
                                    <Route path="seed" element={<SeedPage />} />
                                </Route>
                            )}

                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
