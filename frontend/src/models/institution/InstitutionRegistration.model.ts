import * as Yup from 'yup';

const InstitutionRegistrationSchema = Yup.object().shape({
    email: Yup.string()
    .email('Invalid Email')
    .required('Required'),
    name: Yup.string()
    .min(3, 'Too Short!')
    .required('Required')

});

export { InstitutionRegistrationSchema }