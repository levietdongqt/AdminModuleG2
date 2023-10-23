import * as yup from 'yup';

const ValidationSchemaMap = yup.object({
    name: yup
      .string('Enter name')
      .required('Username is required')
      .min(3, 'Template name is must have greater than 3 letter'),
    pricePlusPerOne: yup
      .number('Enter price plus')
      .required('Price Plus is required')
      .min(0, 'Price Plus must be greater than 0')
      .max(100, 'Price Plus must be less than 100'),
    title: yup.string('Enter Title').required('Title is required'),
    sizeSelected: yup.array().min(1, 'Please select at least one size'),
    description: yup
      .string('Enter ...')
      .test('no-bad-words', 'Please avoid using inappropriate words', (value) => {
        if (!value) return true; // Cho phép trường rỗng
        const badWords = ['bitch', 'fuck']; // Danh sách từ cấm
        return !badWords.some((word) => value.includes(word));
      })
      .required('Description is required'),
  });

  export default ValidationSchemaMap;