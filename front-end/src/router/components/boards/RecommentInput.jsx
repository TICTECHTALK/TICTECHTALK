import { useDispatch } from 'react-redux';
import { recmWrite } from 'store/slice/commentSlice';
import { useForm } from 'react-hook-form';

export default function RecommentInput({ cmId }) {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const recmWriteHanlder = async (data) => {
    console.log(data);
    await dispatch(recmWrite({ recmContent: data.recmContent, cmId: cmId }));
  };

  return (
    <form className='cmWriteForm' onSubmit={handleSubmit(recmWriteHanlder)}>
      <textarea
        className='darkModeElement'
        name='cmContent'
        {...register('recmContent')}
      ></textarea>
      <button type='submit' className='btnElement'>
        WRITE
      </button>
    </form>
  );
}
