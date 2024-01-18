'use client'

import { FormEvent, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import useRequest from '../../../hooks/use-request';
// import { revalidatePath } from 'next/cache';
// import { useRouter } from 'next/router';

export default () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email, password,
    },
    onSuccess: () => {
      router.push('/');
      // revalidatePath('/', 'layout');
      // redirect('/'+`?timestamp=${new Date().getTime()}`);
    },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>
        Sign In
      </h1>
      <div className="form-group">
        <label>
          Email Address
        </label>
        <input
          value={ email }
          onChange={ e => setEmail(e.target.value) }
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>
          Password
        </label>
        <input
          value={ password }
          onChange={ e => setPassword(e.target.value) }
          type="password"
          className="form-control"
        />
      </div>
      <button className="btn btn-primary">Sign In</button>
      { errors }
    </form>
  );
}
