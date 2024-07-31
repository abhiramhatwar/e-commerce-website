import { Button, Form, InputGroup, Table } from "react-bootstrap";
import StyledHeading from "./StyledHeading";
import StyledPagination from "./StyledPagination";
import axios from "axios";
import { useEffect, useState } from "react";
import StyledLoading from "./StyledLoading";
import StyledModal from "./StyledModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faImage,
  faLink,
  faPenToSquare,
  faPlus,
  faSearch,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ProductModal from "./ProductModal";
import UploadModal from "./UploadModal";
import { Link } from "react-router-dom";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 50;
  const sort = -1;

  const [create, setCreate] = useState(false);
  const [upload, setUpload] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [show, setShow] = useState(false);
  const [id, setId] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/products?page=${page}&limit=${limit}&sort=${sort}`)
      .then((res) => {
        setProducts(res.data.message);
        setFilteredProducts(res.data.message);
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
      .get(`${import.meta.env.VITE_API_URL}/products/count`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setTotalProducts(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDelete = (id) => {
    setDeleting(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
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
    //If search is empty reset the products
    if (!e.target.value) return setFilteredProducts(products);

    //Can search with either name, description or price
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          product.description.toLowerCase().includes(e.target.value.toLowerCase()) ||
          product.price.toString().includes(e.target.value)
      )
    );
  };

  return (
    <div>
      <StyledHeading heading='Manage Products' custom='bg-danger-subtle' />
      {loading ? (
        <div>
          <StyledLoading anim='grow' size='sm' />
        </div>
      ) : (
        <div className='bg-white p-4 rounded shadow d-flex flex-column gap-2 align-items-center'>
          <div className='d-flex justify-content-between align-items-center w-100'>
            {/* Product Creation */}
            <Button
              title='Add new product'
              className='bg-success-subtle border-0 text-black'
              onClick={() => setCreate(true)}
            >
              New <FontAwesomeIcon icon={faPlus} />
            </Button>

            {/* Search */}
            <InputGroup className='mb-3 w-25'>
              <Form.Control placeholder='Search...' className='shadow-none' onChange={handleSearch} />
              <Button variant='outline-secondary bg-transparent'>
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
          </div>

          {/* All products */}
          <Table striped bordered>
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Name</th>
                <th>Description</th>
                <th>Tags</th>
                <th>Featured Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1 + (page - 1) * limit}</td>
                  <td>{product.name}</td>
                  <td>
                    {product.description.length > 100 ? product.description.slice(0, 100) + "..." : product.description}
                  </td>
                  <td>{product.tags.join(", ")}</td>
                  <td className='text-center'>
                    <FontAwesomeIcon
                      icon={product.isFeatured ? faCheck : faXmark}
                      className={product.isFeatured ? "text-success" : ""}
                    />
                  </td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>

                  <td className='d-flex gap-2 align-items-center justify-content-center'>
                    {/* Update product */}
                    <Button
                      title='Edit product'
                      className='bg-success-subtle border-0 text-black'
                      onClick={() => setEdit(product)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>

                    {/* Update Image */}
                    <Button
                      title='Update Image'
                      className='bg-success-subtle border-0 text-black'
                      onClick={() => setUpload(product)}
                    >
                      <FontAwesomeIcon icon={faImage} />
                    </Button>

                    {/* Delete product */}
                    <Button
                      title='Delete product'
                      className='bg-danger-subtle border-0 text-black'
                      onClick={() => {
                        setShow(true);
                        setId(product._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>

                    {/* Product link */}
                    <Link to={`/products/${product._id}`} target='_blank' rel='noopener noreferrer'>
                      <Button title='Go to product page' className='bg-primary-subtle border-0 text-black'>
                        <FontAwesomeIcon icon={faLink} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <StyledModal
            title='Delete product?'
            loading={deleting}
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

          <ProductModal product={edit} show={edit} onHide={() => setEdit(false)} title='Update product' />
          <ProductModal show={create} onHide={() => setCreate(false)} title='Add new product' />
          <UploadModal product={upload} show={upload} onHide={() => setUpload(false)} title='Update product image ' />

          <StyledPagination page={page} setPage={setPage} lastPage={Math.ceil(totalProducts / limit)} />
        </div>
      )}
    </div>
  );
}

export default ManageProducts;
