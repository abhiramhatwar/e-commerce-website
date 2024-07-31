import { Button, Form, InputGroup, Table } from "react-bootstrap";
import StyledHeading from "./StyledHeading";
import StyledPagination from "./StyledPagination";
import axios from "axios";
import { useEffect, useState } from "react";
import StyledLoading from "./StyledLoading";
import StyledModal from "./StyledModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import UserModal from "./UserModal";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 50;
  const sort = -1;

  const [edit, setEdit] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [show, setShow] = useState(false);
  const [id, setId] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/users?page=${page}&limit=${limit}&sort=${sort}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setUsers(res.data.message);
        setFilteredUsers(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/count`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setTotalUsers(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDelete = (id) => {
    setDeleting(true);

    axios
      .delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setDeleted(res.data.message);
      })
      .catch((err) => {
        setDeleted(err.response.data.error);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const handleSearch = (e) => {
    //If search is empty reset the users
    if (!e.target.value) return setFilteredUsers(users);

    //Can search with either name or email
    setFilteredUsers(
      users.filter(
        (user) =>
          user.firstname.toLowerCase().includes(e.target.value.toLowerCase()) ||
          user.lastname.toLowerCase().includes(e.target.value.toLowerCase()) ||
          user.email.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div>
      <StyledHeading heading='Manage Users' custom='bg-danger-subtle' />
      {loading ? (
        <div>
          <StyledLoading anim='grow' size='sm' />
        </div>
      ) : (
        <div className='bg-white p-4 rounded shadow d-flex flex-column gap-2 align-items-center'>
          <div className='d-flex justify-content-end align-items-center w-100'>
            {/* Search */}
            <InputGroup className='mb-3 w-25'>
              <Form.Control placeholder='Search...' className='shadow-none' onChange={handleSearch} />
              <Button variant='outline-secondary bg-transparent'>
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
          </div>

          {/* All users */}
          <Table striped bordered>
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Name</th>
                <th>E-mail</th>
                <th>Admin</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1 + (page - 1) * limit}</td>
                  <td>
                    {user.firstname} {user.lastname}
                  </td>
                  <td>{user.email}</td>
                  <td className={(user.isAdmin ? "bg-success-subtle" : "bg-danger-subtle") + " text-center"}>
                    <FontAwesomeIcon icon={user.isAdmin ? faCheck : faXmark} />
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                  <td className='d-flex gap-2 align-items-center justify-content-center'>
                    {/* Update user */}
                    <Button
                      title='Edit user'
                      className='bg-success-subtle border-0 text-black'
                      onClick={() => setEdit(user)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>

                    {/* Delete user */}
                    <Button
                      title='Delete user'
                      className='bg-danger-subtle border-0 text-black'
                      onClick={() => {
                        setShow(true);
                        setId(user._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <StyledModal
            loading={deleting}
            title='Delete user?'
            body={deleted}
            show={show}
            onHide={() => {
              setShow(false);
              setDeleted(false);
            }}
            onOK={() => {
              handleDelete(id);
            }}
          />

          <UserModal user={edit} show={edit} onHide={() => setEdit(false)} title='Update user' />

          <StyledPagination page={page} setPage={setPage} lastPage={Math.ceil(totalUsers / limit)} />
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
