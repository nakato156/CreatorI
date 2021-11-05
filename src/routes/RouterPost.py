import sys
from os.path import abspath
from random import randrange
from datetime import datetime
from hashlib import sha256
from os import environ
from os.path import splitext
from werkzeug.datastructures import FileStorage
from flask import request, session, Blueprint
sys.path.append(abspath(f"{__file__}/../../"))
from models.models import Models

app_post = Blueprint('app_post', __name__)
@app_post.route("/upload",methods=["POST"])
def upload_video():
    if not ("user" in session and "creator" in session):
        return {"auth":"false"}

    user_id:str = session["user"].split("_")[1]
    Videos:Models = Models("our_videos",**{
        "user_id":{
            "type":str,
            "default": user_id
        },
        "titulo": str,
        "descripcion":str,
        "tags":str,
        "contenido": FileStorage,
        "tipo": str,
        "url": str,
    })
    try:
        params = request.form
        content = request.files
        if all([v for v in params.values()]) and content.get("contenido"):
            data_vid = dict(params)
            file = splitext(content.get("contenido").filename)
            type_files = {".mp4":"videos",".mp3":"audios",".png":"img"}
            
            if not file[1] in [".mp4",".mp3",".png"]:
                return {"response":"type data invalid"} 

            data_vid.update(content)
            data_vid["tipo"] = type_files[file[1]]
            save = Videos.save(data=data_vid)
            print(save)
            return {"response":"ok"}
        else:
            return {"response":"data incomplete"}
    except Exception as e:
        return {"error":f"{e}"}

@app_post.route("/register", methods=["POST"])
def validar():
    data = request.form
    req = [not not campo for campo in data]
    if len(req)==5 and all(req):
        new_user:Models = Models("users", **{
            "discriminador": int,
            "nombres":str,
            "email":str,
            "telefono": str,
            "password":str
        })

        user_exist = new_user.select("email", where={
            "email":data["email"].strip(),
            "nombres": data["names"].strip()
            })
        
        if len(user_exist)>=1:
            return {"error": "usuario existente"}

        password = sha256(request.form.get("password").encode()).hexdigest()

        try:
            new_user.insert_secure_user("discriminador",
                values={
                    "discriminador": randrange(0,100000),
                    "nombres": data["names"].strip(),
                    "email": data["email"].strip(),
                    "telefono":data["phone"].strip(),
                    "password":password
                }
            )
            session["user"] = data["names"].strip()
            return {"response":"ok"}
        except Exception as e:
            print(e)
            return {"error": "an error ocurred on the server"}
    return {"response":"data imcomplete"}

@app_post.post("/login")
def ingresar():
    data = request.form
    if len(data)==2 and all([not not d for d in data]):
        table_all_users = environ.get("TB_USERS")
        user = Models(table_all_users).select("discriminador,nombres,foto_perfil,creator",where={
            "nombres":data["names"].strip(), 
            "password": sha256(data["password"].encode()).hexdigest()
            }
        )
        print(user)
        if user and len(user)==1:
            session["user"]=f'{data["names"]}_{user[0][0]}'
            session["perfil"] = user[0][2]
            if len(user[0])>=4: session["creator"] = user[0][2]
            return {"auth":True}

        return {"response":"test"}

@app_post.post("/view")
def view_video():
    if "user" in session:
        wachet = environ.get("WACHT_USER")
        Videos_Wachet = Models(wachet, **{
            "user_id":int,
            "video_id":int,
        })
        videoId = request.args.get("videoID",None)
        if videoId:
            Videos_Wachet.save(**{
                "user_id":session["user"],
                "video_id": videoId
            })
        return {"message":"No ID provided"}
        
    else: return {"auth":False}