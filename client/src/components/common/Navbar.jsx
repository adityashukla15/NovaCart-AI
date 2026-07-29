import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User } from "lucide-react";

const Navbar = () => {
    return(
       <nav className="sticky top-0 z-50 bg-white border-b">
         <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
                    to="/"
                    className="text-2xl font-bold"
                >
                    NovaCart AI
                </Link>
                 <div className="hidden md:flex gap-8">

                    <Link to="/">Home</Link>

                    <Link to="/shop">Shop</Link>

                    <Link to="/about">About</Link>

                    <Link to="/contact">Contact</Link>

                </div>

                 <div className="flex gap-4">
                    <Heart />
                    <ShoppingCart />
                    <User />
                 </div>
         </div>

       </nav>
    )

}

export default Navbar;