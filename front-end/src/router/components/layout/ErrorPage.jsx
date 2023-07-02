import { useLocation } from 'react-router-dom';

export default function ErrorPage() {
  const state = useLocation().state;
  return (
    <div className='errorPage'>
      OOPS! TTT is Not Ready for it...!
      <br />
      Error Code : {state}
    </div>
  );
}
