import { useEffect } from 'react';
import { Overlay, ModalWrapper } from './Modal.styled';
import { createPortal } from 'react-dom';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ closeModal, item }) {
  const backdropCloseHandler = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const closeEscapeHandler = e => {
      if (e.code === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', closeEscapeHandler);

    return () => {
      window.removeEventListener('keydown', closeEscapeHandler);
    };
  }, [closeModal]);

  return createPortal(
    <Overlay onClick={backdropCloseHandler}>
      <ModalWrapper>
        <img src={item.largeImageURL} alt={item.tags} />
      </ModalWrapper>
    </Overlay>,
    modalRoot
  );
}
