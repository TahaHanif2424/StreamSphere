import useInput from "../../hooks/useInput";
import Input from "../UI/Input";
import { validateEmail, validatePassword } from "../../utils/validation";
import { useSubmit, Form } from 'react-router-dom';

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
      submit({email: enteredEmail, password: enteredPassword}, {
        method: 'POST',
        action: '/auth?mode=login'
      });
      return;
    }
  }

  return (
    <Form onSubmit={handleFormSubmission} action="/" className="flex bg-blue-50/70 flex-col items-center gap-5 p-5 w-max shadow-lg shadow-black/30 rounded-lg font-inter border border-solid border-gray-900">
      <h1 className="text-2xl tracking-wide font-bold text-center text-gray-950">
        Login Form
      </h1>
      <Input
        key={1}
        value={enteredEmail}
        validation={true}
        setValue={setEnteredEmail}
        setIsTouched={setIsEmailTouched}
        type={"email"}
        label={"Email"}
        id={"email"}
        isTouched={isEmailTouched}
        isValid={isEmailValid}
      />
      <Input
        key={2}
        value={enteredPassword}
        validation={true}
        setValue={setEnteredPassword}
        isTouched={isPasswordTouched}
        setIsTouched={setIsPasswordTouched}
        isValid={isPasswordValid}
        type={"password"}
        label={"Password"}
        id={"password"}
      />
      <button
        className="px-4 py-2 w-[50%] transition-all duration-300 cursor-pointer font-semibold rounded-md text-md bg-sky-100 text-blue-500 hover:bg-sky-500 hover:text-sky-50 border hover:border-transparent border-solid border-blue-700"
        type="submit"
      >
        Submit
      </button>
    </Form>
  );
}
