import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { join } from 'store/slice/userSlice';

export default function Join() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const password1 = watch('password');
  const password2 = watch('passwordConfirm');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const joinHandler = async (data) => {
    const res = await dispatch(join(data));
    if (res.payload) {
      navigate('/login');
    }
  };

  return (
    <div className='loginNjoinBox roundedRectangle darkModeElement'>
      <form className='formBox' onSubmit={handleSubmit(joinHandler)}>
        <div className='formInput'>
          <input
            type='email'
            name='inputEmail'
            placeholder='📧이메일'
            {...register('userEmail', { required: true })}
          />
          <input
            type='password'
            name='password'
            placeholder='🔑비밀번호'
            {...register('password', {
              pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/,
                message:
                  '영문 소문자, 숫자로 이루어진 8~20자 비밀번호를 입력해주세요.',
              },
            })}
          />
          <div
            className='errBox'
            hidden={errors && errors?.password?.message ? false : true}
          >
            {errors && errors?.password?.message}
          </div>
          <input
            type='password'
            name='passwordConfirm'
            {...register('passwordConfirm', {
              required: true,
            })}
            placeholder='🔑비밀번호 확인'
          />
          <div
            className='errBox'
            hidden={password1 === password2 ? true : false}
          >
            {password1 === password2 ? '' : '비밀번호가 다릅니다.'}
          </div>
          <input
            type='text'
            name='inputPassword'
            placeholder='👤닉네임'
            {...register('userNick', { required: true })}
          />
        </div>
        <button
          className='btnElement'
          type='submit'
          disabled={errors?.password || password1 !== password2 ? true : false}
        >
          JOIN
        </button>
      </form>
    </div>
  );
}
