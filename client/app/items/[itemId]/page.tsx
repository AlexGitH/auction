export default function ItemPage({ params }: { params: { itemId: string } }) {
  const {itemId} = params || {};
  return (
    <div>
      This is the details of user <b>Item {itemId}</b> for auction.
    </div>
  );
}
