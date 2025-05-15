import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import bgPic from "/ChatGPT Image May 15, 2025, 09_51_23 PM.png";

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
    <div
      className="w-screen min-h-screen bg-black bg-cover bg-center flex justify-center items-center p-4 relative"
      style={{
        backgroundImage: `url('${bgPic}')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />
      <div className="z-10 w-full max-w-md">{componentRendered}</div>
    </div>
  );
}
