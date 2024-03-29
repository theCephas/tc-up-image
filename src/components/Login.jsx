import { Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config.js";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [initialEmail, setInitialEmail] = useState("user@example.com");
  // eslint-disable-next-line no-unused-vars
  const [initialPassword, setInitialPassword] = useState("1Password");
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial values when the component mounts
    setLoginEmail(initialEmail);
    setLoginPassword(initialPassword);
  }, [initialEmail, initialPassword]);

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;
      console.log(user);

      localStorage.setItem("registeredEmail", user.email);
      navigate("/Home");
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-email" ||
        error.code === "auth/invalid-login-credentials"
      ) {
        toast.error(
          "Invalid email or password. Use user@example.com and 1Password as default.",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            transition: Slide,
            className: "rounded-xl",
          }
        );
      }
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>Login Page</title>
      </Helmet>

      <div className="font-mooli bg-black/80 min-h-screen">
        <form
          className="flex flex-col py-6 px-10
         absolute
         top-[50%] left-[50%] shadow-xlg transform translate-x-[-50%] translate-y-[-50%] w-[300px] sm:w-[500px] rounded-3xl
         bg-white/20 backdrop-saturate-125"
        >
          <p className="text-center font-bodyFont pb-6 font-bold text-xl sm:text-2xl tracking-wide">
            LOGIN
          </p>
          <label className="text-sm sm:text-xl pb-5">*Email</label>
          <input
            type="email"
            placeholder="user@example.com"
            defaultValue={initialEmail}
            className="border-b border-white mb-10 border-opacity-50 py-1 pl-2 text-white bg-transparent focus:outline-none focus:border-white transition ease-in-out duration-700 focus:-translate-y-1 focus:scale-105 w-auto italic text-sm sm:text-[14px]"
            required
            onChange={(event) => {
              setLoginEmail(event.target.value);
            }}
          />

          <label className="text-sm sm:text-xl pb-5">*Password</label>
          <input
            type="password"
            placeholder="1Password"
            defaultValue={initialPassword}
            className="border-b border-white border-opacity-50 py-1 pl-2 text-white bg-transparent focus:outline-none focus:border-white transition ease-in-out duration-700 focus:-translate-y-1 focus:scale-105 w-auto italic text-sm sm:text-[14px]"
            required
            onChange={(event) => {
              setLoginPassword(event.target.value);
            }}
          />

          <button
            type="button"
            onClick={login}
            className="flex m-auto mt-8 p-3 px-6 bg-gradient-to-l to-stone-700 rounded-2xl hover:bg-gradient-to-l from-stone-700 text-sm sm:text-xl font-semibold tracking-widest transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-500"
          >
            Login
          </button>
          <div className="toast-container">
            <ToastContainer className={`w-[280px]`} limit={2} />
          </div>
          <div className="text-center pt-6 text-sm sm:text-[14px]">
            <p>
              Create a free account.
              <Link to="/Signup" className="text-blue-400">
                {" "}
                Sign up.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
