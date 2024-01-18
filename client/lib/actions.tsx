import buildClient from '@/app/api/build-client';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function getCurrentUser(cookie:string) {
  const headerList = headers();
  const host = headerList.get('host')||'';
  const req = {
    headers: {
      Host: host,
      'Cookie': cookie,
    },
  };
  console.log('__________________cookie', cookie);
  console.log('__________________Headers: host', host);


  const client = buildClient({ req });
  const { data } = await client.get('/api/users/currentuser'); // run the async request
  console.log('-----currentUser', data);
  revalidatePath('/', 'layout');
  return data;
}
