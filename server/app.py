from ariadne import load_schema_from_path, make_executable_schema, \
    graphql_sync, snake_case_fallback_resolvers, ObjectType, QueryType, MutationType
from ariadne.constants import PLAYGROUND_HTML
from flask import request, jsonify

from api import app
from api.queries.user import listUsers_resolver, getUser_resolver, \
    getUser_activities_resolver, getUser_friends_resolver, getUser_events_resolver
from api.queries.login import login_resolver
from api.queries.activity import listActivities_resolver, getActivity_resolver
from api.mutations.user import createUser_resolver, updateUser_resolver, \
    deleteUser_resolver, subscribeToActivity_resolver, registerForEvent_resolver, \
    unregisterFromEvent_resolver, unsubscribeFromActivity_resolver
from api.mutations.activity import createActivity_resolver, updateActivity_resolver, \
    deleteActivity_resolver


from api.queries.event import listEvents_resolver, getEvent_resolver, getEvent_activity_resolver
from api.mutations.event import createEvent_resolver, updateEvent_resolver, deleteEvent_resolver

query = QueryType()
mutation = MutationType()


@query.field('health')
def health(obj, info):
    return "Working!"


@query.field('listUsers')
def listUsers(obj, info):
    return listUsers_resolver(obj, info)


@query.field('getUser')
def getUser(obj, info, username):
    return getUser_resolver(obj, info, username)


@mutation.field('createUser')
def createUser(obj, info, username, password):
    return createUser_resolver(obj, info, username, password)


@mutation.field('deleteUser')
def deleteUser(obj, info, id):
    return deleteUser_resolver(obj, info, id)


@mutation.field('updateUser')
def updateUser(obj, info, username, display_name=None):
    return updateUser_resolver(obj, info, username, display_name)


@query.field('login')
def login(obj, info, username, password):
    return login_resolver(obj, info, username, password)


@mutation.field('subscribeToActivity')
def subscribeToActivity(obj, info, id, username):
    return subscribeToActivity_resolver(obj, info, id, username)


@mutation.field('registerForEvent')
def registerForEvent(obj, info, id, username):
    return registerForEvent_resolver(obj, info, id, username)


@mutation.field('unsubscribeFromActivity')
def unsubscribeFromActivity(obj, info, id, username):
    return unsubscribeFromActivity_resolver(obj, info, id, username)


@mutation.field('unregisterFromEvent')
def unregisterFromEvent(obj, info, id, username):
    return unregisterFromEvent_resolver(obj, info, id, username)


@query.field('listActivities')
def listActivities(obj, info):
    return listActivities_resolver(obj, info)


@query.field('getActivity')
def getActivity(obj, info, id):
    return getActivity_resolver(obj, info, id)


@mutation.field('createActivity')
def createActivity(obj, info, username, name, ideal_temp, ideal_wind, rain, ideal_pop, ideal_visibility, ideal_uvi):
    return createActivity_resolver(obj, info, username, name, ideal_temp, ideal_wind, rain,  ideal_pop, ideal_visibility, ideal_uvi)


@mutation.field('deleteActivity')
def deleteActivity(obj, info, id):
    return deleteActivity_resolver(obj, info, id)


@mutation.field('updateActivity')
def updateActivity(obj, info, username, id, ideal_temp, ideal_wind, ideal_visibility, ideal_pop, ideal_uvi, rain):
    return updateActivity_resolver(obj, info, username, id, ideal_temp, ideal_wind, ideal_visibility, ideal_pop, ideal_uvi, rain)


user = ObjectType('User')


@user.field('activities')
def getUser_activities(obj, info):
    return getUser_activities_resolver(obj, info)


@user.field('friends')
def getUser_friends(obj, info):
    return getUser_friends_resolver(obj, info)


@user.field('events')
def getUser_events(obj, info):
    return getUser_events_resolver(obj, info)


event = ObjectType('Event')


@event.field('activity')
def getEvent_activity(obj, info):
    return getEvent_activity_resolver(obj, info)


# @query.field('getSchedule')
# def getSchedule(obj, info, id):
#     return getSchedule_resolver(obj, info, id)

# @mutation.field('createSchedule')
# def createSchedule(obj,info, monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end):
#     return createSchedule_resolver(obj,info, monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end)

# @mutation.field('updateSchedule')
# def updateSchedule(obj,info, monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end):
#     return updateSchedule_resolver(obj,info, monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end)

@query.field('listEvents')
def listEvents(obj, info):
    return listEvents_resolver(obj, info)


@query.field('getEvent')
def getEvent(obj, info, id):
    return getEvent_resolver(obj, info, id)


@mutation.field('createEvent')
def createEvent(obj, info, username, name, date, start_time, end_time, lat, lon, activity_id, public):
    return createEvent_resolver(obj, info, username, name, date, start_time, end_time, lat, lon, activity_id, public)


@mutation.field('deleteEvent')
def deleteEvent(obj, info, id):
    return deleteEvent_resolver(obj, info, id)


@mutation.field('updateEvent')
def updateEvent(obj, info, id, name=None, date=None, start_time=None, duration=None, lat=None, lon=None, activity_id=None, public=None):
    return updateEvent_resolver(obj, info, id, name, date, start_time, duration, lat, lon, activity_id, public)


type_defs = load_schema_from_path("schema.graphql")
schema = make_executable_schema(
    type_defs, query, mutation, user, event, snake_case_fallback_resolvers
)


@app.route("/graphql", methods=["GET"])
def graphql_playgorund():
    return PLAYGROUND_HTML, 200


@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=app.debug
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code
