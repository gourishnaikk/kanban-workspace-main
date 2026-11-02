import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal visibility state.
 * 
 * @param {boolean} [initialState=false] - Initial open/closed state of the modal.
 * @returns {{
 *   isOpen: boolean,
 *   openModal: (data?: any) => void,
 *   closeModal: () => void,
 *   toggleModal: () => void,
 *   modalData: any
 * }}
 */
export default function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal,
  };
}
