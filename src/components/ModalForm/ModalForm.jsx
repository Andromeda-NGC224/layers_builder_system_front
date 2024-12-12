import { useState } from "react";
import css from "./ModalForm.module.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import toast from "react-hot-toast";

export default function ModalForm({ isOpen, onClose, onSubmit }) {
  const [inputValue, setInputValue] = useState("");

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue("");
      onClose();
    } else {
      toast.error("Enter a name, please!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={css.overlay} onClick={handleOverlayClick}>
      <form className={css.modal} onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={handleOverlayClick}
          className={css.closeButton}
        >
          <IoCloseCircleOutline size={24} />
        </button>
        <input
          className={css.input}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter diagram name"
        />
        <button type="submit" className={css.btnToCreate}>
          Create
        </button>
      </form>
    </div>
  );
}
