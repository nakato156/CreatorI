from flask import Blueprint, request
from sys import path
from os.path import abspath
from os import environ
path.append(abspath(f"{__file__}/../../../../"))
from models.models import Models

api = Blueprint('api', __name__, url_prefix="/api/v1")

@api.route("/videos")
def videos():
    vd = environ.get("VD_MAIN")
    table_users = environ.get("TB_USERS")
    videos = Models(vd)
    res = videos.select_free(f"""SELECT {table_users}.nombres,{table_users}.foto_perfil,{vd}.titulo, {vd}.tipo, {vd}.url 
    FROM `{table_users}` 
    INNER JOIN `{vd}`  
    WHERE {table_users}.id = {vd}.user_id;""")
    
    return dict(zip(range(len(res)), res))

@api.route("/video/<string:url>")
def video(url):
    vd = environ.get("VD_MAIN")
    table_users = environ.get("TB_USERS")
    videos = Models(vd)
    res = videos.select_free(f"""SELECT {table_users}.nombres,{table_users}.foto_perfil,{vd}.titulo, {vd}.tipo, {vd}.url 
    FROM `{table_users}` 
    INNER JOIN `{vd}`  
    ON {table_users}.id = {vd}.user_id WHERE {vd}.url = '{url}';""")
    return {k:v for k,v in zip(["user","foto","titulo","tipo","url"],*res)}

@api.get("/search")
def search():
    params = request.args
    id = params.get("id",None)
    string = params.get("string",None)
    max_results = params.get("max_results",100)
    if not id and not string: return {"message":"data insuficient"}
    return {"api":True}