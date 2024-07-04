import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from "./components/login/LoginForm";
import CategoryForm from "./components/Categeory/AddCategeoryForm";
import CategoryControl from "./components/Categeory/CategoryControl";
import CategoryEditForm from "./components/Categeory/CategoryEditForm";
import TopNavBar from "./components/AA-Shop-Home/TopNavBar.jsx";
import Hero from "./components/AA-Shop-Home/Home.jsx";
import Footer from "./components/AA-Shop-Home/Footer.jsx";
import Item from "./components/AA-Shop-Home/Item.jsx";
import AddProduct from "./components/Product/AddProduct.jsx";
import ProductControl from "./components/Product/ProductControl.jsx";
import CustomerProduct from "./components/AA-Shop-Home/Customers/CustomerProducts.jsx";

import UserSignUp from "./components/AA-Shop-Home/usersignup/UserSignUpForm.jsx";
import UserControl from "./components/AA-Shop-Home/users/UserControl.jsx";
import AddUserAdmin from "./components/AA-Shop-Home/users/AddUserAdmin.jsx";
import WishlistPage from "./components/AA-Shop-Home/Customers/WishlistPage.jsx";
import CartPage from "./components/AA-Shop-Home/Customers/CartPage.jsx";
import ProductDetails from "./components/AA-Shop-Home/Customers/ProductDetails.jsx";
import EkartDashboard from "./components/Admin/EkartDashboard.jsx";
import EditUserForm from "./components/AA-Shop-Home/users/EditUserForm.jsx";
import ContactForm from "./components/AA-Shop-Home/Customers/ContactForm.jsx";
import ContactControl from "./components/contacts/ContactControl.jsx";
import ProductEditForm from "./components/Product/ProductEditForm.jsx";
import EditProfile from "./components/AA-Shop-Home/Customers/EditProfile.jsx";
import Payment from "./components/AA-Shop-Home/payment/PayMent.jsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          index
          element={[<TopNavBar />, <Hero />, <Item />, <Footer />]}
        />

        <Route path="login" element={<LoginForm />} />

        <Route path="user_signup" element={<UserSignUp />} />

        <Route path="ekart/users" element={<UserControl />} />

        <Route path="ekart/users/edit/:id" element={<EditUserForm />} />

        <Route
          path="contact"
          element={[<TopNavBar />, <ContactForm />, <Footer />]}
        />

        <Route path="ekart/admin/dashboard" element={<EkartDashboard />} />

        <Route path="ekart/Categeorys" element={<CategoryControl />} />
        <Route path="ekart/addcategeory" element={<CategoryForm />} />
        <Route path="ekart/categeory/edit/:id" element={<CategoryEditForm />} />

        <Route path="ekart/addproduct" element={<AddProduct />} />
        <Route path="ekart/products" element={<ProductControl />} />
        <Route path="ekart/product/edit/:id" element={<ProductEditForm />} />

        <Route
          path="products"
          element={[<TopNavBar />, <CustomerProduct />, <Footer />]}
        />

        <Route path="addadmin" element={<AddUserAdmin />} />

        <Route
          path="wishlist"
          element={[<TopNavBar />, <WishlistPage />, <Footer />]}
        />
        <Route
          path="/cart"
          element={[<TopNavBar />, <CartPage />, <Footer />]}
        />

        <Route
          path="/product/details/:productId"
          element={[<TopNavBar />, <ProductDetails />, <Footer />]}
        />

        <Route path="ekart/enquirys" element={<ContactControl />} />

        <Route path="payment-success" element={[<TopNavBar />,<Payment />]} />

        <Route
          path="edit/profile/:id"
          element={[<TopNavBar />, <EditProfile />]}
        />
      </Route>
      
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
