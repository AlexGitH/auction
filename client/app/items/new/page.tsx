'use client'

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import useRequest from '../../..//hooks/use-request';
import { getCurrentUser } from '@/lib/actions';

export default function NewItemPage() {
  const { push, refresh } = useRouter();

  const [name, setItemName] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [description, setDescription] = useState('')

  const { doRequest, errors } = useRequest({
    url: '/api/items',
    method: 'post',
    body: {
      name, startPrice, description
    },
    onSuccess: () => {
      push('/');
      refresh();
    },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(startPrice);

    if (!isNaN(value)) {
      setStartPrice(value.toFixed(2));
    }
  };

  return (
    <div>
      {/* <form action=""> */}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="item-name">
            Item Name
          </label>
          <input
            id="item-name"
            name="item-name"
            type="text"
            value={name}
            onChange={e => setItemName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-start-price">
            Start Price
          </label>
          <input
            id="item-start-price"
            name="item-start-price"
            type="text"
            value={startPrice}
            onChange={e => setStartPrice(e.target.value)}
            onBlur={onBlur}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-description">
            Description
          </label>
          <textarea
            id="item-description"
            name="item-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="form-control"
          >
          </textarea>
        </div>
        <button className="btn btn-primary">Add Item</button>
        {errors}
      </form>
    </div>
  );
}
