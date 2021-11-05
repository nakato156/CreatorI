import sys
from random import randrange
from os.path import join,abspath
from secrets import token_urlsafe
from cv2 import VideoCapture, imwrite
sys.path.append(abspath(f"{__file__}/../"))

from classes.connection import DataBase

class Models(DataBase):
    def __init__(self, table, **columns) -> None:
        super().__init__()
        self.table = table
        if columns:
            self.__optionals = {k:v for k,v in columns.items() if type(v) is dict}
            self.name_columns = list(columns.keys())
            self.dtypes = { k:(v["type"] if type(v) is dict else v) for k,v in columns.items()}
            self.columns = columns

    def save(self, **data):
        if data.keys()!=self.name_columns:
            data = self.__complete__(**data)
        
        if not all([ item in self.name_columns for item in data.keys()]):
            raise ValueError("Los datos no concuerdan")

        dtp = [ type(data[k]) is tp for k,tp in self.dtypes.items()]

        if not all(dtp):
            raise ValueError("Los tipos de datos no concuerdan")
        if "contenido" in data:
            content = data.get("contenido")
            dest = join(abspath(f"{__file__}/../../"),f"src/static/{data['tipo']}/{data['url']}.mp4")
            content.save(dest)
            if data["tipo"] == "videos":
                captura = VideoCapture(dest)
                for i in range(30):
                    if i<20:continue
                    _, prev = captura.read()
                    dest = join(abspath(f"{__file__}/../../"),f"src/static/previews/{data['url']}.png")
                    imwrite(dest, prev)
                    break

            print("fuera")
            data.pop("contenido")
        return self.insertar(self.table, **data)

    def insert_secure_user(self, campo, **values):
        """
        Insert the values ​​if the "select" statement returns false values ​​or values ​​less than 1
        """
        while True:
            if not len(self.select("*", where={campo: values["values"][campo]})):
                break
            else:
                values[campo] = randrange(0,100000)
        return self.save(data=values["values"])

    def __complete__(self, data:dict):
        for k in self.name_columns:
            if k in self.__optionals:
                data[k] = self.__optionals[k]["default"]
            elif k == "url":
                name_enc = "".join(i[0] for i in data["titulo"].split())
                data[k] = f"{token_urlsafe(34)}{name_enc[-3:]}"
            elif k=="tags":
                data[k] = "|".join(data[k].split(" "))
        return data