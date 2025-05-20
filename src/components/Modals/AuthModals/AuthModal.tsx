import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import {useAuthModal} from "../../../hooks/useAuthModal";
import CustomButton from "./CustomButton";
import apiService from "../../../services/apiService";
import { useAuth } from "../../../storage/AuthProvider";

const AuthModal = ({ navUrl }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isSignUp, setIsSignUp] = useState(false);

  const authModal = useAuthModal();

  const { dispatch, actions } = useAuth();

  const submitSignUp = async (e) => {
    e.preventDefault();

    const formData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };

    const response = await apiService.post("/auth/register/", formData);

    if (response.access_token) {
      dispatch(
        actions.LOGIN(
          response.id,
          response.user_role,
          response.access_token,
          response.refresh_token,
          response.first_name,
          response.last_name
        )
      );
      authModal.close();
      if (navUrl) {
        navigate(navUrl);
      }
    } else {
      setErrors(response.errors);
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();

    const formData = {
      email: email,
      password: password,
    };

    const response = await apiService.post("/auth/login/", formData);
    console.log("Login response:", response); 
    if (response.access_token) {
      dispatch(
        actions.LOGIN(
          response.id,
          response.user_role,
          response.access_token,
          response.refresh_token,
          response.first_name,
          response.last_name
        )
      );
      authModal.close();
      if (navUrl) {
        navigate(navUrl);
      }
    } else {
      setErrors(response.errors);
    }
  };

  const content = (
    <>
      {isSignUp ? (
        <form action={submitLogin} className="space-y-4 ">
          <div className="space-y-2 ">
            <h5 >Hi, Welcome to Datalab</h5>
            <p>
              Create an account or{" "}
              <span
                className="underline cursor-pointer hover:underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                login to existing account
              </span>
            </p>
          </div>
          <div className="pb-4">
            <label htmlFor="first_name">First name</label>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              type="text"
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
          </div>

          <div className="pb-4">
            <label htmlFor="last_name">Last name</label>
            <input
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Your last name"
              type="text"
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
          </div>

          <div className="pb-4">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              type="email"
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
          </div>

          <div className="pb-4">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              type="password"
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
          </div>

          {errors.map((error, index) => {
            return (
              <div
                key={`error_${index}`}
                className="p-5 bg-white text-n-1 rounded-xl opacity-80"
              >
                {error}
              </div>
            );
          })}

          <CustomButton label="Sign up" onClick={submitSignUp} />
        </form>
      ) : (
        <form action={submitLogin} className="space-y-8 bg-white">
          <div className="space-y-2">
            <h5>Hi, Welcome to Datalab</h5>
            <p>
              Sign in to your account or{" "}
              <span
                className="underline cursor-pointer hover:underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                create a new account
              </span>
            </p>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              type="email"
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              type="password"
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
          </div>

          {errors &&
            errors.length > 0 &&
            errors.map((error, index) => {
              return (
                <div
                  key={`error_${index}`}
                  className="p-5 bg-white text-n-1 rounded-xl opacity-80"
                >
                  {error.message || error}{" "}
                  {/* Handle both object or string errors */}
                </div>
              );
            })}

          <CustomButton label="Sign in" onClick={submitLogin} />
        </form>
      )}

      {/* <div className="flex items-center pt-4 pb-2">
        <hr className="flex-grow border-t" />
        <span className="px-2">OR</span>
        <hr className="flex-grow border-t" />
      </div>

      <div className="mt-4">
        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />
      </div> */}
    </>
  );

  return (
    <Modal
    className="bg-white"
      isOpen={authModal.isOpen}
      close={authModal.close}
      content={content}
    />
  );
};

AuthModal.propTypes = {
  navUrl: PropTypes.string,
};

export default AuthModal;
