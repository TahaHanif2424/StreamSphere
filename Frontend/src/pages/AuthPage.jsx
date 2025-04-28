import { redirect } from "react-router";
import Login from "../components/Auth/Login"
import Signup from "../components/Auth/Signup";

export default function AuthPage() {
    return <div className="w-full h-screen flex justify-center items-center">
        <Signup />
    </div>
};

export async function action({request, params}) {
    const formData = await request.formData();

    const body = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    const response = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseData = await response.json();

    return redirect('/');
};