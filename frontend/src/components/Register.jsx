import { useState } from "react";
import StyledHeading from "./StyledHeading";
import { Link } from "react-router-dom";
import StyledModal from "./StyledModal";
import axios from "axios";

function Register() {
  const [show, setShow] = useState(false);
  const [modalInfo, setModalInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
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
    if (!data.email || !data.password || !data.firstname || !data.lastname) {
      setModalInfo("Please fill all fields");
      setLoading(false);
      return;
    }
    //Validate email
    if (!/\S+@\w+\.\w+(\.\w+)?/.test(data.email)) {
      setModalInfo("Invalid email");
      setLoading(false);
      return;
    }
    // Validate Password
    if (data.password.length < 8) {
      setModalInfo("Password needs to be atleast 8 characters long");
      setLoading(false);
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}/users/register`, {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        clearForm();
        setModalInfo(res.data.message + " Redirecting to login page...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch((err) => {
        setModalInfo(err.response.data.error);

        console.error(`Error registering ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearForm = () => {
    setData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    });
  };
  return (
    <div className='container d-flex flex-column align-items-center gap-2'>
      <StyledHeading heading='Register' />
      <div className='col-lg-6 col-12 bg-white p-4 rounded shadow'>
        <form className='w-100 border rounded p-4 d-flex flex-column gap-3 '>
          <div>
            <label htmlFor='firstname' className='form-label text-secondary'>
              Firstname
            </label>
            <input
              type='text'
              className='form-control shadow-none'
              id='firstname'
              value={data.firstname}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='lastname' className='form-label text-secondary'>
              Lastname
            </label>
            <input
              type='text'
              className='form-control shadow-none'
              id='lastname'
              value={data.lastname}
              onChange={handleChange}
            />
          </div>

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
            Register
          </button>
        </form>
        <p>
          Already registered?{" "}
          <Link to='/login' className='text-success'>
            Login here!
          </Link>
        </p>
      </div>

      <StyledModal show={show} setShow={setShow} body={modalInfo} onHide={() => setShow(false)} loading={loading} />
    </div>
  );
}

export default Register;
