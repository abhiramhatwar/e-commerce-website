import { useEffect, useState } from "react";
import StyledHeading from "../components/StyledHeading";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import StyledToast from "../components/StyledToast";
import { updateUser } from "../redux/slices/userSlice";

function UserDashboard() {
  const [toast, setToast] = useState("");
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const userInfo = useSelector((store) => store.user);
  const [formInfo, setFormInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormInfo({ ...formInfo, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`${import.meta.env.VITE_API_URL}/users/${userInfo._id}/profile`, formInfo, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        dispatch(updateUser(formInfo));
        setToast(res.data);
      })
      .catch((err) => {
        setToast(err.response.data);
      });
  };

  useEffect(() => {
    // Set forminfo to the user's info from redux store
    setFormInfo({
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      email: userInfo.email,
    });
  }, [userInfo]);

  return (
    <div>
      {token ? (
        <Container>
          <StyledHeading heading='User Dashboard' />
          <Form onSubmit={handleSubmit} className='bg-white p-4 rounded shadow'>
            <Form.Group className='mb-3'>
              <Form.Label>Email address</Form.Label>
              <Form.Control id='email' value={formInfo.email} type='email' onChange={handleChange} />
              {!formInfo.email || !/\S+@\w+\.\w+(\.\w+)?/.test(formInfo.email) ? (
                <Form.Text className='text-danger'>Enter valid email!</Form.Text>
              ) : (
                <Form.Text className='text-muted'>We never share your email with anyone else.</Form.Text>
              )}
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>First Name</Form.Label>
              <Form.Control id='firstname' value={formInfo.firstname} type='text' onChange={handleChange} />
              {!formInfo.firstname && <Form.Text className='text-danger'>Enter firstname!</Form.Text>}
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control id='lastname' value={formInfo.lastname} type='text' onChange={handleChange} />
              {!formInfo.lastname && <Form.Text className='text-danger'>Enter lastname!</Form.Text>}
            </Form.Group>
            <Button
              className='bg-success-subtle hover-color-custom text-black border-0'
              type='submit'
              disabled={!formInfo.firstname || !formInfo.lastname || !formInfo.email}
            >
              Update
            </Button>
          </Form>
          <StyledToast toast={toast} onClose={() => setToast("")} />
        </Container>
      ) : (
        <StyledHeading custom='bg-danger container' heading='Unauthorized' />
      )}
    </div>
  );
}

export default UserDashboard;
