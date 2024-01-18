'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useRequest from '../../../hooks/use-request';

export default () => {
  const { push, refresh } = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      push('/');
      refresh();
    },
  });

  // const onSubmit = async (event: FormEvent) => {
  //   event.preventDefault();
  //   await doRequest();
  // };

  useEffect( () => {
    doRequest();
  }, []);

  return (<>
    <div>Signing you out...</div>
    { errors }
  </>);
}
