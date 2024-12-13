from flask import Flask, jsonify
from flask_cors import CORS
from export_csv_app.routes import export_bp

app = Flask(__name__)
CORS(app) 


app.register_blueprint(export_bp)

@app.route('/health', methods=['GET'])
def health_check():
    """Verificação de saúde da aplicação."""
    return jsonify({"status": "ok", "message": "Aplicação está funcionando corretamente."})

if __name__ == '__main__':
    app.run(debug=True, port=3000)  
    
    
# Lembrar que quando for executar, vai no diretório pai e executa python -m export_csv_app.app
 