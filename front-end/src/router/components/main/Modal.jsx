import { Link, useNavigate } from 'react-router-dom';

export default function Modal({ showModal, setShowModal, children }) {
  const closeModal = () => {
    setShowModal(false);
  };

  const navigate = useNavigate();

  return (
    <div
      className='modalWrap'
      style={{ display: showModal ? 'block' : 'none' }}
    >
      <div className='modalContainer'>
        <div className='modal darkModeElement roundedRectangle'>
          <Link to='/login' onClick={() => setShowModal(false)}>
            로그인 하러가기!
          </Link>
          <div className='modalContent'>로그인이 필요합니다.</div>
          <button onClick={closeModal} className='btnElement'>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
