import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { getChats } from 'store/slice/chatSlice';

///////////////////////////////////////////////////////////////////////////////////////////////

export default function Chat() {
  const { register, handleSubmit, resetField } = useForm();
  const { roomId } = useParams();
  const [chatMessage, setChatMessage] = useState([]);
  const [receiver, setReceiver] = useState('');
  const dispatch = useDispatch();

  const client = useRef({});
  const accessToken = localStorage.getItem('accessToken');
  const chatUser = useLocation().state.chatUser;
  const myNo = useSelector((state) => state.user.userNo);

  const scrollRef = useRef(null);

  const getMessages = async () => {
    const res = await dispatch(getChats(roomId));
    if (res.payload) {
      setChatMessage(res.payload.chatData);
      setReceiver(res.payload.receiver);
    }
  };

  useEffect(() => {
    scrollRef.current.addEventListener('DOMNodeInserted', (e) => {
      const { currentTarget: target } = e;
      target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
    });
  });

  useEffect(() => {
    getMessages();
    client.current = new StompJs.Client({
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws-stomp');
      },
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        client.current.subscribe(
          `/sub/${roomId}`,
          (msg) => {
            const res = JSON.parse(msg.body);
            setChatMessage((chats) =>
              !chats ? [res.chatData] : [...chats, res.chatData]
            );
          },
          {
            Authorization: `Bearer ${accessToken}`,
          }
        );
      },
      onDisconnect: () => {
        console.log('연결해제');
      },

      // debug: (str) => {
      //   console.log(str);
      // },
    });

    client.current.activate();
    //

    return () => {
      client.current.deactivate();
    };
  }, [roomId]);

  const send = (data) => {
    // 사용자가 웹소켓에 연결되지 않았을때는 보내지 않음
    if (!client.current.connected) {
      alert('연결이 끊겼습니다.');
      return;
    }

    client.current.publish({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      destination: '/pub/chat/message',
      body: JSON.stringify({
        chatUser: chatUser,
        chatData: {
          userNo: myNo,
          message: data.message,
        },
        roomId: roomId,
      }),
    });
    resetField('message');
  };

  return (
    <>
      <div className='chatRoomWrap'>
        <div className='chatListWrap' ref={scrollRef}>
          {chatMessage &&
            chatMessage.map((chat, index) => {
              if (myNo === Number(chat.userNo)) {
                return (
                  <div className='msgWrap myMsg' key={index}>
                    <div className='content darkModeElement myContent'>
                      {chat.message}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className='msgWrap' key={index}>
                    <div className='name'>{receiver}</div>
                    <div className='content darkModeElement'>
                      {chat.message}
                    </div>
                  </div>
                );
              }
            })}
          <div ref={scrollRef} />
        </div>
        <form className='chatForm' onSubmit={handleSubmit(send)}>
          <input
            className='darkModeElement'
            {...register('message', { required: true })}
          ></input>
          <button className='btnElement'>SEND</button>
        </form>
      </div>
    </>
  );
}
