import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("mode")) {
      setSearchParams({ mode: "login" });
      return;
    }
    const mode = searchParams.get("mode");
    if (mode !== "signup" && mode !== "login")
      setSearchParams({ mode: "login" });
  }, [searchParams]);

  const mode = searchParams.get("mode");
  const componentRendered = mode === "signup" ? <Signup /> : <Login />;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex justify-center items-center p-4">
      {componentRendered}
    </div>
  );
}
