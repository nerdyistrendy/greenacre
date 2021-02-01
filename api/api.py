from flask import Flask,  request, jsonify
from gateways.realtor_gateway import RealtorGateway
app = Flask(__name__)
realtor_GW = RealtorGateway()


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/name/<name>")
def get_book_name(name):
    return "name : {}".format(name)


@app.route("/details/<property_id>")
def get_property_details(property_id):
    # author = request.args.get('author')
    # published = request.args.get('published')
    # return "Author : {}, Published: {}".format(author, published)
    # O3599084026
    property_details_json = realtor_GW.show_details(property_id)
    return property_details_json
    # return property_id


if __name__ == '__main__':
    app.run(debug=True)
