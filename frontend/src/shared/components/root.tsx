import { Outlet } from "react-router-dom";
import Navigation from "./navigation";
import Footer from "./footer";

export default function Root() {
    return (
        <>
           <Navigation/>
           <Outlet/>
           <Footer/>
        </>
    )
}