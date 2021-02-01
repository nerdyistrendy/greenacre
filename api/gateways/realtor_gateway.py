import requests
import json


class RealtorGateway:
    API_KEY = "1e0374fe84msh9be3635d1737180p1d6873jsne8177006ede3"

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
