import useInput from "../../hooks/useInput";
import { validateConfirmPassword, validateEmail, validatePassword } from "../../utils/validation";
import { useSubmit, Form } from 'react-router-dom';
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
      submit({ email: enteredEmail, password: enteredPassword }, {
        method: 'POST',
        action: '/auth?mode=signup'
      });
      return;
    }
  }

  return (
    <Form
      onSubmit={handleFormSubmission}
      className="flex bg-blue-50/70 flex-col items-center gap-5 p-5 w-max shadow-lg shadow-black/30 rounded-lg font-inter border border-solid border-gray-900"
    >
      <h1 className="text-2xl tracking-wide font-bold text-center text-gray-950">
        Signup Form
      </h1>
      <Input
        key={1}
        value={enteredChannel}
        validation={false}
        setValue={setEnteredChannel}
        isTouched={isChannelTouched}
        setIsTouched={setIsChannelTouched}
        isValid={isChannelValid}
        type={"text"}
        label={"Channel Name"}
        id={"channel"}
      />
      <Input
        key={2}
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
        key={3}
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
      <Input
        key={4}
        value={enteredConfirmPassword}
        validation={true}
        setValue={setEnteredConfirmPassword}
        isTouched={isConfirmPasswordTouched}
        setIsTouched={setIsConfirmPasswordTouched}
        isValid={isConfirmPasswordValid}
        type={"password"}
        label={"Confirm Password"}
        id={"confirm-password"}
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
