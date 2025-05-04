import { redirect } from "react-router";

export async function authAction({request, params}) {
    const formData = await request.formData();

    const url = new URL(request.url);
    const mode = url.searchParams.get('mode');

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