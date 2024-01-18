'use client'

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import useRequest from '../../../hooks/use-request';
// import { revalidatePath } from 'next/cache';

export default () => {

  // const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      // router.push('/');
      redirect('/'+`?timestamp=${new Date().getTime()}`);
      // revalidatePath('/', 'layout');
    },
  });

  // const onSubmit = async (event: FormEvent) => {
  //   event.preventDefault();
  //   await doRequest();
  // };

  useEffect( () => {
    doRequest();
    //.then(()=> revalidatePath('/', 'layout'));
  }, []);

  return (<>
    <div>Signing you out...</div>
    { errors }
  </>);
}
