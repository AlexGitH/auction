import axios from 'axios';

type RequestParam = {
  headers? : Record<string,string|null>;
  body?: Record<string, any>;
};

// Custom headers to reset cache and invalidate page

// const defaultHeaders = {
//   'Cache-Control': 'no-cache',
//   'Pragma': 'no-cache',
//   'Expires': '0',
// };

export default ({ req }:{req:RequestParam}) => {
  if (typeof window === 'undefined' ) {
    // on the server side
    console.log('baseURL on the server', JSON.stringify(req?.headers,null,2));

    return axios.create({
      // baseURL: 'http://www.super-mega-prod.cfd',
      // baseURL: 'http://auction.dev',
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      // headers: {...defaultHeaders, ...req?.headers} || {Host: 'auction.dev'},
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx',
      headers: req?.headers || {Host: 'auction.dev'},
    });
  }
  else {
    // on the browser side
    console.log('baseURL on the browser')
    return axios.create({
      baseURL: '/'
    });
  }
}
