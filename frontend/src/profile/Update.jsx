import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '@/_services';

function Update({ history }) {
  const user = accountService.userValue;
  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
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
    accountService
      .update(user.id, fields)
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <h1>Update Profile</h1>
          {/* Name & Surname*/}
          <div className='form-row'>
            <div className='form-group col-5'>
              <label>First Name</label>
              <Field
                name='firstName'
                type='text'
                className={
                  'form-control' +
                  (errors.firstName && touched.firstName ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name='firstName'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-5'>
              <label>Last Name</label>
              <Field
                name='lastName'
                type='text'
                className={
                  'form-control' +
                  (errors.lastName && touched.lastName ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name='lastName'
                component='div'
                className='invalid-feedback'
              />
            </div>
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
          <h3 className='pt-3'>Change Password</h3>
          <p>Leave blank to keep the same password</p>
          {/* Passwords */}
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
          {/* Tags */}
          <div className='form-row'>
            <div className='form-group col-1'>
              <label>Smoking?</label>
              <Field
                name='Smoking'
                as='select'
                className={
                  'form-control' +
                  (errors.title && touched.title ? ' is-invalid' : '')
                }
              >
                <option value=''></option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </Field>
              <ErrorMessage
                name='title'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-1'>
              <label>Drinking?</label>
              <Field
                name='Drinking'
                as='select'
                className={
                  'form-control' +
                  (errors.title && touched.title ? ' is-invalid' : '')
                }
              >
                <option value=''></option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </Field>
              <ErrorMessage
                name='title'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-1'>
              <label>Religious?</label>
              <Field
                name='Religious'
                as='select'
                className={
                  'form-control' +
                  (errors.title && touched.title ? ' is-invalid' : '')
                }
              >
                <option value=''></option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </Field>
              <ErrorMessage
                name='title'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-1'>
              <label>Pets?</label>
              <Field
                name='Pets'
                as='select'
                className={
                  'form-control' +
                  (errors.title && touched.title ? ' is-invalid' : '')
                }
              >
                <option value=''></option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </Field>
              <ErrorMessage
                name='title'
                component='div'
                className='invalid-feedback'
              />
            </div>
            <div className='form-group col-1'>
              <label>Children?</label>
              <Field
                name='Children'
                as='select'
                className={
                  'form-control' +
                  (errors.title && touched.title ? ' is-invalid' : '')
                }
              >
                <option value=''></option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </Field>
              <ErrorMessage
                name='title'
                component='div'
                className='invalid-feedback'
              />
            </div>
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

export { Update };
