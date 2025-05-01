import { redirect } from "react-router";
import Login from "../components/Auth/Login"
import Signup from "../components/Auth/Signup";
import { useSearchParams } from "react-router";
import { useEffect } from "react";

export default function AuthPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if(!searchParams.has('mode')) {
            setSearchParams({mode: 'login'});
            return;
        }
        const mode = searchParams.get('mode');
        if(mode !== 'signup' && mode !== 'login')
            setSearchParams({mode: 'login'});
    }, [searchParams]);

    const mode = searchParams.get("mode");
    const componentRendered = mode === "signup" ? <Signup /> : <Login />;

    return <div className="w-full h-screen flex justify-center items-center">
        {componentRendered}
    </div>
};

export async function action({request, params}) {
    const formData = await request.formData();

    const url = new URL(request.url);
    const mode = url.searchParams.get('mode') || 'login';

    const body = mode === 'login' ? {
        email: formData.get('email'),
        password: formData.get('password')
    } : {
        name: formData.get('channel'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    const response = await fetch('http://localhost:5000/user' + mode, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseData = await response.json();

    return redirect('/');
};