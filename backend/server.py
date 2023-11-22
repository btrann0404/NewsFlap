from flask import Flask, request, jsonify
from aisummarization import summarize
from newapi import getArticles
from flask_cors import CORS
import os
import psycopg2
from dotenv import load_dotenv
from passlib.hash import sha256_crypt

#SQL commands that will be run
CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT, password_hash TEXT, email TEXT);"
)

CREATE_INFO_TABLE = (
    "CREATE TABLE IF NOT EXISTS information (user_id INTEGER, search_history TEXT, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);"
)

INSERT_USERS = (
    "INSERT INTO users (username, password_hash, email) VALUES (%s, %s, %s) RETURNING id;"
)

INSERT_INFO = (
    "INSERT INTO users (user_id, search_history) VALUES (%s, %s);"
)

#this one just for fun
USER_COUNT = ("""SELECT COUNT (DISTINCT username) AS user_count;""")


load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

CORS(app, origins=["http://localhost:3000"])


@app.route('/')
def test():
    return {"test": ["1", "2", "3"]}

@app.route('/search', methods=["POST"])
def search():
    try:
        print("got here")
        data = request.get_json()
        category = data.get('category')
        keyword = data.get('keyword')

        if category == "none":
            category = None
        
        if keyword == "none":
            keyword= None
        
        print(keyword)
        print(category)

        articles, links = getArticles(keyword, category)
        print("got here3")
        summaries = [summarize(article) for article in articles]

        response_data = {
            'summaries': summaries,
            'links': links.tolist()
        }

        print(response_data)
        
        return jsonify(response_data), 200

    except Exception as e:
        # Log the error for debugging purposes
        print(f"Error in search route: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route('/register', methods=["POST"])
def register():
    if request.method=="POST":
        data = request.get_json()
        regusername = data.get('regusername')
        regemail = data.get('regemail')
        regpassword = data.get('regpassword')

        with connection:
            with connection.cursor() as cursor:
                # Create or skip creating da SQL table
                cursor.execute(CREATE_USERS_TABLE)

                # Check if username already exists
                query = f"SELECT EXISTS (SELECT 1 FROM users WHERE username = '{regusername}')"
                cursor.execute(query)
                if cursor.fetchone()[0] == True:
                    return jsonify("Username already exists :(")

                # Check if email already has an account
                query = f"SELECT EXISTS (SELECT 1 FROM users WHERE email = '{regemail}')"
                cursor.execute(query)
                if cursor.fetchone()[0] == True:
                    return jsonify("Email already exists :(")

                # Made it past checks

                # Hash the password
                hashed_password = sha256_crypt.hash(regpassword)

                # Store the Username, Hashed_Password, and Email
                cursor.execute(INSERT_USERS, (regusername, hashed_password, regemail))
                user_id = cursor.fetchone()[0]
                message = "Registration Successful!"

        response_data = {
            "message": message,
            "regusername": regusername
        }

        return jsonify(response_data), 200
    
@app.route('/login', methods=["POST"])
def login():
    if request.method=="POST":
        data = request.get_json()
        loginemail = data.get('loginemail')
        loginpassword = data.get('loginpassword')

        hashed_password = sha256_crypt.hash(loginpassword)

        with connection:
            with connection.cursor() as cursor:
                # Check if email already exists
                query = f"SELECT EXISTS (SELECT 1 FROM users WHERE email = '{loginemail}')"
                cursor.execute(query)
                if cursor.fetchone()[0] == False:
                    return jsonify("No User Found")

                # Check if password correct
                query = f"SELECT password_hash FROM users WHERE email = '{loginemail}';"
                cursor.execute(query)
                stored_password = cursor.fetchone()[0]
                passwordcorrect = sha256_crypt.verify(loginpassword, stored_password)
                if passwordcorrect == False:
                    return jsonify("Password Incorrect")

                response_data = {
                    "message": "Login successful",
                    "logemail": loginemail
                }

        return jsonify(response_data)  

# Running app
if __name__ == '__main__':
	app.run(debug=True)
