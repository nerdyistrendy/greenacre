import requests
import json


class RealtorGateway:
    API_KEY = "e6a6cc616cmsh356cb445305c5aap10de3fjsn2152bcb8d556"

    def show_details(self, property_id) -> str:
        url = "https://realtor.p.rapidapi.com/properties/v2/detail?="
        payload = "{}"
        headers = {
            'x-rapidapi-key': self.API_KEY

        }
        params = {
            'property_id': property_id
        }
        response = requests.request(
            "GET", url, data=payload, headers=headers, params=params)
        return response.text


# myclass = RealtorGateway()
# details = json.loads(myclass.show_details("O3599084026"))
# print(details["properties"][0]["tax_history"])
