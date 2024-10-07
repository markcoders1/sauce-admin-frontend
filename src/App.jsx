import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
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
import BadgeManagement from "./Pages/BadgeManagement/BadgeManagement";
import AddBadge from "./Pages/AddBadge/AddBadge";
import EditBadge from "./Pages/EditBadge/EditBadge";
import StoreManagement from "./Pages/StoreManagement/StoreManagement";
import AddStore from "./Pages/AddStore/AddStore";
import EditStore from "./Pages/EditStore/EditStore";
import TextReviewManagement from "./Pages/UserReview/TextReviewManagement";
import UserCheckin from "./Pages/UserCheckin/UserCheckin";
import RequestedEvents from "./Pages/RequestedEvents/RequestedEvents";
import Notification from "./Pages/Notification/Notification";


import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase.config'; 



import ProtectedRoute from './Protected/Protected';
import StoreDetails from "./Pages/StoreDetails/StoreDetails";
// const vapid_key = import.meta.env.VAPID_KEY;



function App() {
  const vapi_key = "BCE44hN31r7lt-Hm50bFYkoVLvzb-KSEqMmXiHYqFC0ABFdqdKMCR1Zo6DG5dN2bW54V4-akw21gd3_xLX2xuI4"

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: vapi_key }); // Correct usage
        console.log('FCM Token:', token);
        // Send this token to your server to send notifications
      } else {
        console.log('Permission denied');
      }
    } catch (error) {
      console.error('Failed to get permission', error);
    }
  };

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker
  //     .register('/firebase-messaging-sw.js')  // This will serve the file from the public folder
  //     .then((registration) => {
  //       console.log('Service Worker registered with scope: ', registration.scope);
  //     })
  //     .catch((err) => {
  //       console.error('Service Worker registration failed: ', err);
  //     });
  // }
  useEffect(() => {
    requestNotificationPermission();
  }, []);
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
          <Route path="requested-events" element={<RequestedEvents />} />



          <Route path="badge-management" element={<BadgeManagement />} />
          <Route path="badge-management/add-badge" element={<AddBadge />} />
          <Route path="badge-management/edit-badge" element={<EditBadge />} />

          <Route path="store-management" element={<StoreManagement />} />
          <Route path="store-management/add-store" element={<AddStore />} />
          <Route path="store-management/edit-store/:id" element={<EditStore />} />
          <Route path="store-management/view-store/:id" element={<StoreDetails />} />
          <Route path="user-reviews/:id" element={<TextReviewManagement />} />
          <Route path="user-checkin/:id" element={<UserCheckin />} />
          <Route path="notification" element={<Notification />} />


          











        </Route>

        <Route path="*" element={<>Page Not Found</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
