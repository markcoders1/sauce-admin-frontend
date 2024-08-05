import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import PageLoader from "./Components/Loader/PageLoader";
// import Protected from './Protected/Protected';

const DashboardLayout = React.lazy(() => import('./Layout/DashboardLayout'));
const UserManagement = React.lazy(() => import('./Pages/UserManagement/UserManagement'));
const SauceManagement = React.lazy(() => import('./Pages/SauceManagement/SauceManagement'));
const AddSauce = React.lazy(() => import('./Pages/AddSauce/AddSauce'));
const BrandManagement = React.lazy(() => import('./Pages/BrandManagement/BrandManagement'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<DashboardLayout />}>
            <Route index element={<UserManagement />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="sauce-management" element={<SauceManagement />} />
            <Route path="add-sauce" element={<AddSauce />}/>
            <Route path="brand-management" element={<BrandManagement />}/>
          </Route>
          <Route path="*" element={<>Page Not Found</>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
