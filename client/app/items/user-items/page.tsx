import buildClient from '@/app/api/build-client';
import { getReqHeaders } from '@/lib/actions';

// async function getCurrentUserItems() {
//   // fetch('/api/items/currentuser').then(x=>x.json()).then(x=>console.log(x))
//   const res = await fetch('/api/items/currentuser');
//   return res.json();
// }

function CardsGrid({items}:{items:any[]}) {
  return (
    <div className="row">
      {items.map((x,i)=>(
      <div key={i} className="col-8  col-lg-4 col-sm-6 col-md-5 col-xl-3">
        <div className="card">
          <img className="card-img-top" src={`https://mdbcdn.b-cdn.net/img/new/standard/city/04${i}.webp`} alt="Card image cap"/>
          <div className="card-body">
            <h3 className="card-title">{x.name}</h3>
            <p className="card-text">${x.startPrice}</p>
            <p className="card-text">{x.description}</p>
          </div>
        </div>
      </div>
      ))}
    </div>
  );
}

export default async function UserItems() {

  const req = await getReqHeaders();

  const client = buildClient({ req });

  // const { data: items } = await client.get('/api/items/currentuser'); // run the async request
  const { data: items } = await client.get('/api/items/currentuser'); // run the async request
  // const items = await getCurrentUserItems();

  const test=Array.from({length: 10}).map((x,i)=>({id: i,name:'test '+i,description: 'some description', startPrice: 124.5}));

  return <div>
    This is the list of <b>all </b> user <b>Items </b> for auction.
    <ul>
      {items.map((x:any)=><li key={x.id}>{x.name}</li>)}
    </ul>
    <CardsGrid items={items}/>
    {/* {JSON.stringify(items, null, 2)} */}
  </div>;
};
