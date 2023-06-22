import { useEffect, useRef, useState } from 'react';
// import {
//   connectWebSocket,
//   disconnectWebSocket,
//   subscribeToTopic,
//   sendMessage,
// } from '../store/WebSocketUtility';
import { useForm } from 'react-hook-form';
import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

///////////////////////////////////////////////////////////////////////////////////////////////

export default function ChatRoom() {
  const { register, handleSubmit, resetField } = useForm();
  const { roomId } = useParams();

  const [chats, setChats] = useState([]);

  const client = useRef({});
  const accessToken = localStorage.getItem('accessToken');
  const user = useSelector((state) => state.user);
  useEffect(() => {
    client.current = new StompJs.Client({
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws-stomp');
      },
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        console.log('연결성공');
        client.current.subscribe(
          `/sub/${roomId}`,
          (msg) => {
            const res = JSON.parse(msg.body);
            console.log(res);
            // const newChat = { sender: res.sender, message: res.message };
            setChats((chats) => [...chats, res]);
          },
          {
            Authorization: `Bearer ${accessToken}`,
          }
        );
      },
      onDisconnect: () => {
        console.log('연결해제');
      },
    });

    client.current.activate();

    return () => {
      client.current.deactivate();
    };
  }, []);

  const send = (data) => {
    // 사용자가 웹소켓에 연결되지 않았을때는 보내지 않음
    if (!client.current.connected) {
      return;
    }

    client.current.publish({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      destination: '/pub/chat/message',
      body: JSON.stringify({
        roomId: roomId,
        userNo: user.userNo,
        message: data.content,
      }),
    });
    resetField('content');
  };

  return (
    <div>
      <form onSubmit={handleSubmit(send)}>
        <input
          type='text'
          placeholder='메세지를 입력하세요.'
          {...register('content', { required: true })}
        />
        <button type='submit'>전송</button>
      </form>
      <hr />
      {chats.map((chat, index) => (
        <div key={index}>
          {chat.sender}: {chat.message}
        </div>
      ))}
    </div>
  );
}
