import React from "react";

const Modal = ({ onClose, jobDetails, selectedJob }) => {
  return (
    <div className={`modal ${selectedJob ? "active" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div>{jobDetails}</div>
      </div>
    </div>
  );
};

export default Modal;
