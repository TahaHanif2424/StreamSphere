export default function HomePage() {
    return <div className="mt-[10dvh] grid grid-cols-3">
        <h1>Hello</h1>
    </div>
}

export async function loader() {
    getUser();
    const response = await fetch('https://localhost:5000/videos');

    if(!response.ok)
        throw new Error('Unable to fetch videos');

    const responseData = await response.json();

    return defer({
        data: responseData
    });
}