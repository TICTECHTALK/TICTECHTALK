import {Link, useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Instance from '../../../util/axiosConfig';
import board from 'style/board.css';

export default function Board() {
  const category = useLocation().pathname.split('/')[2];
  const [forumList, setForumList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, category]);

  const fetchData = (page) => {
    Instance.get(`boards/${category}?page=${page}`)
      .then((response) => {
        setForumList(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.log(err));
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
            {forumList.map((forum) => (
              <tr key={forum.postNo}>
                <td>{forum.postNo}</td>
                <td>
                  <Link to={`/boards/${forum.postNo}`} className='sub'>
                    {forum.title}
                  </Link>
                  {/*<Link to={`/boards/${forum.postNo}`} className='comm'>*/}
                  {/*  {' '}*/}
                  {/*  [{forum.commentCount || 0}]*/}
                  {/*</Link>*/}
                  <span className='comm'>
                    {' '}
                    [{forum.commentCount || 0}]
                  </span>
                </td>
                <td>{forum.userNick}</td>
                <td>{new Date(forum.postDate).toLocaleDateString()}</td>
                <td>{forum.views}</td>
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
