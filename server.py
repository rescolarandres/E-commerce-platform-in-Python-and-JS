from flask import Flask, render_template, request, session, redirect, url_for
from sqlalchemy import create_engine, text
from werkzeug.security import generate_password_hash, check_password_hash
import sqlalchemy
import json

def connect_tcp_socket() -> sqlalchemy.engine.base.Engine:
    """ Initializes a TCP connection pool for a Cloud SQL instance of MySQL. """
    db_host = ''
    db_user = 'root'
    db_pass = ''
    db_name = 'main'
    db_port = 3306

    engine = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL.create(
            drivername="mysql+pymysql",
            username=db_user,
            password=db_pass,
            host=db_host,
            port=db_port,
            database=db_name,
        ),
    )
    return engine

def legacy_to_json(rows):
    list = [row.section_name for row in rows]
    return json.dumps(list)


hm = Flask(__name__)
hm.config["SECRET_KEY"] = "super secret stuff"
engine = connect_tcp_socket()

@hm.route("/")
def index():
    with engine.connect() as connection:
        query_articles = f"""
                SELECT DISTINCT articles.article_id, product_type_name, colour_group_name, detail_desc, ROUND(price,5) as price
                FROM articles
                INNER JOIN transactions
                ON transactions.article_id = articles.article_id
                ORDER BY RAND ( )
                LIMIT 10;
                """
        query_men_categories = f"""
                SELECT DISTINCT section_name
                FROM articles
                WHERE index_group_name = 'Menswear'
                LIMIT 5
                """ 
        query_women_categories = f"""
                SELECT DISTINCT section_name
                FROM articles
                WHERE index_group_name = 'Ladieswear'
                LIMIT 5
                """ 
        query_babies_categories = f"""
                SELECT DISTINCT section_name
                FROM articles
                WHERE index_group_name = 'Baby/Children'
                LIMIT 5
                """ 
        
        articles = connection.execute(text(query_articles)).fetchall()
        men_categories = connection.execute(text(query_men_categories)).fetchall()
        women_categories = connection.execute(text(query_women_categories)).fetchall()
        babies_categories = connection.execute(text(query_babies_categories)).fetchall()

        if session:
            return render_template('index.html', articles=articles, men_categories = legacy_to_json(men_categories) ,
                            women_categories=  legacy_to_json(women_categories), babies_categories =  legacy_to_json(babies_categories),session = session)
        else:
            
            temp_session = {'email': 'Login'}
            return render_template('index.html', articles=articles, men_categories =legacy_to_json(men_categories) ,
                            women_categories=  legacy_to_json(women_categories), babies_categories =  legacy_to_json(babies_categories), session = temp_session)            

@hm.route("/register", methods=["POST"])
def handle_register():
    password = request.form["passwordRegister"]
    email = request.form["email"]

    hashed_password = generate_password_hash(password=password)

    query = f"""
    INSERT INTO users(email, password, admin)
    VALUES ("{email}", "{hashed_password}", 0)
    """

    with engine.connect() as connection:
        connection.execute(text(query))
        session["email"] = email

    return redirect(url_for("index"))

@hm.route("/login", methods=["POST"])
def handle_login():
    email = request.form["email"]
    password = request.form["password"]

    query = f"""
    SELECT *
    FROM users
    WHERE email='{email}'
    """

    with engine.connect() as connection:
        user = connection.execute(text(query)).fetchone()

        password_matches = check_password_hash(user[1], password)
        if user and password_matches and user[2]:
            # User is Admin
            session["email"] =user[0]
            return render_template('index_admin.html')
        else:
            return redirect(url_for("index"))

@hm.route("/search", methods=["POST"])
def search():
    item = request.form['itemToSearch']

    query = f"""
            SELECT DISTINCT articles.article_id, product_type_name, colour_group_name, detail_desc, ROUND(price,5) as price
            FROM articles
            INNER JOIN transactions
            ON transactions.article_id = articles.article_id
            WHERE product_type_name = '{item}'
            ORDER BY RAND ( )
            LIMIT 10;
            """
    with engine.connect() as connection:
        items = connection.execute(text(query)).fetchall()

        if item:
            return render_template('search.html', search = items)
        else:
            redirect(url_for("/"))

@hm.route("/cart")
def cart():
    return render_template('cart.html')

@hm.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

if __name__ == '__main__':
    hm.run(host='0.0.0.0', port=8080, debug=True)
