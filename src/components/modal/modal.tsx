import React, { FC } from "react";
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap";

interface AlertModalProps {
  isOpen: boolean;
  toggle: () => void;
  title: string;
  message: string;
  isSuccess: boolean;
}

const AlertModal: FC<AlertModalProps> = ({ isOpen, toggle, title, message, isSuccess }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>
        {isSuccess ? <p className="text-success">{message}</p> : <p className="text-danger">{message}</p>}
        <Button color="primary" onClick={toggle}>
          Close
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default AlertModal;
