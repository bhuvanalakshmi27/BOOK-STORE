import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Components/Home';
import PrivateRoute from './Components/PrivateRoute';
import AdminOrders from './Components/AdminOrders';

import Login from './User/Login';
import Signup from './User/Signup';
import Uhome from './User/Uhome';
import Products from './User/Products';
import Uitem from './User/Uitem';
import MyOrders from './User/MyOrders';
import OrderDetail from './User/OrderDetail';

import Slogin from './Seller/Slogin';
import Ssignup from './Seller/Ssignup';
import Snavbar from './Seller/Snavbar';
import Shome from './Seller/Shome';
import Addbook from './Seller/Addbook';
import MyProducts from './Seller/MyProducts';
import Book from './Seller/Book';
import SellerOrders from './Seller/Orders';

import Alogin from './Admin/Alogin';
import Asignup from './Admin/Asignup';
import Anavbar from './Admin/Anavbar';
import Ahome from './Admin/Ahome';
import Users from './Admin/Users';
import Seller from './Admin/Seller';
import Items from './Admin/items';

const SellerLayout = ({ children }) => (
  <>
    <Snavbar />
    <main className="flex-grow-1">{children}</main>
  </>
);

const AdminLayout = ({ children }) => (
  <>
    <Anavbar />
    <main className="flex-grow-1">{children}</main>
  </>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Routes>
              {/* Public landing */}
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />

              {/* User public routes */}
              <Route path="/user/login" element={<><Navbar /><Login /><Footer /></>} />
              <Route path="/user/signup" element={<><Navbar /><Signup /><Footer /></>} />
              <Route path="/user/products" element={<><Navbar /><Products /><Footer /></>} />
              <Route path="/user/book/:id" element={<><Navbar /><Uitem /><Footer /></>} />

              {/* User protected routes */}
              <Route path="/user/home" element={
                <PrivateRoute role="user">
                  <Navbar /><Uhome /><Footer />
                </PrivateRoute>
              } />
              <Route path="/user/orders" element={
                <PrivateRoute role="user">
                  <Navbar /><MyOrders /><Footer />
                </PrivateRoute>
              } />
              <Route path="/user/orders/:id" element={
                <PrivateRoute role="user">
                  <Navbar /><OrderDetail /><Footer />
                </PrivateRoute>
              } />

              {/* Seller public routes */}
              <Route path="/seller/login" element={<><Navbar /><Slogin /><Footer /></>} />
              <Route path="/seller/signup" element={<><Navbar /><Ssignup /><Footer /></>} />

              {/* Seller protected routes */}
              <Route path="/seller/home" element={
                <PrivateRoute role="seller">
                  <SellerLayout><Shome /></SellerLayout><Footer />
                </PrivateRoute>
              } />
              <Route path="/seller/products" element={
                <PrivateRoute role="seller">
                  <SellerLayout><MyProducts /></SellerLayout><Footer />
                </PrivateRoute>
              } />
              <Route path="/seller/add-book" element={
                <PrivateRoute role="seller">
                  <SellerLayout><Addbook /></SellerLayout><Footer />
                </PrivateRoute>
              } />
              <Route path="/seller/book/:id" element={
                <PrivateRoute role="seller">
                  <SellerLayout><Book /></SellerLayout><Footer />
                </PrivateRoute>
              } />
              <Route path="/seller/orders" element={
                <PrivateRoute role="seller">
                  <SellerLayout><SellerOrders /></SellerLayout><Footer />
                </PrivateRoute>
              } />

              {/* Admin public routes */}
              <Route path="/admin/login" element={<><Navbar /><Alogin /><Footer /></>} />
              <Route path="/admin/signup" element={<><Navbar /><Asignup /><Footer /></>} />

              {/* Admin protected routes */}
              <Route path="/admin/home" element={
                <PrivateRoute role="admin">
                  <AdminLayout><Ahome /></AdminLayout><Footer />
                </PrivateRoute>
              } />
              <Route path="/admin/users" element={
                <PrivateRoute role="admin">
                  <AdminLayout><Users /></AdminLayout><Footer />
                </PrivateRoute>
              } />
              <Route path="/admin/sellers" element={
                <PrivateRoute role="admin">
                  <AdminLayout><Seller /></AdminLayout><Footer />
                </PrivateRoute>
              } />
              <Route path="/admin/books" element={
                <PrivateRoute role="admin">
                  <AdminLayout><Items /></AdminLayout><Footer />
                </PrivateRoute>
              } />
              <Route path="/admin/orders" element={
                <PrivateRoute role="admin">
                  <AdminLayout><AdminOrders /></AdminLayout><Footer />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
