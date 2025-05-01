import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';

export default function Header() {
    const navigate = useNavigate();
    const userData = useSelector(state => state.user);

    if(!userData)
        navigate('/auth?mode=login');


    return <header className="flex items-center w-screen fixed top-0 left-0 px-3 h-[10%] justify-between py-4">
        <h1 className="text-2xl tracking-widest">Stream Sphere</h1>
        <input type="text" placeholder="Search" />
        {/* <h4>{userData}</h4> */}
    </header>
}