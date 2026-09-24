import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import './index.css';

import Home from './pages/Home';
import CatalogCategory from './pages/CatalogCategory';
import CatalogEntity from './pages/CatalogEntity';
import OfficeDirectory from './pages/OfficeDirectory';
import SpecialtyDetail from './pages/SpecialtyDetail';
import Consultants from './pages/Consultants';
import ConsultantSpecialty from './pages/ConsultantSpecialty';
import ConsultantDetail from './pages/ConsultantDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import TrackRequest from './pages/TrackRequest';
import OfficeLogin from './pages/OfficeLogin';
import OfficeDashboard from './pages/OfficeDashboard';
import TypeInfo from './pages/TypeInfo';
import AdminDashboard from './pages/AdminDashboard';
import DashboardHub from './pages/DashboardHub';
import MyContracts from './pages/MyContracts';
import IncomingContracts from './pages/IncomingContracts';
import ContractShow from './pages/ContractShow';
import CreateContract from './pages/CreateContract';
import PaymentCheckout from './pages/PaymentCheckout';
import ProviderAccount from './pages/ProviderAccount';
import NafathVerify from './pages/NafathVerify';
import NafathWait from './pages/NafathWait';
import AdminHomepage from './pages/AdminHomepage';

// صفحة مؤقتة لكل ما لم يُحوَّل بعد — تعرض رابط للواجهة القديمة
import FallbackPage from './pages/FallbackPage';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* الكتالوج */}
                    <Route path="/catalog/:key" element={<CatalogCategory />} />
                    <Route path="/catalog/:key/:entityId" element={<CatalogEntity />} />

                    {/* المكاتب */}
                    <Route path="/offices/:type" element={<OfficeDirectory />} />
                    <Route path="/offices/:type/:specialty" element={<SpecialtyDetail />} />

                    {/* المستشارون */}
                    <Route path="/consultants" element={<Consultants />} />
                    <Route path="/consultants2" element={<Consultants />} />
                    <Route path="/consultants/specialty/:specialtyId" element={<ConsultantSpecialty />} />
                    <Route path="/consultants/:officeId" element={<ConsultantDetail />} />

                    {/* المصادقة */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* لوحات المستخدم */}
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/dashboard-hub" element={<DashboardHub />} />
                    <Route path="/requests/:requestId/track" element={<TrackRequest />} />

                    {/* المكاتب */}
                    <Route path="/office/login" element={<OfficeLogin />} />
                    <Route path="/office/register" element={<FallbackPage section="provider" />} />
                    <Route path="/office/dashboard" element={<OfficeDashboard />} />
                    <Route path="/:type-info" element={<TypeInfo />} />

                    {/* لوحات الإدارة */}
                    <Route path="/admin" element={<AdminDashboard page="overview" />} />
                    <Route path="/admin/requests" element={<AdminDashboard page="requests" />} />
                    <Route path="/admin/offices" element={<AdminDashboard page="offices" />} />
                    <Route path="/admin/users" element={<AdminDashboard page="users" />} />
                    <Route path="/admin/finance" element={<AdminDashboard page="finance" />} />
                    <Route path="/admin/pricing" element={<AdminDashboard page="pricing" />} />
                    <Route path="/admin/contracts" element={<AdminDashboard page="contracts" />} />
                    <Route path="/admin/catalog" element={<AdminDashboard page="catalog" />} />
                    <Route path="/admin/analytics" element={<AdminDashboard page="analytics" />} />
                    <Route path="/admin/logs" element={<AdminDashboard page="logs" />} />
                    <Route path="/admin/settings" element={<AdminDashboard page="settings" />} />
                    <Route path="/admin/permissions" element={<AdminDashboard page="permissions" />} />
                    <Route path="/admin/services-approvals" element={<AdminDashboard page="services-approvals" />} />
                    <Route path="/admin/off-finance" element={<AdminDashboard page="off-finance" />} />
                    <Route path="/admin/office-specialties" element={<AdminDashboard page="office-specialties" />} />
                    <Route path="/admin/messages" element={<AdminDashboard page="requests" />} />
                    <Route path="/admin/homepage" element={<AdminDashboard page="settings" />} />
                    <Route path="/admin/icons" element={<AdminDashboard page="settings" />} />
                    <Route path="/admin/org-structure" element={<AdminDashboard page="settings" />} />

                    {/* العقود */}
                    <Route path="/create-contract" element={<CreateContract />} />
                    <Route path="/contracts/my" element={<MyContracts />} />
                    <Route path="/contracts/incoming" element={<IncomingContracts />} />
                    <Route path="/contracts/:contractId" element={<ContractShow />} />
                    <Route path="/payment/checkout/:paymentId" element={<PaymentCheckout />} />
                    <Route path="/payment/checkout" element={<PaymentCheckout />} />

                    {/* تسجيل مقدّم الخدمة */}
                    <Route path="/provider-account/create" element={<ProviderAccount />} />
                    <Route path="/provider-account" element={<ProviderAccount />} />

                    {/* نفاذ */}
                    <Route path="/nafath" element={<NafathVerify />} />
                    <Route path="/nafath/wait" element={<NafathWait />} />

                    {/* إدارة المحتوى */}
                    <Route path="/admin/homepage" element={<AdminHomepage />} />

                    {/* صفحات تُحوَّل لاحقاً — توجيه مؤقت */}
                    <Route path="/office/*" element={<FallbackPage section="office" />} />
                    <Route path="/admin/*" element={<FallbackPage section="admin" />} />
                    <Route path="/dashboard-hub" element={<FallbackPage section="hub" />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);