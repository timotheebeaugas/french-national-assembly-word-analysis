import axios from "../node_modules/axios/index";

interface Url {
    value: string;
}

const URL : Url = {
    value: "https://data.assemblee-nationale.fr/static/openData/repository/16/vp/syceronbrut/syseron.xml.zip"
} 

axios.get(URL.value)
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })