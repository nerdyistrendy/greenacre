import requests
import json
from dotenv import load_dotenv
import os
load_dotenv()

class RealtorGateway:
    
    API_KEY = os.getenv('API_KEY')


    def show_details(self, property_id) -> str:
        url = "https://realtor.p.rapidapi.com/properties/v2/detail?="
        payload = "{}"
        headers = {
            'x-rapidapi-key': self.API_KEY,
            "Access-Control-Allow-Origin": "*"
        }
        params = {
            'property_id': property_id
        }
        response = requests.request(
            "GET", url, data=payload, headers=headers, params=params)
        return (response.content, response.status_code, response.headers.items())

    def get_property_id_by_mls(self, mls_id) -> str:
        url = "https://realtor.p.rapidapi.com/properties/v2/list-by-mls"
        payload = "{}"
        headers = {
            'x-rapidapi-key': self.API_KEY,
            "Access-Control-Allow-Origin": "*"

        }
        params = {
            'mls_id': mls_id
        }
        response = requests.request(
            "GET", url, data=payload, headers=headers, params=params)
        return ["properties"][0]["property_id"]

    def get_property_id_by_address(self, address) -> str:
        url = "https://realtor.p.rapidapi.com/locations/auto-complete"
        payload = "{}"
        headers = {         
            'x-rapidapi-key': self.API_KEY,
            # 'x-rapidapi-host': "realtor.p.rapidapi.com",
            'Access-Control-Allow-Origin': '*'
            }
        params = {
            "input":address
        }

        response = requests.request(
            "GET", url, data=payload, headers=headers, params=params)
        return (response.text)

myclass = RealtorGateway()
response = json.loads(myclass.get_property_id_by_address("7434 keen"))
print(response)
