import { useDispatch } from 'react-redux';
import { getRecmList, recmWrite } from 'store/slice/commentSlice';
import { useForm } from 'react-hook-form';

export default function RecommentInput({
  cmId,
  getRecomments,
  clostRecmInput,
}) {
  const dispatch = useDispatch();
  const { register, handleSubmit, resetField } = useForm();

  const recmWriteHanlder = async (data) => {
    const res = await dispatch(
      recmWrite({ recmContent: data.recmContent, cmId: cmId })
    );
    resetField('recmContent');
    clostRecmInput();
    getRecomments();
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
