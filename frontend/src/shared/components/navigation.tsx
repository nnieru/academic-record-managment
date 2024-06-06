import { Link } from "react-router-dom";

export default function Navigation() {
    return(
        <div className="bg-slate-900">
            <nav className="py-4 px-6">
                <ul className="hidden md:flex space-x-8 justify-end text-start text-white">
                    <li className="hover:font-medium  hover:rounded">
                        <Link to="/registration/institution">Register Institution</Link>
                    </li>
                    <li className="hover:font-semibold">
                        <Link to="/registration/receiver">Register Receiver</Link>
                    </li>
                    <li className="hover:font-semibold">
                        <Link to="/">Add Records</Link>
                    </li>
                    <li className="hover:font-semibold">
                        <Link to="/">Get Verification Status</Link>
                    </li>
                </ul>
            </nav>
       </div>
    )
}