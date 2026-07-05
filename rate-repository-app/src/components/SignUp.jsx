import { TextInput, Pressable, View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client/react';
import * as yup from 'yup';
import Text from './Text';
import { CREATE_USER } from '../graphql/mutations';
import useSignIn from '../hooks/useSignIn';

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
  username: yup
    .string()
    .min(5, 'Username must be between 5 and 30 characters')
    .max(30, 'Username must be between 5 and 30 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be between 5 and 50 characters')
    .max(50, 'Password must be between 5 and 50 characters')
    .required('Password is required'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Password confirmation must match the password')
    .required('Password confirmation is required'),
});

const initialValues = {
  username: '',
  password: '',
  passwordConfirm: '',
};

const SignUp = () => {
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await createUser({
        variables: {
          user: {
            username,
            password,
          },
        },
      });

      await signIn({ username, password });
      navigate('/');
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
      <FormField name="username" placeholder="Username" formik={formik} />
      <FormField name="password" placeholder="Password" secureTextEntry formik={formik} />
      <FormField name="passwordConfirm" placeholder="Password confirmation" secureTextEntry formik={formik} />
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
    </View>
  );
};

export default SignUp;