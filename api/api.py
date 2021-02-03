from flask import Flask, request, jsonify, render_template
from gateways.realtor_gateway import RealtorGateway
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost:5432/greenacre"
db = SQLAlchemy(app)
migrate = Migrate(app, db)
realtor_GW = RealtorGateway()
cors = CORS(app)



@app.route("/")
def hello():
    return "Hello World!"

@app.route("/details/<property_id>")
def get_property_details(property_id):
    property_details_json = realtor_GW.show_details(property_id)

    return property_details_json;

@app.route("/id/<address>")
def get_property_id(address):
    property_details_json = realtor_GW.get_property_id_by_address(address)

    return property_details_json;

if __name__ == '__main__':
    app.run(debug=True)
