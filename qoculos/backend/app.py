from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
import bcrypt
from datetime import timedelta
from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from os import getenv
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Token expires in 1 hour
jwt = JWTManager(app)
CORS(app)  # Enable CORS to allow communication with frontend

# Database setup
DATABASE = 'purchases.db'

def init_db():
    """Initialize the SQLite database and create the tables if they don't exist."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # Create the purchases table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cpf TEXT NOT NULL,
            vendedor TEXT NOT NULL,
            valor REAL NOT NULL,
            data_compra TEXT NOT NULL,
            identificacao TEXT NOT NULL,
            observacoes TEXT
        )
    ''')

    # Create the clients table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clients (
            cpf TEXT PRIMARY KEY,
            data_nascimento TEXT NOT NULL,
            nome TEXT NOT NULL,
            observacoes TEXT
        )
    ''')

    # Create the users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

@app.route('/register', methods=['POST'])
@jwt_required()
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    hashed_password_str = hashed_password.decode('utf-8')

    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)',
                       (username, hashed_password_str))
        conn.commit()
        conn.close()
    except sqlite3.IntegrityError:
        return jsonify({"msg": "Username already exists"}), 409

    return jsonify({"msg": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM users WHERE username = ?', (username,))
    result = cursor.fetchone()
    conn.close()

    if result:
        stored_password_str = result[0]
        stored_password = stored_password_str.encode('utf-8')
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/save_purchase', methods=['POST'])
@jwt_required()
def save_purchase():
    """Endpoint to save a new purchase."""
    data = request.json
    cpf = data.get('cpf')
    vendedor = data.get('vendedor')
    valor = data.get('valor')
    data_compra = data.get('data_compra')
    identificacao = data.get('identificacao')
    observacoes = data.get('observacoes', '')

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO purchases (cpf, vendedor, valor, data_compra, identificacao, observacoes)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (cpf, vendedor, valor, data_compra, identificacao, observacoes))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Purchase saved successfully"}), 201

@app.route('/get_purchases', methods=['GET'])
@jwt_required()
def get_purchases():
    """Endpoint to get all purchases."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM purchases')
    purchases = cursor.fetchall()
    conn.close()

    # Convert the fetched data into a list of dictionaries
    purchase_list = [
        {
            'cpf': purchase[1],
            'vendedor': purchase[2],
            'valor': purchase[3],
            'data_compra': purchase[4],
            'identificacao': purchase[5],
            'observacoes': purchase[6]
        } for purchase in purchases
    ]

    return jsonify(purchase_list)

# Create a new client
@app.route('/save_client', methods=['POST'])
@jwt_required()
def save_client():
    data = request.json
    cpf = data.get('cpf')
    data_nascimento = data.get('data_nascimento')
    nome = data.get('nome')
    observacoes = data.get('observacoes', '')

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO clients (cpf, data_nascimento, nome, observacoes)
        VALUES (?, ?, ?, ?)
    ''', (cpf, data_nascimento, nome, observacoes))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Client saved successfully"}), 201

# Get all clients with number of purchases and total spent
@app.route('/get_clients', methods=['GET'])
@jwt_required()
def get_clients():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT c.cpf, c.data_nascimento, c.nome, c.observacoes,
               (SELECT COUNT(*) FROM purchases p WHERE p.cpf = c.cpf) AS numero_compras,
               (SELECT COALESCE(SUM(p.valor), 0) FROM purchases p WHERE p.cpf = c.cpf) AS valor_total_gasto
        FROM clients c
    ''')
    clients = cursor.fetchall()
    conn.close()
    client_list = [
        {
            'cpf': client[0],
            'data_nascimento': client[1],
            'nome': client[2],
            'observacoes': client[3],
            'numero_compras': client[4],
            'valor_total_gasto': client[5]
        } for client in clients
    ]

    return jsonify(client_list)

# Get a single client's data
@app.route('/get_client/<cpf>', methods=['GET']) 
@jwt_required()# Use the client's CPF as a parameter
def get_client(cpf):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT cpf, data_nascimento, nome, observacoes FROM clients WHERE cpf = ?', (cpf,))
    client = cursor.fetchone()
    conn.close()
    if client:
        return jsonify({
            'cpf': client[0],
            'data_nascimento': client[1],
            'nome': client[2],
            'observacoes': client[3]
        })
    else:
        return jsonify({"error": "Client not found"}), 404

# Update an existing client's data
@app.route('/update_client/<cpf>', methods=['PUT'])
@jwt_required()
def update_client(cpf):
    data = request.json
    data_nascimento = data.get('data_nascimento')
    nome = data.get('nome')
    observacoes = data.get('observacoes')
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE clients
        SET data_nascimento = ?, nome = ?, observacoes = ?
        WHERE cpf = ?
    ''', (data_nascimento, nome, observacoes, cpf))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Client updated successfully"})


if __name__ == '__main__':
    init_db()  # Initialize the database
    app.run(host='localhost', port=8080)

