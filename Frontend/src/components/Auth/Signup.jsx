import useInput from "../../hooks/useInput";
import { validateConfirmPassword, validateEmail, validatePassword } from "../../utils/validation";
import { useSubmit, Form } from "react-router-dom";
import Input from "../UI/Input";

export default function Signup() {
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

  const [
    enteredConfirmPassword,
    setEnteredConfirmPassword,
    isConfirmPasswordTouched,
    setIsConfirmPasswordTouched,
    isConfirmPasswordValid,
  ] = useInput(
    {
      isValidationOn: true,
      validationFunc: (value) =>
        validateConfirmPassword(value, enteredPassword),
    },
    ""
  );

  const [
    enteredChannel,
    setEnteredChannel,
    isChannelTouched,
    setIsChannelTouched,
    isChannelValid,
  ] = useInput({ isValidationOn: false }, "");

  const isFormValid = isEmailValid && isPasswordValid && isConfirmPasswordValid;
  const submit = useSubmit();

  function handleFormSubmission(event) {
    event.preventDefault();

    if (isFormValid) {
      submit(
        {
          email: enteredEmail,
          password: enteredPassword,
          channelName: enteredChannel
        },
        {
          method: "POST",
          action: "/auth?mode=signup",
        }
      );
    }
  }

  return (
    <Form
      onSubmit={handleFormSubmission}
      className="flex flex-col gap-4 w-full max-w-md p-6 bg-white shadow-md rounded-xl border border-gray-300"
    >
      <div className="text-center mb-1">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-sm text-gray-500 mt-1">Sign up to continue</p>
      </div>

      <Input
        value={enteredChannel}
        validation={false}
        setValue={setEnteredChannel}
        isTouched={isChannelTouched}
        setIsTouched={setIsChannelTouched}
        isValid={isChannelValid}
        type="text"
        label="Channel Name"
        id="channel"
      />

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

      <Input
        value={enteredConfirmPassword}
        validation={true}
        setValue={setEnteredConfirmPassword}
        isTouched={isConfirmPasswordTouched}
        setIsTouched={setIsConfirmPasswordTouched}
        isValid={isConfirmPasswordValid}
        type="password"
        label="Confirm Password"
        id="confirm-password"
      />

      <button
        type="submit"
        className="mt-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-300"
      >
        Sign Up
      </button>
    </Form>
  );
}
