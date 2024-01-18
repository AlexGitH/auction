// import './globals.css'
import 'bootstrap/dist/css/bootstrap.css';
import Header from '@/components/Header';
// import Header from '../components/Header';
import buildClient from './api/build-client';

import { revalidatePath } from 'next/cache';

import { headers, cookies } from 'next/headers'

async function getCurrentUser(cookie:string) {
  // const url: string =  'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
  // // const { data } = await (await fetch(url + '/api/users/currentuser')).json(); // run the async request
  // console.log('-----isBrowser', typeof window !== 'undefined');

  // // const data = await (await fetch(url + '/api/users/currentuser'));
  // const data = await (await fetch('0.0.0.0/api/users/currentuser'));

  // console.log('-----currentUser', data);
  // return data?.json();

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

//   const url = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
//   const res = await fetch(
//     url+'/api/users/currentuser',
//     {
//       // method: "POST", // or 'PUT'
//       // headers: {
//       //   "Content-Type": "application/json",
//       //   Host: host,
//       // },

//       ...req,
//       cache: 'no-cache',
//     }
//   );

//   const data = await res.json();

  console.log('-----currentUser', data);
  revalidatePath('/', 'layout');
  return data;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const cookieStore = cookies();
  const session = cookieStore.get('session');
  const cookie = `session=${session?.value}`;

  console.log('================ cookie', cookie);
  const data = await getCurrentUser(cookie);

  console.log('================ data', JSON.stringify(data, null, 2));
  return (
    <html lang="en">
      <body>
        <Header currentUser={data?.currentUser}/>
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  )
}

// RootLayout.getStaticProps = async (appContext:any) => {
//   console.log('------', appContext);

// }
