import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getBookmarkList, getMyPost } from 'store/slice/userSlice';

export default function ReadOnlyBoard() {
  const [postList, setPostList] = useState([]);
  const dispatch = useDispatch();
  const category = useLocation().pathname.split('/')[2];

  const getPost = async () => {
    const res = await dispatch(
      category === 'bookmark' ? getBookmarkList() : getMyPost()
    );
    console.log(res);
    setPostList(res.payload);
  };
  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <div
        className='boardListBox darkModeElement'
        style={{ borderRadius: '0 0 10px 10px' }}
      >
        <table className='boardList'>
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Name</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {postList.map((post) => (
              <tr key={post.postNo}>
                <td>{post.postNo}</td>
                <td>
                  <Link
                    to={`/boards/${post.postNo}`}
                    state={{ categoryName: category }}
                    className='sub'
                  >
                    {post.title}
                  </Link>
                </td>
                <td>{post.userNick}</td>
                <td>{new Date(post.postDate).toLocaleDateString()}</td>
                <td>{post.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
