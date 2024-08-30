import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import PageLoader from "./Components/Loader/PageLoader";
import DashboardLayout from './Layout/DashboardLayout';
import UserManagement from './Pages/UserManagement/UserManagement';
import SauceManagement from './Pages/SauceManagement/SauceManagement';
import AddSauce from './Pages/AddSauce/AddSauce';
import BrandManagement from './Pages/BrandManagement/BrandManagement';
import TabooManagement from './Pages/TabooManagement/TabooManagement';
import AddBrandSauce from './Pages/AddBrandSauce/AddBrandSauce';
import EventsManagement from './Pages/EventsManagement/EventsManagement';
import AddEvent from './Pages/AddEvent/AddEvent';
import AddBrand from "./Pages/AddBrand/AddBrand";
import AddSpecificSauce from "./Pages/AddSpecificSauce/AddSpecificSauce";
import LayoutAuth from "./Layout/LayoutAuth";
import SignIn from "./PagesAuth/Login/Login";
import ForgetPassword from "./PagesAuth/ForgetPassword/ForgetPassword";
import EditBrandDetails from "./Pages/EditBrandDetails/EditBrandDetails";
import EditEvents from "./Pages/EditEvents/EditEvents";
import EditSauce from "./Pages/EditSauce/EditSauce";
import UserInterestedEvents from "./Pages/UserInterestedEvents/UserInterestedEvents";
import SeeEventsDetail from "./Pages/SeeEvents/SeeEventDetail";
import ReviewsManagement from "./Pages/ReviewsManagement/ReviewsManagement";
import RequestedSauce from "./Pages/RequestedSauce/RequestedSauce";





import ProtectedRoute from './Protected/Protected';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutAuth />}>
          <Route index element={<SignIn />} />
          <Route path="forget-password" element={<ForgetPassword />} />
        </Route>

        <Route
          path="admin"
          element={
            // <ProtectedRoute>
              <DashboardLayout />
            // {/* </ProtectedRoute> */}
          }
        >
          <Route index element={<UserManagement />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="sauce-management" element={<SauceManagement />} />
          <Route path="add-sauce" element={<AddSauce />} />
          <Route path="brand-management" element={<BrandManagement />} />
          <Route path="specific-brand-management/:id" element={<TabooManagement />} />
          <Route path="add-brand-sauce" element={<AddBrandSauce />} />
          <Route path="events-management" element={<EventsManagement />} />
          <Route path="add-event" element={<AddEvent />} />
          <Route path="add-brand" element={<AddBrand />} />
          <Route path="add-specific-sauce/:id" element={<AddSpecificSauce />} />
          <Route path="edit-brand-user-details/:id" element={<EditBrandDetails />} />
          <Route path="edit-event-details/:id" element={<EditEvents />} />
          <Route path="edit-sauce-details/:id" element={<EditSauce />} />
          <Route path="user-interested-events/:id" element={<UserInterestedEvents />} />
          <Route path="see-user-events/:id" element={<SeeEventsDetail />} />

          <Route path="reviews-management" element={<ReviewsManagement />} />
          <Route path="requested-sauce" element={<RequestedSauce />} />




        </Route>

        <Route path="*" element={<>Page Not Found</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
