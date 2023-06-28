import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Instance from '../../../util/axiosConfig';
import board from 'style/board.css';
import { useDispatch } from 'react-redux';
import { getBoardList } from 'store/slice/boardSlice';

export default function Board() {
  const category = useLocation().pathname.split('/')[2];
  const [postList, setPostList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    getList();
  }, [currentPage, category]);

  const getList = async () => {
    const res = await dispatch(
      getBoardList({ category: category, page: currentPage })
    );
    console.log(res.payload);
    if (res.payload) {
      setPostList(res.payload.content);
      setTotalPages(res.payload.totalPages);
    }

    // Instance.get(`boards/${category}?page=${page}`)
    //   .then((response) => {
    //     console.log(response.data);
    //     setPostList(response.data.content);
    //     setTotalPages(response.data.totalPages);
    //   })
    //   .catch((err) => console.log(err));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className='boardListBox roundedRectangle darkModeElement'>
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
                  <span className='comm'> [{post.commentCount || 0}]</span>
                </td>
                <td>{post.userNick}</td>
                <td>{new Date(post.postDate).toLocaleDateString()}</td>
                <td>{post.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination'>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter((page) => Math.abs(page - currentPage) <= 2)
            .map((page) => (
              <button
                key={page}
                className={page === currentPage ? 'active' : ''}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
        </div>
        <div className='btnBox'>
          <button className='writeBtn btnElement'>
            <Link to='/boards/write' state={{ categoryName: category }}>
              WRITE
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}
