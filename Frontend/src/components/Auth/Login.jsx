import useInput from "../../hooks/useInput";
import Input from "../UI/Input";
import { validateEmail, validatePassword } from "../../utils/validation";
import { useSubmit, Form } from "react-router-dom";

export default function Login() {
  const [
    enteredEmail,
    setEnteredEmail,
    isEmailTouched,
    setIsEmailTouched,
    isEmailValid,
  ] = useInput({ isValidationOn: true, validationFunc: validateEmail }, "");

  const [
    enteredPassword,
    setEnteredPassword,
    isPasswordTouched,
    setIsPasswordTouched,
    isPasswordValid,
  ] = useInput({ isValidationOn: true, validationFunc: validatePassword }, "");

  const isFormValid = isEmailValid && isPasswordValid;
  const submit = useSubmit();

  function handleFormSubmission(event) {
    event.preventDefault();
    if (isFormValid) {
      submit(
        { email: enteredEmail, password: enteredPassword },
        {
          method: "POST",
          action: "/auth?mode=login",
        }
      );
    }
  }

  return (
    <Form
      onSubmit={handleFormSubmission}
      action="/"
      className="flex flex-col items-center gap-5 p-6 w-full max-w-md shadow-lg shadow-black/30 rounded-xl font-inter border border-gray-900 bg-white"
    >
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
        Welcome Back
      </h1>
      <p className="text-center text-sm text-gray-500 mb-4">
        Please enter your credentials to login
      </p>

      <Input
        value={enteredEmail}
        validation={true}
        setValue={setEnteredEmail}
        setIsTouched={setIsEmailTouched}
        type="email"
        label="Email"
        id="email"
        isTouched={isEmailTouched}
        isValid={isEmailValid}
      />
      <Input
        value={enteredPassword}
        validation={true}
        setValue={setEnteredPassword}
        isTouched={isPasswordTouched}
        setIsTouched={setIsPasswordTouched}
        isValid={isPasswordValid}
        type="password"
        label="Password"
        id="password"
      />

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition duration-300"
      >
        Login
      </button>
    </Form>
  );
}
