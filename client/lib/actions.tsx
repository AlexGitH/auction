import buildClient from '@/app/api/build-client';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';

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

export async function getReqHeaders() {
  const cookieStore = cookies();
  const session = cookieStore.get('session');
  const cookie = `session=${session?.value}`;

  const headerList = headers();
  const host = headerList.get('host')||'';

  return {
    headers: {
      Host: host,
      'Cookie': cookie,
    },
  };
}

