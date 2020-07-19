// https://medium.com/hackernoon/formik-handling-files-and-recaptcha-209cbeae10bc

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import geolocator from 'geolocator';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';

import { accountService, alertService } from '@/_services';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

const dropzoneStyle = {
  width: '100%',
  height: 'auto',
  borderWidth: 2,
  borderColor: 'rgb(102, 102, 102)',
  borderStyle: 'dashed',
  borderRadius: 5,
};

function Update({ history }) {
  const user = accountService.userValue;
  const reader = new FileReader();

  const initialValues = {
    first_name: user.first_name,
    last_name: user.last_name,
    username: '',
    age: 18,
    email: user.email,
    gender: user.gender,
    orientation: user.orientation,
    location: '',
    smoking: user.smoking,
    drinking: user.drinking,
    religion: user.religion,
    pets: user.pets,
    children: user.children,
    bio: '',
    password: '',
    confirmPassword: '',
    picture_1: null,
    picture_2: null,
    picture_3: null,
    picture_4: null,
    picture_5: null,
    files: [],
  };

  useEffect(() => {
    var options = {};

    geolocator.locateByIP(options, function (err, location) {
      console.log(err);
      setArea(location.address.state);
      onLocation();
    });
  });

  const [area, setArea] = useState(null);

  //TODO: bio text input validation
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    // username: Yup.string().required('Username is required'),
    age: Yup.number()
      .min(18)
      .max(100)
      .required('Age is required to be a number'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .when('password', (password, schema) => {
        if (password) return schema.required('Confirm Password is required');
      })
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    console.log(fields);
    console.log(fields.picture_1);

    accountService
      .update(fields)
      .then(() => {
        alertService.success('Update successful', {
          keepAfterRouteChange: true,
        });
        history.push('.');
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  const [isDeleting, setIsDeleting] = useState(false);
  function onDelete() {
    if (confirm('Are you sure?')) {
      setIsDeleting(true);
      accountService
        .delete(user.id)
        .then(() => alertService.success('Account deleted successfully'));
    }
  }

  const [isLocation, setIsLocation] = useState(false);
  function onLocation() {
    setIsLocation(true);
    if (area != null) {
      alertService.info(
        `We suggest you set your area's location to ~${area}~ for best results!`
      );
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <h1>Update Profile</h1>
          <div className='form-row'>
            <div className='form-group col-2'>
              <label>Area</label>
              <Field
                name='location'
                as='select'
                className={
                  'form-control' +
                  (errors.location && touched.location ? ' is-invalid' : '')
                }
              >
                <option value=''>Select</option>
                <option value='Eastern Cape'>Eastern Cape</option>
                <option value='Free State'>Free State</option>
                <option value='Gauteng'>Gauteng</option>
                <option value='KwaZulu-Natal'>KwaZulu-Natal</option>
                <option value='Limpopo'>Limpopo</option>
                <option value='Mpumalanga'>Mpumalanga</option>
                <option value='Northern Cape'>Northern Cape</option>
                <option value='North-West'>North-West</option>
                <option value='Western Cape'>Western Cape</option>
                <option value='Other'>Other</option>
              </Field>
              <ErrorMessage
                name='location'
                component='div'
                className='invalid-feedback'
              />
            </div>
          </div>
          {/* Name & Surname*/}
          <div className='form-row'>
            <div className='form-group col-5'>
              <label>First Name</label>
              <Field
                name='first_name'
                type='text'
                className={
                  'form-control' +
                  (errors.first_name && touched.first_name ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name='first_name'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-5'>
              <label>Last Name</label>
              <Field
                name='last_name'
                type='text'
                className={
                  'form-control' +
                  (errors.last_name && touched.last_name ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name='last_name'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-1'>
              <label>Age</label>
              <Field
                name='age'
                type='number'
                className={
                  'form-control' +
                  (errors.age && touched.age ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name='age'
                component='div'
                className='invalid-feedback'
              />
            </div>
          </div>
          <div className='form-group'>
            <label>Username</label>
            <Field
              name='username'
              type='text'
              className={
                'form-control' +
                (errors.username && touched.username ? ' is-invalid' : '')
              }
            />
            <ErrorMessage
              name='username'
              component='div'
              className='invalid-feedback'
            />
          </div>
          {/* Email */}
          <div className='form-group'>
            <label>Email</label>
            <Field
              name='email'
              type='text'
              className={
                'form-control' +
                (errors.email && touched.email ? ' is-invalid' : '')
              }
            />
            <ErrorMessage
              name='email'
              component='div'
              className='invalid-feedback'
            />
          </div>
          {/* Passwords */}
          <h3 className='pt-3'>Change Password</h3>
          <p>Leave blank to keep the same password</p>
          <div className='form-row'>
            <div className='form-group col'>
              <label>Password</label>
              <Field
                name='password'
                type='password'
                className={
                  'form-control' +
                  (errors.password && touched.password ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name='password'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-5'>
              <label>Confirm Password</label>
              <Field
                name='confirmPassword'
                type='password'
                className={
                  'form-control' +
                  (errors.confirmPassword && touched.confirmPassword
                    ? ' is-invalid'
                    : '')
                }
              />
              <ErrorMessage
                name='confirmPassword'
                component='div'
                className='invalid-feedback'
              />
            </div>
          </div>

          {/* Orientation & Gender */}
          <h1>Orientation</h1>
          <div className='form-row'>
            <div className='form-group col-2'>
              <label>Gender</label>
              <Field
                name='gender'
                as='select'
                className={
                  'form-control' +
                  (errors.gender && touched.gender ? ' is-invalid' : '')
                }
              >
                <option value=''>Select</option>
                <option value='non binary'>Non Binary</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </Field>
              <ErrorMessage
                name='gender'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-2'>
              <label>Interested in</label>
              <Field
                name='orientation'
                as='select'
                className={
                  'form-control' +
                  (errors.orientation && touched.orientation
                    ? ' is-invalid'
                    : '')
                }
              >
                <option value=''>Select</option>
                <option value='any'>Either</option>
                <option value='homosexual'>Homosexual</option>
                <option value='heterosexual'>Heterosexual</option>
              </Field>
              <ErrorMessage
                name='orientation'
                component='div'
                className='invalid-feedback'
              />
            </div>
          </div>
          {/* Tags */}
          <h2>Tags</h2>
          <div className='form-row'>
            <div className='form-group col-2'>
              <label>Smoking?</label>
              <Field
                name='smoking'
                as='select'
                className={
                  'form-control' +
                  (errors.smoking && touched.smoking ? ' is-invalid' : '')
                }
              >
                <option value=''>Select</option>
                <option value='0'>No</option>
                <option value='1'>Yes</option>
              </Field>
              <ErrorMessage
                name='smoking'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-2'>
              <label>Drinking?</label>
              <Field
                name='drinking'
                as='select'
                className={
                  'form-control' +
                  (errors.drinking && touched.drinking ? ' is-invalid' : '')
                }
              >
                <option value=''>Select</option>
                <option value='0'>No</option>
                <option value='1'>Yes</option>
              </Field>
              <ErrorMessage
                name='drinking'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-2'>
              <label>Religious?</label>
              <Field
                name='religion'
                as='select'
                className={
                  'form-control' +
                  (errors.religion && touched.religion ? ' is-invalid' : '')
                }
              >
                <option value=''>Select</option>
                <option value='0'>No</option>
                <option value='1'>Yes</option>
              </Field>
              <ErrorMessage
                name='religion'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-2'>
              <label>Pets?</label>
              <Field
                name='pets'
                as='select'
                className={
                  'form-control' +
                  (errors.pets && touched.pets ? ' is-invalid' : '')
                }
              >
                <option value=''>Select</option>
                <option value='0'>No</option>
                <option value='1'>Yes</option>
              </Field>
              <ErrorMessage
                name='pets'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-2'>
              <label>Children?</label>
              <Field
                name='children'
                as='select'
                className={
                  'form-control' +
                  (errors.children && touched.children ? ' is-invalid' : '')
                }
              >
                <option value=''>Select</option>
                <option value='0'>No</option>
                <option value='1'>Yes</option>
              </Field>
              <ErrorMessage
                name='children'
                component='div'
                className='invalid-feedback'
              />
            </div>
          </div>
          <div className='form-group'>
            <h2>Bio</h2>
            <label>Write a short bio about yourself</label>
            <Field
              name='bio'
              type='text'
              className={
                'form-control' +
                (errors.bio && touched.bio ? ' is-invalid' : '')
              }
            />
            <ErrorMessage
              name='bio'
              component='div'
              className='invalid-feedback'
            />
          </div>
          {/* Pictures */}
          <div className='form-group'>
            <h1>Picture Uploads</h1>
            <Field name='picture_1' component={FileUpload} />
            <Field name='picture_2' component={FileUpload} />
            <Field name='picture_3' component={FileUpload} />
            <Field name='picture_4' component={FileUpload} />
            <Field name='picture_5' component={FileUpload} />
          </div>
          {/* Submit Buttons */}
          <div className='form-group'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='btn btn-primary mr-2'
            >
              {isSubmitting && (
                <span className='spinner-border spinner-border-sm mr-1'></span>
              )}
              Update
            </button>
            <button
              type='button'
              onClick={() => onDelete()}
              className='btn btn-danger'
              style={{ width: '75px' }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className='spinner-border spinner-border-sm'></span>
              ) : (
                <span>Delete</span>
              )}
            </button>
            <Link to='.' className='btn btn-link'>
              Cancel
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function FileUpload(props) {
  const { field, form } = props;

  const handleChange = (e) => {
    const file = e.currentTarget.files[0];
    const reader = new FileReader();
    const imgTag = document.getElementById('myimage');
    imgTag.title = file.name;
    reader.onload = function (event) {
      imgTag.src = event.target.result;
    };
    reader.readAsDataURL(file); // <-
    form.setFieldValue(field.name, file);
  };

  return (
    <div className='w-50 p-3'>
      <input
        type={'file'}
        onChange={(o) => handleChange(o)}
        className={'form-control'}
      />
      <img src={''} className='img-fluid' alt='upload' id={'myimage'} />
    </div>
  );
}

export { Update };
