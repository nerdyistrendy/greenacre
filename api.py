from flask import Flask, request, jsonify, render_template, url_for, redirect, g
from gateways.realtor_gateway import RealtorGateway
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restx import Api, Resource, fields
from flask_login import LoginManager, UserMixin, login_user, \
    login_required, logout_user, user_loaded_from_header
from flask_login import current_user
from http import HTTPStatus
import google_token
from flask.sessions import SecureCookieSessionInterface


import logging
# from marshmallow from Marshmallow

app = Flask(__name__, static_folder='./build', static_url_path='/')
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://lpmmxmxezxaezh:03342c099f64d413aa203968956f57632357c88b94c7330c15b163332d883f5c@ec2-34-230-167-186.compute-1.amazonaws.com:5432/d32kvqgijipm7b"
# "postgresql://postgres:postgres@localhost:5432/greenacre"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
client_id = '682392515702-8073lsudamcf05clhsl95fv6f1r9636i.apps.googleusercontent.com'
app.logger.info("test logger")

db = SQLAlchemy(app)
migrate = Migrate(app, db)
# ma = Marshmallow(app)
realtor_GW = RealtorGateway()
cors = CORS(app)

# authentication
app.config['GOOGLE_CLIENT_ID'] = '682392515702-8073lsudamcf05clhsl95fv6f1r9636i.apps.googleusercontent.com'
app.secret_key = 'SECRET_KEY'

try:
    app.config['REMEMBER_COOKIE_HTTPONLY'] = True
except RuntimeError:
    pass
# class CustomSessionInterface(SecureCookieSessionInterface):
#     """Prevent creating session from API requests."""
#     def save_session(self, *args, **kwargs):
#         if g.get('login_via_header'):
#             return
#         return super(CustomSessionInterface, self).save_session(*args,
#                                                                 **kwargs)

# app.session_interface = CustomSessionInterface()

login = LoginManager()
login.init_app(app)
login.session_protection = 'strong'

api = Api(app=app, title="Greenacre Hub",
        description="Simple app to find your dream property")

# app.secret_key = app.config['SECRET_KEY']


class Investor(UserMixin, db.Model):
    __tablename__ = 'investors'

    id = db.Column(db.Text, primary_key=True)
    name = db.Column(db.Text)
    profile_pic = db.Column(db.Text)
    # one-to-many
    investment_lists = db.relationship(
        'InvestmentList', backref='investor', lazy='dynamic')

    def __init__(self, ident, name, profile_pic):
        self.id = ident
        self.name = name
        self.profile_pic = profile_pic

    def update(self, name, profile_pic):
        self.name = name
        self.profile_pic = profile_pic

    def __repr__(self):
        return f"<Investor {self.id} {self.name}>"

    def report_lists(self):
        print("investment lists:")
        for list in self.investment_lists:
            print(list.list_name)


# many to many
association_table = db.Table('association',
                            db.Column('investment_lists_id', db.Integer, db.ForeignKey(
                                'investment_lists.id'), primary_key=True),
                            db.Column('investment_properties_id', db.Integer, db.ForeignKey(
                                'investment_properties.id'), primary_key=True)
                            )


class InvestmentList(db.Model):
    __tablename__ = 'investment_lists'

    id = db.Column(db.Integer, primary_key=True)
    list_name = db.Column(db.Text)
    investor_id = db.Column(db.Text, db.ForeignKey('investors.id'))
    investment_properties = db.relationship("InvestmentProperty",
                                            secondary=association_table,
                                            backref=db.backref("investment_lists", lazy='dynamic'))

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


# class User(UserMixin):
#     """Simple User class that stores ID, name, and profile image."""

#     def __init__(self, ident, name, profile_pic):
#         self.id = ident
#         self.name = name
#         self.profile_pic = profile_pic

#     def update(self, name, profile_pic):
#         self.name = name
#         self.profile_pic = profile_pic


# A simple user manager.  A real world application would implement the same
# interface but using a database as a backing store.  Note that this
# implementation will behave unexpectedly if the user contacts multiple
# instances of the application since it is using an in-memory store.
class UserManager(object):
    """Simple user manager class.
    Replace with something that talks to your database instead.
    """

    def __init__(self):
        investors_in_db = Investor.query.all()
        known_users_sub_ids = [investor.id for investor in investors_in_db]
        self.known_users = {}
        # app.logger.info(known_users_sub_ids)
        for investor in investors_in_db:
            self.known_users[investor.id] = investor

    def add_or_update_google_user(self, google_subscriber_id, name,
                                profile_pic):
        """Add or update user profile info."""
        if google_subscriber_id in self.known_users:
            app.logger.info("user alreayd in database")
            self.known_users[google_subscriber_id].update(name, profile_pic)
        else:
            app.logger.info("user not in database")
            self.known_users[google_subscriber_id] = \
                Investor(ident=google_subscriber_id,
                        name=name, profile_pic=profile_pic)
            favorite = InvestmentList("favorite", google_subscriber_id)
            db.session.add_all([self.known_users[google_subscriber_id], favorite])
            db.session.commit()
        return self.known_users[google_subscriber_id]

    def lookup_user(self, google_subscriber_id):
        """Lookup user by ID.  Returns User object."""
        # app.logger.info(google_subscriber_id)

        return self.known_users.get(google_subscriber_id)


user_manager = UserManager()

# # The user loader looks up a user by their user ID, and is called by
# # flask-login to get the current user from the session.  Return None
# # if the user ID isn't valid.

# @user_loaded_from_header.connect
# def user_loaded_from_header(self, user=None):
#     g.login_via_header = True

@login.user_loader
def user_loader(user_id):
    return user_manager.lookup_user(user_id)


@api.route("/me")
class Me(Resource):
    """The currently logged-in user.
    GET will return information about the user if a session exists.
    POST will login a user given an ID token, and set a session cookie.
    DELETE will log out the currently logged-in user.
    """

    a_user = api.model("Investor", {
        'google_id': fields.String(
            description="The user's Google account ID"),
        'name': fields.String(description="The user's full name"),
        'picture': fields.Url(description="A URL to the profile image"),
    })

    @login_required
    @api.response(HTTPStatus.OK, 'Success', a_user)
    def get(self):
        return jsonify({
            'google_id': current_user.id,
            'name': current_user.name,
            'picture': current_user.profile_pic
        })

    @api.param(
        'id_token', 'A JWT from the Google Sign-In SDK to be validated',
        _in='formData')
    @api.response(HTTPStatus.OK, 'Success', a_user)
    @api.response(HTTPStatus.FORBIDDEN, "Unauthorized")
    # @csrf_protection
    def post(self):
        # Validate the identity
        id_token = request.form.get('id_token')
        if id_token is None:
            print("No ID token provided")
            return "No ID token provided", HTTPStatus.FORBIDDEN

        try:
            identity = google_token.validate_id_token(
                id_token, app.config['GOOGLE_CLIENT_ID'])
        except ValueError:
            print("No ID token provided")
            return 'Invalid ID token', HTTPStatus.FORBIDDEN

        # Get the user info out of the validated identity
        if ('sub' not in identity or
                'name' not in identity or
                'picture' not in identity):
            print("Unexcpected authorization response")
            return "Unexcpected authorization response", HTTPStatus.FORBIDDEN

        # This just adds a new user that hasn't been seen before and assumes it
        # will work, but you could extend the logic to do something different
        # (such as only allow known users, or somehow mark a user as new so
        # your frontend can collect extra profile information).
        user = user_manager.add_or_update_google_user(
            identity['sub'], identity['name'], identity['picture'])

        # Authorize the user:
        login_user(user, remember=True)

        return self.get()

    @login_required
    @api.response(HTTPStatus.NO_CONTENT, "Success")
    # @csrf_protection
    def delete(self):
        logout_user()
        return "", HTTPStatus.NO_CONTENT


@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route("/details/<property_id>")
def get_property_details(property_id):
    property_details_json = realtor_GW.show_details(property_id)
    # print(property_details_json)
    return property_details_json


@app.route("/id/<address>")
def get_property_id(address):
    property_details_json = realtor_GW.get_property_id_by_address(address)

    return property_details_json

@app.route("/<id>/<list_name>", methods=['POST', 'GET'])
def handle_list():
    if request.method == 'GET':
        properties = InvestmentProperty.query.all()
        results = [
            {
                "address": property.name,
                "price": property.model,
            } for property in properties]

        return {results}
    elif request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            new_property = InvestmentProperty(address=data['name'], price=data['model'], doors=data['doors'])
            db.session.add(new_car)
            db.session.commit()
            return {"message": f"car {new_car.name} has been created successfully."}
        else:
            return {"error": "The request payload is not in JSON format"}

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)

#, port=os.environ.get('PORT', 80)