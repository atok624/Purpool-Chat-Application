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
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");
    if (!avatar.file) return toast.warn("Please upload an avatar!");

    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
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
        <section className="vh-100">
          <div className="container">
            <div className="card">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                alt="login form"
                className="card-img"
              />
              <div className="card-body">
                <div className="logo">
                  <i className="fas fa-cubes"></i>
                  <img className="purpool" src="/public/Purpool.jpg" alt="" />
                </div>
                <h5 className="fw-normal mb-3">Sign into your account</h5>
                <form onSubmit={handleLogin} className="centered-form">
                  <input type="text" className="form-control" placeholder="Email" name="email" />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="form-control"
                  />
                  <div className="pt-1">
                    <button className="btn btn-login" disabled={loading}>
                      {loading ? "Loading" : "Sign In"}
                    </button>
                  </div>
                  <a href="#" className="small">
                    Forgot password?
                  </a>
                  <p className="small" onClick={() => setIsSignUp(true)}>
                    don&rsquo;t have an account?{" "}
                    <a href="#" className="text-muted">
                      Register here
                    </a>
                  </p>
                  <a href="#" className="small">
                    Terms of use.
                  </a>
                  <a href="#" className="small">
                    Privacy policy
                  </a>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
      {isSignUp && (
        <section className="vh-100">
          <div className="container">
            <div className="card">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                alt="login form"
                className="card-img"
              />
              <div className="card-body">
                <h5 className="fw-normal mb-3">Create your account</h5>
                <form onSubmit={handleRegister} className="centered-form">
                  <label className="label_2" htmlFor="file">
                    <img
                      className="image_2"
                      src={avatar.url || "./avatar.png"}
                      alt=""
                    />
                    Upload an image
                  </label>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={handleAvatar}
                  />
                  <input type="text" placeholder="Username" name="username" className="form-control" />
                  <input type="text" placeholder="Email" name="email" className="form-control" />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="form-control"
                  />
                  <div className="pt-1">
                    <button className="btn btn-login" disabled={loading}>
                      {loading ? "Loading" : "Sign Up"}
                    </button>
                  </div>
                  <a href="#" className="small">
                    Forgot password?
                  </a>
                  <p className="small" onClick={() => setIsSignUp(false)}>
                    don&rsquo;t have an account?{" "}
                    <a href="#" className="text-muted">
                      Register here
                    </a>
                  </p>
                  <a href="#" className="small">
                    Terms of use.
                  </a>
                  <a href="#" className="small">
                    Privacy policy
                  </a>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Login;