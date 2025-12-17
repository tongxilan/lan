import axios from 'axios';
import Qs from 'qs'

axios.defaults.withCredentials = true
axios.defaults.baseURL = Glod.BaseUrl

export default {
  post(url,data = {}){
    return new Promise((resolve,reject) => {
      axios.post(url, data)
        .then(response => {
          resolve(response.data);
        },err => {
          reject(err)
        })
    })
  },
  get(url,params={}){
    return new Promise((resolve,reject) => {
      axios.get(
        url + '?' + Qs.stringify(params),
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
    })
  }
}
