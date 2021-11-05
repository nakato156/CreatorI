from nltk.util import ngrams
from itertools import product
from pandas import DataFrame
from flask import Blueprint, request, render_template
from sys import path
from os.path import abspath
from os import environ
path.append(abspath(f"{__file__}/../../../"))
from models.models import Models

global DB_vd
global table_users
DB_vd = environ.get("VD_MAIN")
table_users = environ.get("TB_USERS")

search = Blueprint('search', __name__, url_prefix="/results")

@search.get("/search")
def searching():
    method = request.args.get("method", None)
    query = request.args.get("query")
    query = query.replace("+"," ") if "+" in query else query

    query_media = Models(DB_vd, **{
        "titulo":str,
        "nombres":str,
        "foto_perfil":str,
        "url":str,
    })
    data = query_media.select_free(f"""SELECT {table_users}.nombres,{table_users}.foto_perfil,{DB_vd}.titulo, {DB_vd}.url 
    FROM `{table_users}` 
    INNER JOIN `{DB_vd}`
    ON {table_users}.discriminador = {DB_vd}.user_id;""")
    df = DataFrame(data, columns=["channel","photo","title","url"])

    df["similarity"] = df.loc[:,["channel","title"]].apply(lambda x: get_similitary(x, query), axis=1)
    df.sort_values("similarity", ascending=False, inplace=True)
    df.drop("similarity", inplace=True, axis=1)

    results ={i:row.tolist() for i,row in zip(range(len(df)), df.to_numpy())}
    if not method:
        return render_template("search.html", result=results)
    return results

def jaccard_similarity(str1, str2, n):
    str1_bigrams = list(ngrams(str1, n))
    str2_bigrams = list(ngrams(str2, n))

    intersection = len(list(set(str1_bigrams).intersection(set(str2_bigrams))))
    union = (len(set(str1_bigrams)) + len(set(str2_bigrams))) - intersection

    return float(intersection) / union

def get_similitary(x, query):
    pairs = [list(product(n.split(), query.split())) for n in list(x)]
    similarities = []
    for strs in pairs:
        for conj in strs:
            similarities.append([jaccard_similarity(str1, str2, 2) for str1, str2 in [conj]])
    return max(similarities)[0]