import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Modal({ showModal, setShowModal, children }) {
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div
      className='modalWrap'
      style={{ display: showModal ? 'block' : 'none' }}
    >
      <div className='modalContainer'>
        <div className='modal darkModeElement roundedRectangle'>
          <div className='modalContent'>로그인이 필요합니다.</div>
          <button onClick={closeModal} className='btnElement'>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
