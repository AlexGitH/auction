import Link from 'next/link'
import { Suspense } from 'react';
import Loading from './loading';

const fetchPages = async(url: string)=>{
    const results = [];
    let response;
    try {
        response = await (await fetch(url)).json()
        results.push(...response.results);
        while (response.next) {
            response = await (await fetch(response.next)).json()
            results.push(...response.results);
        }

        return results;
    } catch (e) {
        console.error(e);
    }

}

// export const getStaticProps = async () => {

//   const data = await fetchPages('https://swapi.dev/api/vehicles/');
//   // const response = await fetch(`${process.env.API_HOST}/socials`);
//   // const data = await response.json();

//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }

//   return {
//     props: { vehicles: data.filter(x=>x.cost_in_credits !== 'unknown') },
//   }
// };


export default async function Page({ vehicles }:{vehicles: any[]}) {
  // just a placeholder;
  // {
  //   id: 1,
  //   title: 'Priceless item',
  //   startingPrice: '200.01',
  //   start: '2024-01-22 20:00:00',
  // }
  console.log('++DDDDDDDATA FETCHED!!!!')
  const data:any = await fetchPages('https://swapi.dev/api/vehicles/');
  // const v:any[] = data.filter((x:any)=>x.cost_in_credits !== 'unknown') },
  // const itemList = vehicles.map((item: any, idx: number) => {
  const itemList = (data.filter((x:any)=>x.cost_in_credits !== 'unknown') ).map((item: any, idx: number) => {
    return (
      <tr key={idx}>
        <td>{item.name}</td>
        <td>{item.cost_in_credits}</td>
        <td>{new Date(item.created).toISOString()}</td>
        <td>
          <Link href="/items/[itemId]" as={`/items/${item.id}`}>
            View
          </Link>
        </td>
      </tr>
    )
  });


  return (
    <div>
      <h2>Auction</h2>
      <Suspense fallback={<Loading />}>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Starting Price</th>
              <th>When</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {itemList}
          </tbody>
        </table>
      </Suspense>
    </div>
  )
}


// Page.getInitialProps = async () => {

//   try {
//     console.log('!!!!!!!!', data);
//     // const response = await fetch(`${process.env.API_HOST}/socials`);
//     // const data = await response.json();
//     return {vehicles: data}
//   }
//   catch(e) {
//     console.log('errorr!!!!', e);
//   }
// }
