from pandas import DataFrame
from flask import Blueprint, session
from functools import lru_cache
from sys import path
from os.path import abspath
from os import environ, fork
path.append(abspath(f"{__file__}/../../../"))
from classes.model_perfil import Model_user, Model_videos
from models.models import Models

recommend = Blueprint('recommend', __name__, url_prefix="/recommend")

global DB_vd
global table_users
DB_vd = environ.get("VD_MAIN")
table_users = environ.get("WACHT_USER")

Videos = Models(DB_vd,**{
    "id":int,
    "titulo": str,
    "tags":str,
    "descripcion":str,
    "url": str,
    "fecha_subida": str,
})

data = Videos.select("id,titulo,tags,descripcion,url,fecha_subida")
db =DataFrame(data, columns=Videos.name_columns) #peliculas

Videos.cursor.close()

Videos = Model_videos(db)
matriz = Videos.matrix()#ya con one hot

@recommend.get("/")
@lru_cache()
def user_recommend():
    UserID:str = session.get("user","")
    user_videos = Models(table_users)

    if UserID:
        data = user_videos.select_free(f"""SELECT {DB_vd}.id,{DB_vd}.titulo, {DB_vd}.tags, {table_users}.video_id, {table_users}.user_id 
FROM {table_users} INNER JOIN {DB_vd}
WHERE {DB_vd}.id = {table_users}.video_id AND {table_users}.user_id = {UserID.split("_")[1]}""")
    else: 
        data = user_videos.select_free(f"SELECT id,titulo,tags FROM {DB_vd}")
    
    user_videos.cursor.close()
    data:DataFrame = DataFrame(data).loc[:,[1,2]]
    my_videos = dict(zip(range(len(data)),data.values.tolist()))
    my_videos = {i:{"titulo":items[0],"tags":items[1]} for i,items in my_videos.items()}

    user_tags = []
    for tag in my_videos.values():
        user_tags.extend(tag["tags"].split("|"))

    User = Model_user(user_tags, my_videos, Videos.videos, matriz)
    User.user_perfil()
    suggest = User.suggest().iloc[:, 1:].reset_index(drop=True)

    return User.to_video_dict(suggest, excluyed=["tags","descripcion"])
