import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import StyledLoading from "./StyledLoading";
import { ButtonGroup, Form, InputGroup, ToggleButton } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function UserModal({ show, onHide, title = " ", user = false }) {
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [load, setLoad] = useState(false);
  const [result, setResult] = useState("");

  const clearInfo = () => {
    setUserInfo({
      firstname: "",
      lastname: "",
      email: "",
    });
  };

  useEffect(() => {
    clearInfo();
    if (user) {
      setIsAdmin(user.isAdmin);
      setUserInfo({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    // Update User
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/users/${user._id}`,
        { ...userInfo, isAdmin },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      )
      .then((res) => {
        setResult(res.data.message);
      })
      .catch((err) => {
        setResult(err.response.data.error);
        console.error(err);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserInfo({ ...userInfo, [id]: value });
  };
  return (
    <>
      <Modal show={show} onHide={onHide} centered backdrop='static'>
        {title && (
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
        )}
        <Form onSubmit={handleSubmit}>
          <Modal.Body className='d-flex flex-column gap-3'>
            <InputGroup>
              <InputGroup.Text className='w-25'>Firstname</InputGroup.Text>
              <Form.Control
                id='firstname'
                type='text'
                className='shadow-none'
                onChange={handleChange}
                required
                value={userInfo.firstname}
              />
            </InputGroup>{" "}
            <InputGroup>
              <InputGroup.Text className='w-25'>Lastname</InputGroup.Text>
              <Form.Control
                id='lastname'
                type='text'
                className='shadow-none'
                onChange={handleChange}
                required
                value={userInfo.lastname}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text className='w-25'>E-mail</InputGroup.Text>
              <Form.Control
                id='email'
                type='text'
                className='shadow-none'
                onChange={handleChange}
                required
                value={userInfo.email}
              />
            </InputGroup>
            <ButtonGroup className='mb-2'>
              <ToggleButton
                className={(isAdmin ? "bg-success-subtle text-black" : "bg-secondary") + " border-0"}
                id='isAdminT'
                type='radio'
                name='radio'
                value={true}
                checked={isAdmin}
                onChange={() => setIsAdmin(true)}
              >
                Admin
              </ToggleButton>
              <ToggleButton
                className={(!isAdmin ? "bg-danger-subtle text-black" : "bg-secondary") + " border-0"}
                id='isAdminF'
                type='radio'
                name='radio'
                value={false}
                checked={!isAdmin}
                onChange={() => setIsAdmin(false)}
              >
                No Admin
              </ToggleButton>
            </ButtonGroup>
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-start '>
            <Button className='bg-success-subtle hover-color-custom text-black border-0' type='submit'>
              {user ? "Update User" : "Add User"}
            </Button>
          </Modal.Footer>
        </Form>

        {load && (
          <Modal.Title className='d-flex justify-content-center py-3 gap-1'>
            <StyledLoading anim='grow' size='sm' />
          </Modal.Title>
        )}
        {result && <p className='text-center'>{result}</p>}
      </Modal>
    </>
  );
}

export default UserModal;
