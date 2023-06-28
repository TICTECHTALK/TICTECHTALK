import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { boardSearch } from 'store/slice/boardSlice';

export default function SearchBoard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState(useLocation().state);
  const [searchResult, setSearchResult] = useState([]);

  const dispatch = useDispatch();

  const getResult = async () => {
    const res = await dispatch(
      boardSearch({ searchKeyword: searchKeyword, page: currentPage })
    );
    console.log(res);
    setSearchResult(res.payload.content);
    setTotalPages(res.payload.totalPages);
  };

  useEffect(() => {
    // console.log(searchKeyword);
    getResult();
  }, []);

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
            {searchResult &&
              searchResult.map((result) => (
                <tr key={result.postNo}>
                  <td>{result.postNo}</td>
                  <td>
                    <Link to={`/boards/${result.postNo}`} className='sub'>
                      {result.title}
                    </Link>
                    <Link to={`/boards/${result.postNo}`} className='comm'>
                      {' '}
                      [{result.commentCount || 0}]
                    </Link>
                  </td>
                  <td>{result.userNick}</td>
                  <td>{new Date(result.postDate).toLocaleDateString()}</td>
                  <td>{result.views}</td>
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
      </div>
    </>
  );
}
