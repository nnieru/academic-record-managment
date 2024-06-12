import * as Yup from 'yup';

const RecordSchema = Yup.object().shape({
  title: Yup.string().min(5, 'Too Short!').required('Required'),
  issueDate: Yup.date().max(new Date(), 'Invalid Date').required('Required'),
  credential: Yup.string().min(5, 'Too Short!').required('Required'),
  description: Yup.string().nullable(),
});

export { RecordSchema };
