import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CoacServicesService {
  users = [
    {
      ci: '1804388559',
      name: 'Jorge',
      cel: '0987654321',
    },
    {
      ci: '1805772938',
      name: 'Jonathan',
      cel: '0987654321',
    },
    {
      ci: '1803555810',
      name: 'Daniel',
      cel: '0987654321',
    },
  ];
  async getUser(ci: string) {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos/1',
      );
      console.log(response.data);
      return this.users.find((user) => user.ci === ci);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  }
}
