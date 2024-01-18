'use client'

import axios, { AxiosError, AxiosResponse } from 'axios';
import { Component, Dispatch, FC, SetStateAction, useState, JSX } from 'react';

type DoRequestParms = {
 url: string;
 method: 'get' | 'post' | 'delete';
 body: Record<string,any>;
 onSuccess(data: any): any;
};

// TODO: chek from shared library
type ResponseError = {
  response?: {
    data?: {
      errors: {message: string}[];
    };
  };
}

type RespError = {
  errors: {message: string}[];
}


export default ({ url, method, body, onSuccess }: DoRequestParms) => {
  const [errors, setErrors] = useState<JSX.Element | null>(null);

  console.log('use-request: typeof window', typeof window);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      const { data } = response;
      if (onSuccess) {
        onSuccess(data);
      }
      console.log('use-request: onSuccess',{data});
      return data;
    } catch (err: unknown) {
      // TODO: check if it's an Error or AxiosError & ResponseError

      console.log('use-request: Error',{err});

      setErrors(
        <div className="alert alert-danger">
          <h4> Oops...</h4>
          <ul className="my-0">
            {(err as AxiosError & ResponseError)?.response?.data?.errors?.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
