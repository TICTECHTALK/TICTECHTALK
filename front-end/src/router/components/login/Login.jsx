import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, setUser } from 'store/slice/userSlice';
import mypage from 'style/loginAndJoin.css';

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch();

  const loginHandler = async (data) => {
    const res = await dispatch(login(data));
    if (res.payload) {
      dispatch(setUser(res.payload));
      navigate('/');
    }
  };

  return (
    <div className='loginNjoinBox roundedRectangle darkModeElement'>
      <div className='goTojoinBtn btnElement' onClick={() => navigate('/join')}>
        JOIN US
      </div>
      <form
        className='formBox'
        method='post'
        onSubmit={handleSubmit(loginHandler)}
      >
        <div className='formInput'>
          <input
            type='text'
            name='inputEmail'
            placeholder='📧이메일을 입력해주세요.'
            {...register('userEmail', { required: true })}
          />
          <input
            type='password'
            name='inputPassword'
            placeholder='🔑비밀번호를 입력해주세요.'
            {...register('password', { required: true })}
          />
        </div>
        <button className='btnElement' type='submit'>
          LOGIN
        </button>
      </form>
    </div>
  );
}
