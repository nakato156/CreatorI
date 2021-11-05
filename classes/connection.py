import pymysql
from os import environ

class DataBase():
    def __init__(self) -> None:
        self.connection = pymysql.connect(
            host=environ.get("MYSQL_HOST"),
            port=int(environ.get("MYSQL_PORT")),
            user=environ.get("MYSQL_USER"),
            passwd=environ.get("MYSQL_PASSWORD"),
            db=environ.get("MYSQL_DB")
        )
        
        self.cursor = self.connection.cursor()

    def insertar(self, table, **values)->bool:
        try:
            cols = ",".join(values.keys())
            vals = ",".join(f"'{v}'" for v in values.values())
            
            query= f"INSERT INTO `{table}`({cols}) VALUES ({vals})"
            print(query)
            self.cursor.execute(query)
            self.connection.commit()
            print(query)
            return True

        except Exception as e:
            print(e)
            return False

    def select(self, data, table=None, **where):
        table = self.table if not table else table
        sentence = f"SELECT {data} FROM `{table}` "
        if where:
            where:dict = where["where"]

            if len(where.keys())>1:
                vals = list(where.items())
                sentence += f"WHERE `{vals[0][0]}`='{vals[0][1]}' "
                for col,val in vals[1:]:
                    sentence += f"AND `{col}`='{val}' "
            elif len(where.keys())==1:
                col,val = list(where.items())[0]  #blas
                sentence += f"WHERE `{col}`='{val}' "
        try:
            self.cursor.execute(sentence)
            return self.cursor.fetchall()
        except Exception as e:
            return e
        
    def select_free(self, query):
        self.cursor.execute(query)
        return self.cursor.fetchall()