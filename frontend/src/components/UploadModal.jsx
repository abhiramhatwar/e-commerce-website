import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import StyledLoading from "./StyledLoading";
import { Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function UploadModal({ show, onHide, title = " ", product = false }) {
  const [load, setLoad] = useState(false);
  const [result, setResult] = useState("");
  const [image, setImage] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);

    // Append the image to form data so multer can parse it
    const formData = new FormData();
    formData.append("image", image);

    //Upload image to cloudinary
    axios
      .post(`${import.meta.env.VITE_API_URL}/products/upload`, formData, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        //Change the url of the product image in database
        axios
          .put(
            `${import.meta.env.VITE_API_URL}/products/${product._id}`,
            { imageUrl: res.data.url },
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
          });
      })
      .catch((err) => {
        setResult(err.response.data.error);
        setLoad(false);
        console.error(err);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const handleChange = (e) => {
    setImage(e.target.files[0]);
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
              <InputGroup.Text className='w-25'>Image Url</InputGroup.Text>
              <Link to={product.imageUrl} className='cursor-pointer w-75' target='_blank' rel='noopener noreferrer'>
                <Form.Control
                  id='imageUrl'
                  type='text'
                  min='0'
                  readOnly
                  className='shadow-none bg-secondary-subtle'
                  style={{ cursor: "pointer" }}
                  value={product.imageUrl}
                />
              </Link>
            </InputGroup>
            <InputGroup>
              <div className='w-100'>
                <Form.Control
                  id='image'
                  type='file'
                  min='0'
                  className='shadow-none'
                  onChange={handleChange}
                  required
                  aria-describedby='uploadImage'
                />
                <Form.Text id='uploadImage'>Upload Image</Form.Text>
              </div>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-start '>
            <Button className='bg-success-subtle hover-color-custom text-black border-0' type='submit'>
              Upload New Image
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

export default UploadModal;
