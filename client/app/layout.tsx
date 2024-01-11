// import './globals.css'
import 'bootstrap/dist/css/bootstrap.css';
import Header from '@/components/Header';
// import Header from '../components/Header';
import buildClient from './api/build-client';

import { headers } from 'next/headers'

async function getCurrentUser(...args:any) {
  // const url: string =  'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
  // // const { data } = await (await fetch(url + '/api/users/currentuser')).json(); // run the async request
  // console.log('-----isBrowser', typeof window !== 'undefined');

  // // const data = await (await fetch(url + '/api/users/currentuser'));
  // const data = await (await fetch('0.0.0.0/api/users/currentuser'));

  // console.log('-----currentUser', data);
  // return data?.json();

  const headerList = headers();
  const host = headerList.get('host');
  const req = {headers: {Host: host }};
  console.log('__________________arguments', args)
  console.log('__________________Headers: host', host);
    const client = buildClient({ req });
  const { data } = await client.get('/api/users/currentuser'); // run the async request

  console.log('-----currentUser', data);
  return data;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const data = await getCurrentUser();
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
