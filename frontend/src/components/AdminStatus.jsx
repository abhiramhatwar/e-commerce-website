import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import StyledHeading from "./StyledHeading";

function AdminStatus() {
  const [products, setProducts] = useState();
  const [orders, setOrders] = useState();
  const [users, setUsers] = useState();

  useEffect(() => {
    //Fetch counts of all collections
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/count`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setProducts(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders/count`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setOrders(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/count`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setUsers(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className='vh-100 '>
      <StyledHeading heading='Website Status' custom='bg-danger-subtle' />
      <div className='bg-white p-4 rounded shadow'>
        <Table striped bordered className='text-center'>
          <thead>
            <tr>
              <th>Total Products</th>
              <th>Total Orders</th>
              <th>Total Users</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{products}</td>
              <td>{orders}</td>
              <td>{users}</td>
            </tr>
          </tbody>
        </Table>
        <div className='d-flex gap-1 align-items-center justify-content-center'>
          <FontAwesomeIcon icon={faCircle} className={products && users && orders ? "text-success" : "text-danger"} />{" "}
          <span className='fs-3'>Status: {products && users && orders ? "OK" : "..."}</span>
        </div>
        <h4 className='text-center'>Please use sidebar to navigate</h4>
      </div>
    </div>
  );
}

export default AdminStatus;
