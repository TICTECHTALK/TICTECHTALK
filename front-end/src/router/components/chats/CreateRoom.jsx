import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { create, getRoomList } from 'store/slice/chatSlice';

export default function CreateRoom() {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [list, setList] = useState([]);

  useEffect(() => {
    async function getList() {
      const res = await dispatch(getRoomList());
      setList((list) => [...list, ...res.payload]);
    }

    getList();
  }, [dispatch]);

  const enter = async (data) => {
    const result = await dispatch(create(data));
    setList((list) => [
      ...list,
      {
        roomId: result.payload,
        roomName: data.roomName,
        userNo: user.userNo,
      },
    ]);
    // navigate(`/chat/${roomId}`);

    reset(); // input 내용 비워주기
  };

  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      <form onSubmit={handleSubmit(enter)}>
        <input
          type='text'
          placeholder='채팅방 이름'
          {...register('roomName', { required: true })}
        />
        <button type='submit'>생성</button>
      </form>
      <hr />
      <div>
        {list.map((room, index) => (
          <div key={index} onClick={() => navigate(`/chat/${room.roomId}`)}>
            {room.roomName}
          </div>
        ))}
      </div>
    </div>
  );
}
