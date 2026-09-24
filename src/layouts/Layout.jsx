import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}