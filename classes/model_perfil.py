import pandas as pd
from pandas.core.frame import DataFrame

class Model_user:
    def __init__(self, tags:list, user_videos:dict, videos:pd.DataFrame, one_hot:pd.DataFrame) -> None:
        self.user_videos=user_videos

        self.peliculas=videos #peliculas
        self.videos_cod = one_hot
        self.valoration = {tg:tags.count(tg) for tg in set(tags)}

    def user_perfil(self)->pd.DataFrame:
        matriz = pd.DataFrame(self.user_videos.values())
        matriz["rating"] = matriz["tags"].apply(lambda tags: round(sum([self.valoration[tg.strip()] for tg in tags.split("|")])/len(tags), 2))
        matriz = matriz.loc[:,["titulo","rating"]]
        user_matriz = matriz.copy()

        Id = self.peliculas[self.peliculas["titulo"].isin(matriz["titulo"].tolist())]
        matriz = pd.merge(Id, matriz)
        matriz = matriz.drop(columns=["tags","fecha_subida","url","descripcion"])
        
        #filtrando para obtener el one_hot
        video_usuario = self.videos_cod[self.videos_cod["id"].isin(matriz["id"].tolist())]
        video_usuario = video_usuario.reset_index(drop=True)
        generos = video_usuario.drop(columns=["id","titulo","tags","descripcion","url","fecha_subida"])

        #transpose
        self.perfil = generos.transpose().dot(user_matriz["rating"])

        return self.perfil

    def suggest(self):
        #extrayendo generos de la bd
        db_generos = self.videos_cod.set_index(self.videos_cod["id"])
        db_generos = db_generos.drop(columns=["id","titulo","descripcion","tags","fecha_subida","url"])
        suggest:pd.DataFrame = ((db_generos*self.perfil).sum(axis=1))/self.perfil.sum()
        self.user_suggest:pd.DataFrame = suggest.sort_values(ascending=False)

        return self.peliculas.loc[self.peliculas["id"].isin(self.user_suggest.head(2).keys())]

    @classmethod
    def to_video_dict(self, df:DataFrame,  reset_index:bool=False, excluyed=[])->dict:
        cols = list(df.columns)
        df = df.reset_index(drop=True) if reset_index else df
        data = {i:{name:field for name,field in zip(cols,row) if not name in excluyed} for i,row in df.iterrows()}
        #for i,row in df.iterrows():
            #data[len(data)] = {name:field for name,field in zip(cols,row)}
        print(data)
        return data

class Model_videos:
    def __init__(self, DB:pd.DataFrame) -> None:
        self.videos= DB
        self.tags = []
        for tg in DB["tags"].tolist():
            self.tags.extend(tg.split("|"))
        self.tags = list(set(self.tags))

    def matrix(self):
        matriz = self.videos.copy()
        for i,row in self.videos.iterrows():
            for tag in row["tags"].split("|"):
                matriz.at[i,tag] = 1
        matriz.fillna(0, inplace=True)
        return matriz
