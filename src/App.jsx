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

function App() {
  return (
    <BrowserRouter>
      <Routes>

      <Route path='/' element={<LayoutAuth />}>
              <Route path='' element={<SignIn />} />
              <Route path='forget-password' element={<ForgetPassword />} />

              
            </Route>

        <Route path='/' element={<DashboardLayout />}>
          <Route index element={<UserManagement />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="sauce-management" element={<SauceManagement />} />
          <Route path="add-sauce" element={<AddSauce />} />
          <Route path="brand-management" element={<BrandManagement />} />
          <Route path="taboo-management/:id" element={<TabooManagement />} />
          <Route path="add-brand-sauce" element={<AddBrandSauce />} />
          <Route path="events-management" element={<EventsManagement />} />
          <Route path="add-event" element={<AddEvent />} />
          <Route path="add-brand" element={<AddBrand />} />
          <Route path="add-specific-sauce" element={<AddSpecificSauce />} />
          <Route path="edit-brand-details/:id" element={<EditBrandDetails />} />
          <Route path="edit-event-details/:id" element={<EditEvents />} />



        </Route>
        <Route path="*" element={<>Page Not Found</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;





// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import React, { Suspense } from "react";
// import PageLoader from "./Components/Loader/PageLoader";

// const DashboardLayout = React.lazy(() => import('./Layout/DashboardLayout'));
// const UserManagement = React.lazy(() => import('./Pages/UserManagement/UserManagement'));
// const SauceManagement = React.lazy(() => import('./Pages/SauceManagement/SauceManagement'));
// const AddSauce = React.lazy(() => import('./Pages/AddSauce/AddSauce'));
// const BrandManagement = React.lazy(() => import('./Pages/BrandManagement/BrandManagement'));
// const TabooManagement = React.lazy(() => import('./Pages/TabooManagement/TabooManagement'));
// const AddBrandSauce = React.lazy(() => import('./Pages/AddBrandSauce/AddBrandSauce'));
// const EventsManagement = React.lazy(() => import('./Pages/EventsManagement/EventsManagement'));
// const AddEvent = React.lazy(() => import('./Pages/AddEvent/AddEvent'));

// function App() {
//   return (
//     <BrowserRouter>
//       <Suspense fallback={<PageLoader />}>
//         <Routes>
//           <Route path='/' element={<DashboardLayout />}>
//             <Route index element={<UserManagement />} />
//             <Route path="user-management" element={<UserManagement />} />
//             <Route path="sauce-management" element={<SauceManagement />} />
//             <Route path="add-sauce" element={<AddSauce />} />
//             <Route path="brand-management" element={<BrandManagement />} />
//             <Route path="taboo-management" element={<TabooManagement />} />
//             <Route path="add-brand-sauce" element={<AddBrandSauce />} />
//             <Route path="events-management" element={<EventsManagement />} />
//             <Route path="add-event" element={<AddEvent />} />
//           </Route>
//           <Route path="*" element={<>Page Not Found</>} />
//         </Routes>
//       </Suspense>
//     </BrowserRouter>
//   );
// }

// export default App;

