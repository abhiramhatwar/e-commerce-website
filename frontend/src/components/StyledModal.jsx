import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import StyledLoading from "./StyledLoading";

function StyledModal({ show, onHide, title, body, loading, onOK = onHide }) {
  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        {loading && (
          <Modal.Title className='d-flex justify-content-center py-3 gap-1'>
            <StyledLoading anim='grow' size='sm' />
          </Modal.Title>
        )}
        {title && (
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
        )}
        {body && <Modal.Body>{body}</Modal.Body>}
        <Modal.Footer className='d-flex justify-content-start '>
          <Button className='bg-success-subtle hover-color-custom text-black border-0' onClick={onOK}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StyledModal;
