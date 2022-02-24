import React from "react";
import "./styles/Modal.css";

const Modal = ({ displayMode = false, modalTitle, children }) => {
  return (
    <div className={`ModalWrapper ${displayMode ? "" : "hide"}`}>
      <div className="Modal">
        <h2 className="Modal__title">{modalTitle}</h2>
        <div className="Modal__children">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
