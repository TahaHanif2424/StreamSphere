import { useSubmit, Form } from "react-router-dom";
import useInput from "../../hooks/useInput";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validation";
import Input from "../UI/Input";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

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

  const isFormValid =
    isEmailValid && isPasswordValid && isConfirmPasswordValid;

  const submit = useSubmit();

  function handleFormSubmission(event) {
    event.preventDefault();

    if (isFormValid) {
      submit(
        {
          email: enteredEmail,
          password: enteredPassword,
          channelName: enteredChannel,
        },
        {
          method: "POST",
          action: "/auth?mode=signup",
        }
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Form
        onSubmit={handleFormSubmission}
        className="flex flex-col gap-6 p-8 w-full shadow-2xl rounded-2xl bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 text-white"
      >
        <motion.h2
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center"
        >
          Create Account
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm text-center"
        >
          Sign up to continue exploring content
        </motion.p>

        <Input
          value={enteredChannel}
          validation={false}
          setValue={setEnteredChannel}
          setIsTouched={setIsChannelTouched}
          isTouched={isChannelTouched}
          isValid={isChannelValid}
          type="text"
          label="Channel Name"
          id="channel"
          icon={<FaUser />}
        />

        <Input
          value={enteredEmail}
          validation={true}
          setValue={setEnteredEmail}
          setIsTouched={setIsEmailTouched}
          isTouched={isEmailTouched}
          isValid={isEmailValid}
          type="email"
          label="Email"
          id="email"
          icon={<FaEnvelope />}
        />

        <Input
          value={enteredPassword}
          validation={true}
          setValue={setEnteredPassword}
          setIsTouched={setIsPasswordTouched}
          isTouched={isPasswordTouched}
          isValid={isPasswordValid}
          type="password"
          label="Password"
          id="password"
          icon={<FaLock />}
        />

        <Input
          value={enteredConfirmPassword}
          validation={true}
          setValue={setEnteredConfirmPassword}
          setIsTouched={setIsConfirmPasswordTouched}
          isTouched={isConfirmPasswordTouched}
          isValid={isConfirmPasswordValid}
          type="password"
          label="Confirm Password"
          id="confirm-password"
          icon={<FaLock />}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition duration-300"
        >
          Sign Up
        </motion.button>
      </Form>
    </motion.div>
  );
}
