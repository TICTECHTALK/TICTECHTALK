import { useEffect, useState } from 'react';
import Instance from "../../../util/axiosConfig";
import {useNavigate} from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  const [forumPosts, setForumPosts] = useState([]);
  const [qnaPosts, setQnaPosts] = useState([]);
  const [referencePosts, setReferencePosts] = useState([]);

  const handlePostClick = (postNo) => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
          // 토큰이 없는 경우 알림창 띄우기
          alert('로그인이 필요합니다.');
          navigate('/');
      } else {
          navigate(`/boards/${postNo}`);
      }
  };


    useEffect(() => {
        // Forum 게시판 목록 가져오기
        Instance.get(`/boards/forum?page=1&size=5&sort=postDate,desc`)
            .then((response) => {
                setForumPosts(response.data.content);
            })
            .catch((error) => {
                console.log(error);
            });

        // QnA 게시판 목록 가져오기
        Instance.get(`/boards/qna?page=1&size=5&sort=postNo,desc`)
            .then((response) => {
                setQnaPosts(response.data.content);
            })
            .catch((error) => {
                console.log(error);
            });

        // Reference 게시판 목록 가져오기
        Instance.get(`/boards/reference?page=1&size=5&sort=postNo,desc`)
            .then((response) => {
                setReferencePosts(response.data.content);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    return (
      <>
        <div className='mainBoards'>
          <div className='mainboard roundedRectangle darkModeElement' id='mainForum'>
            {forumPosts.map((post) => (
                <div key={post.postNo}>
                  <div>{post.userNick}</div>
                    <div onClick={()=> handlePostClick(post.postNo)}>{post.title}</div>
                  <div>{post.views}</div>
                  <div>{post.content}</div>
                  <div>{post.commentCount}</div>
                </div>
            ))}
          </div>
          <div className='mainboard roundedRectangle darkModeElement' id='mainQNA'>
            {qnaPosts.map((post) => (
                <div key={post.postNo}>
                  <div>{post.userNick}</div>
                  <div onClick={()=> handlePostClick(post.postNo)}>{post.title}</div>
                  <div>{post.views}</div>
                  <div>{post.content}</div>
                  <div>{post.commentCount}</div>
                </div>
            ))}
          </div>
          <div className='mainboard roundedRectangle darkModeElement' id='mainReference'>
            {referencePosts.map((post) => (
                <div key={post.postNo}>
                  <div>{post.userNick}</div>
                  <div onClick={()=> handlePostClick(post.postNo)}>{post.title}</div>
                  <div>{post.views}</div>
                  <div>{post.content}</div>
                  <div>{post.commentCount}</div>
                </div>
            ))}
          </div>
        </div>
      </>
  );
}
