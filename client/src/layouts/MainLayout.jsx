import Navbar from "../components/common/Navbar";

import Footer from "../components/common/Footer";

import AIButton from "../components/common/AIButton";

const MainLayout = ({ children }) => {
    return(
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <AIButton />
            <Footer />
        </>
    )}

    export default MainLayout;
