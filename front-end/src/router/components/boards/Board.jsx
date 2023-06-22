import { Link, useLocation } from 'react-router-dom';

export default function Board() {
  const category = useLocation().pathname.split('/')[2];
  return (
    <>
      <div className='boardListBox roundedRectangle darkModeElement'>
        <table className='boardList'>
          <thead>
            <tr>
              <th>No</th>
              <th>Subject</th>
              <th>Name</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
                <Link to='#' className='comm'>
                  {' '}
                  [2]
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>3</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>4</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
                <Link to='#' className='comm'>
                  {' '}
                  [2]
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>5</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>6</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>7</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>8</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>9</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>10</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>11</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>12</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>13</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>14</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
            <tr>
              <td>15</td>
              <td>
                <Link to='#' className='sub'>
                  너무너무 행복해
                </Link>
              </td>
              <td>김방토</td>
              <td>2023-06-07</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
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
