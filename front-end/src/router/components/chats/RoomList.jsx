import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { create } from 'store/slice/chatSlice';

export default function RoomList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get('http://localhost:8080/chat/rooms');
      setList((list) => [...list, ...res.data]);
    })();
  }, []);

  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createRoom = async (data) => {
    const result = await dispatch(create(data));
    setList((list) => [...list, result.payload]);
    reset(); // input 내용 비워주기
  };

  return (
    <>
      <form onSubmit={handleSubmit(createRoom)}>
        <input
          type='text'
          placeholder='채팅방 이름'
          {...register('name', { required: true })}
        />
        <button type='submit'>입장</button>
      </form>
      <hr />
      <div>
        {list.map((rooms, index) => (
          <div key={index} onClick={() => navigate(`/chat/${rooms.roomId}`)}>
            {rooms.name}
          </div>
        ))}
      </div>
    </>
  );
}
