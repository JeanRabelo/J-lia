from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow communication with frontend

# Database setup
DATABASE = 'purchases.db'

def init_db():
    """Initialize the SQLite database and create the purchases table if it doesn't exist."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
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
    conn.commit()
    conn.close()

@app.route('/save_purchase', methods=['POST'])
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

if __name__ == '__main__':
    init_db()  # Initialize the database
    app.run(host='localhost', port=8080)

