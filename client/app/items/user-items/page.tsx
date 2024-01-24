import { getCurrentUserItems } from '@/lib/actions';

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
  const items = await getCurrentUserItems();
  const isTest = true;

  return <div>
    This is the list of <b>current</b> user <b>Items </b> for the auction.
    <CardsGrid items={items}/>
    { isTest && <pre>{JSON.stringify(items, null, 2)}</pre>}
  </div>;
};
