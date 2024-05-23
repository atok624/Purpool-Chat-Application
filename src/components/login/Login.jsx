import "./login.css";
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import upload from "../../lib/upload";
import { useState } from "react";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password) {
      setLoading(false);
      return toast.warn("Please enter inputs!");
    }
    if (!avatar.file) {
      setLoading(false);
      return toast.warn("Please upload an avatar!");
    }

    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setLoading(false);
      return toast.warn("Select another username");
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      {!isSignUp && (
        <div>
          <div className="container">
            <div className="card">
              <div className="card-img-signin"> </div>
              <div className="form-box signin">
                <h2>Sign In</h2>
                <form onSubmit={handleLogin} className="centered-form">
                  <div className="input-box">
                    <span className="icon">
                      <img src="./mail.png" alt="mail icon" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      title="Email"
                      placeholder=" "
                      required
                    />
                    <label>Email</label>
                  </div>
                  <div className="input-box">
                    <span className="icon">
                      <img src="./password.png" alt="password icon" />
                    </span>
                    <input
                      type="password"
                      name="password"
                      title="Password"
                      placeholder=" "
                      required
                    />
                    <label>Password</label>
                  </div>

                  <div className="forgot-password">
                    <a href="#" title="Forgot Password">
                      Forgot Password?
                    </a>
                  </div>

                  <button className="btn" disabled={loading}>
                    {loading ? "Loading" : "Sign In"}
                  </button>

                  <div className="signin-signup">
                    <p onClick={() => setIsSignUp(true)}>
                      Don&rsquo;t have an account?{" "}
                      <a href="#" className="signup-reference">
                        Sign Up
                      </a>
                    </p>
                  </div>

                  <div className="signin-signup">
                    <p>
                      <a href="#">Terms of use </a> •{" "}
                      <a href="#"> Privacy policy</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSignUp && (
        <div>
          <div className="container">
            <div className="card">
              <div className="card-img-signup">
                <img
                  className="purpool"
                  src="./Purpool-Cropped.jpg"
                  alt=""
                />
                <h2>Welcome to the</h2>
                <h1 className="purple-text">Purpool Chat App</h1>
                <h4> - Connect with your Peers - </h4>
              </div>
              <div className="form-box signup">
                <h2>Sign Up</h2>
                <form onSubmit={handleRegister} className="centered-form">
                  <label htmlFor="file">
                    <img
                      className="avatar"
                      src={avatar.url || "./avatar.png"}
                      alt="User's Avatar"
                    />
                  </label>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={handleAvatar}
                  />

                  <div className="input-box">
                    <span className="icon">
                      <img src="./user.png" alt="user icon" />
                    </span>
                    <input
                      type="text"
                      name="username"
                      title="Username"
                      placeholder=" "
                      required
                    />
                    <label>Username</label>
                  </div>
                  <div className="input-box">
                    <span className="icon">
                      <img src="./mail.png" alt="mail icon" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      title="Email"
                      placeholder=" "
                      required
                    />
                    <label>Email</label>
                  </div>
                  <div className="input-box">
                    <span className="icon">
                      <img src="./password.png" alt="password icon" />
                    </span>
                    <input
                      type="password"
                      name="password"
                      title="Password"
                      placeholder=" "
                      required
                    />
                    <label>Password</label>
                  </div>

                  <button className="btn" disabled={loading}>
                    {loading ? "Loading" : "Sign Up"}
                  </button>

                  <div className="signin-signup">
                    <p onClick={() => setIsSignUp(false)}>
                      You already have an account?{" "}
                      <a href="#" className="signin-reference">
                        Sign In
                      </a>
                    </p>
                  </div>

                  <div className="signin-signup">
                    <p>
                      <a href="#">Terms of use </a> •{" "}
                      <a href="#"> Privacy policy</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
