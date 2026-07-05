import { TextInput, Pressable, View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client/react';
import * as yup from 'yup';
import Text from './Text';
import { CREATE_REVIEW } from '../graphql/mutations';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: '#da2b3d',
  },
  button: {
    backgroundColor: '#125096',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#da2b3d',
    marginBottom: 10,
  },
});

const FormField = ({ name, placeholder, formik, ...props }) => {
  const showError = formik.touched[name] && formik.errors[name];

  return (
    <>
      <TextInput
        placeholder={placeholder}
        value={formik.values[name]}
        onChangeText={formik.handleChange(name)}
        onBlur={formik.handleBlur(name)}
        style={[styles.input, showError && styles.inputError]}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{formik.errors[name]}</Text>}
    </>
  );
};

const validationSchema = yup.object().shape({
  ownerName: yup.string().required('Repository owner\'s username is required'),
  repositoryName: yup.string().required('Repository\'s name is required'),
  rating: yup
    .number()
    .typeError('Rating must be a number')
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100')
    .required('Rating is required'),
  text: yup.string().optional(),
});

const initialValues = {
  ownerName: '',
  repositoryName: '',
  rating: '',
  text: '',
};

const CreateReview = () => {
  const [createReview] = useMutation(CREATE_REVIEW);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;

    try {
      const { data } = await createReview({
        variables: {
          review: {
            ownerName,
            repositoryName,
            rating: Number(rating),
            text,
          },
        },
      });

      if (data?.createReview?.repositoryId) {
        navigate(`/repository/${data.createReview.repositoryId}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <View style={styles.container}>
      <FormField name="ownerName" placeholder="Repository owner's username" formik={formik} />
      <FormField name="repositoryName" placeholder="Repository's name" formik={formik} />
      <FormField name="rating" placeholder="Rating between 0 and 100" keyboardType="numeric" formik={formik} />
      <FormField name="text" placeholder="Review" multiline formik={formik} />

      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Create a review</Text>
      </Pressable>
    </View>
  );
};

export default CreateReview;