import { useDispatch } from 'react-redux';
import { getRecmList, recmWrite } from 'store/slice/commentSlice';
import { useForm } from 'react-hook-form';

export default function RecommentInput({ cmId, getRecomments, setShowRecm }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, resetField } = useForm();

  const recmWriteHanlder = async (data) => {
    const res = await dispatch(
      recmWrite({ recmContent: data.recmContent, cmId: cmId })
    );
    resetField('recmContent');
    getRecomments();
    setShowRecm(false);
  };

  return (
    <form
      className='cmWriteForm recmWriteForm'
      onSubmit={handleSubmit(recmWriteHanlder)}
    >
      <textarea
        placeholder='답글을 입력해주세요!'
        className='darkModeElement'
        name='cmContent'
        {...register('recmContent')}
      ></textarea>
      <button type='submit' className='btnElement'>
        RECOMMENT
      </button>
    </form>
  );
}
