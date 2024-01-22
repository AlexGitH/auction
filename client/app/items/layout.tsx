'use client';

// import { getCurrentUser } from '@/lib/actions';
// import { cookies } from 'next/headers';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// function getCookie() {
//   const cookieStore = cookies();
//   const session = cookieStore.get('session');
//   return `session=${session?.value}`;
// }

export default async function ItemsLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // const [isSuccess, setIsSuccess] = useState<boolean>(false);
  // const { push } = useRouter();

  // useEffect(() => {
  //   (async () => {
  //     try {

  //       // const { data } = await getCurrentUser(getCookie());
  //       const { data }: any = await Promise.resolve({currentUser: {email:'test@i.io'}});
  //       const {curerntUser} = data || {};
  //       console.log({curerntUser})
  //       if (!curerntUser) {
  //         push("/");
  //         return;
  //       }

  //       setIsSuccess(false);

  //     }
  //     catch(error) {
  //       setIsSuccess(false);
  //       console.log('Items:', {error});
  //     }

  //     // if the error did not happen, if everything is alright
  //     setIsSuccess(true);
  //   })();
  // }, [push]);

  // if (!isSuccess) {
  //   return <p>!!!!Loading...</p>;
  // }

  return (
    <div>

      {/* <Header currentUser={data?.currentUser}/> */}
      {children}
      {/* <Footer/> */}
    </div>
  )
}
