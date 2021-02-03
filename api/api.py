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


class Investor(db.Model):
    __tablename__ = 'investors'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text)

    #one-to-many
    investment_lists = db.relationship('InvestmentList',backref='investor',lazy='dynamic')

    def __init__(self, username):
        self.username = username

    def __repr__(self):
        return f"<Investor {self.username}>"

#many to many
association_table = db.Table('association', 
    db.Column('investment_lists_id', db.Integer, db.ForeignKey('investment_lists.id'), primary_key=True),
    db.Column('investment_properties_id', db.Integer, db.ForeignKey('investment_properties.id'), primary_key=True)
)

class InvestmentList(db.Model):
    __tablename__ = 'investment_lists'

    id = db.Column(db.Integer, primary_key=True)
    list_name = db.Column(db.Text)
    investor_id = db.Column(db.Integer,db.ForeignKey('investors.id'))
    investment_properties = db.relationship("InvestmentProperty",
                    secondary=association_table,
                    lazy='dynamic',
                    backref="investment_lists")

    def __init__(self, list_name, investor_id):
        self.list_name = list_name
        self.investor_id = investor_id

    def __repr__(self):
        return f"<Investment List {self.list_name}>"
 
class InvestmentProperty(db.Model):
    __tablename__ = 'investment_properties'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.Text)
    price = db.Column(db.Text)
    # investment_list_ids = db.Column(db.Integer[])

    def __init__(self, address, price):
        self.address = address
        self.price = price

    def __repr__(self):
        return f"<Investment Property {self.address}>"

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
