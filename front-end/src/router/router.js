// 컴포넌트
import { Board, Chat, ChatMain, UserList } from './components';
import { ReadOnlyBoard } from './components';
import { BoardView } from './components';
import { BoardUpdate } from './components';
import { BoardWrite } from './components';
import { Comment } from './components';
import { Layout } from './components';
import { Main } from './components';
import { Mypage } from './components';
import { MypageUpdate } from './components';
import { MypageNav } from './components';
import { Login } from './components';
import { Join } from './components';

import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Main />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'join',
        element: <Join />,
      },
    ],
  },
  {
    path: 'boards',
    element: <Layout />,
    children: [
      {
        path: 'forum',
        element: <Board />,
      },
      {
        path: 'qna',
        element: <Board />,
      },
      {
        path: 'reference',
        element: <Board />,
      },
      {
        path: ':postNo',
        element: (
          <>
            <BoardView />
            <Comment />
          </>
        ),
      },
      {
        path: 'write',
        element: <BoardWrite />,
      },
      {
        path: 'update/:postNo',
        element: <BoardUpdate />,
      },
    ],
  },
  {
    path: '/mypage',
    element: <Layout />,
    children: [
      {
        path: '',
        element: (
          <>
            <MypageNav />
            <Mypage />
          </>
        ),
      },
      {
        path: ':userno',
        element: (
          <>
            <MypageNav />
            <MypageUpdate />
          </>
        ),
      },
      {
        path: 'bookmark',
        element: (
          <>
            <MypageNav />
            <ReadOnlyBoard />
          </>
        ),
      },
      {
        path: 'mypost',
        element: (
          <>
            <MypageNav />
            <ReadOnlyBoard />
          </>
        ),
      },
    ],
  },
  {
    path: '/chat',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <UserList />,
        children: [
          {
            path: '',
            element: <ChatMain />,
          },
          {
            path: ':roomId',
            element: <Chat />,
          },
        ],
      },
    ],
  },
]);

export default router;
