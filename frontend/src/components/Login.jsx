import { useState } from "react";
import StyledHeading from "./StyledHeading";
import { Link } from "react-router-dom";
import StyledModal from "./StyledModal";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/slices/userSlice.js";

function Login() {
  const [show, setShow] = useState(false);
  const [modalInfo, setModalInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleDispatch = (user) => {
    const token = localStorage.getItem("token");
    const userInfo = { ...user, token };
    dispatch(addUser(userInfo));
  };

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShow(true);
    setLoading(true);
    setModalInfo("Processing...");

    // Check for all fields
    if (!data.email || !data.password) {
      setModalInfo("Please fill all fields");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        handleDispatch(res.data.user);
        setModalInfo(res.data.message + " Redirecting to home page...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        clearForm();
      })
      .catch((err) => {
        setModalInfo(err.response.data.error);
        console.log(`Error Logging in ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearForm = () => {
    setData({
      email: "",
      password: "",
    });
  };

  return (
    <div className='container d-flex flex-column align-items-center gap-2 '>
      <StyledHeading heading='Login' />
      <div className='col-lg-6 col-12 bg-white p-4 rounded shadow'>
        <form className='border rounded p-4 d-flex flex-column gap-3'>
          <div>
            <label htmlFor='email' className='form-label text-secondary'>
              Email
            </label>
            <input
              type='email'
              className='form-control shadow-none'
              id='email'
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='password' className='form-label text-secondary'>
              Password
            </label>
            <input
              type='password'
              className='form-control shadow-none'
              id='password'
              value={data.password}
              onChange={handleChange}
            />
          </div>

          <button type='submit' className='btn bg-success-subtle hover-color-custom' onClick={handleSubmit}>
            Login
          </button>
        </form>
        <p>
          New user?{" "}
          <Link to='/register' className='text-success'>
            Register here!
          </Link>
        </p>
      </div>
      <StyledModal show={show} setShow={setShow} body={modalInfo} onHide={() => setShow(false)} loading={loading} />
    </div>
  );
}

export default Login;
