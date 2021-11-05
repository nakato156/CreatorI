from dotenv import load_dotenv
load_dotenv()
import sys
from flask import Flask, render_template, session, redirect, send_from_directory
from routes.api.videos import api
from routes.RouterPost import app_post
from routes.search import search
from routes.recommend import recommend
from secrets import token_urlsafe
from os import environ
from os.path import abspath
sys.path.append(abspath(f"{__file__}/../../"))
from models.models import Models

app = Flask(__name__)
app.register_blueprint(search)
app.register_blueprint(recommend)
app.register_blueprint(app_post)
app.register_blueprint(api)

table_videos = environ.get("VD_MAIN")

@app.route("/", methods=["GET"])
def index():
    vd = environ.get("VD_MAIN")
    table_users = environ.get("TB_USERS")
    perfil = "default.png" if not ("perfil" in session) else session["perfil"]

    main_all_videos = Models(table_videos).select_free(f"""SELECT {table_users}.nombres,{table_users}.foto_perfil,{vd}.titulo, {vd}.tipo, {vd}.url 
    FROM `{table_users}`
    INNER JOIN `{vd}`
    WHERE {table_users}.id = {vd}.user_id OR {table_users}.discriminador = {vd}.user_id;""")
    all_main_videos, images = [],[]
    print(main_all_videos)
    for usr_name, photo, t, tp, url in main_all_videos:
        print(tp)
        if tp in ["videos","video"]:
            all_main_videos.append({"titulo":t, "url":url, "user_name":usr_name, "logo":photo})
        elif tp =="img":
            images.append({"titulo":t, "url":url, "user_name":usr_name, "logo":photo})

    return render_template("main.html", videos=all_main_videos, perfil=perfil, images=images)

@app.get("/video/<string:url>")
def video(url):
    perfil = "default.png" if not ("perfil" in session) else session["perfil"]
    vd = environ.get("VD_MAIN")
    table_users = environ.get("TB_USERS")

    info_video = Models(vd).select_free(f"""SELECT videos.*, 
    user.nombres as names,
    user.foto_perfil as photo
    FROM {vd} videos
    INNER JOIN {table_users} user
    WHERE videos.url="{url}"
    """)
    info_video = dict(zip(["titulo", "tipo", "tags", "descripcion","url","fecha_subida","name","photo"],info_video[0][2:]))
    return render_template("video.html", perfil=perfil, **info_video)

@app.route("/perfil/upload", methods=["GET"])
def upload():
    if "creator" in session:
        return render_template("inventor.html")
    return redirect("/login")       

@app.get("/register")
def register():
    if "user" in session:
        return redirect("/")
    return render_template("register.html") 

@app.get("/login")
def login():
    if "user" in session:
        return redirect("/")
    return render_template("login.html") 

@app.get("/out")
def out():
    if "user" in session:
        session.clear()
    else:
        redirect("/")

@app.get("/perfil/<string:name>")
def get_img_perfil(name:str):
    return send_from_directory("static/perfil",name)

@app.get("/preview/<string:name>")
def get_preview(name:str):
    return send_from_directory("static/previews",f"{name}.png")

if __name__ == "__main__":
    app.secret_key = token_urlsafe(40)
    app.run(debug=True)