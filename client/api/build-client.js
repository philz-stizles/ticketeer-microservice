import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // Then we are on the Server
    // Thus, requests should be made to http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // Else, we are on the Browser/Client
    // Thus, requests can be made with a bae url of ''
    return axios.create({
      baseURL: '/',
    });
  }
};
