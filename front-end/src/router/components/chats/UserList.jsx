import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { enterRoom, getUsers } from 'store/slice/chatSlice';
import chatStyle from 'style/chatStyle.css';

///////////////////////////////////////////////////////////////////////////////////////////////

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const myNo = useSelector((state) => state.user.userNo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserList = async () => {
    const res = await dispatch(getUsers());
    if (res) setUserList(res.payload);
  };

  const roomEnterHandler = async (userNo) => {
    const users = [myNo, userNo]
      .sort((a, b) => a - b)
      .map((num) => num.toString());
    const res = await dispatch(enterRoom(users));
    if (res.payload) navigate(`${res.payload}`, { state: { chatUser: users } });
  };

  useEffect(() => {
    getUserList();
  }, []);
  return (
    <div className='chatWrap'>
      <div className='chatBar'>
        {userList
          .filter((user) => myNo !== user.userNo) // 유저 목록에서 자신 제외
          .map((user) => (
            <div
              className='chatUser darkModeElement'
              key={`${myNo}and${user.userNo}`}
              onClick={() => roomEnterHandler(user.userNo)}
            >
              {user.userNick}
            </div>
          ))}
      </div>
      <Outlet />
    </div>
  );
}
