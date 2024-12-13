import psycopg2
from psycopg2.extras import RealDictCursor

def get_connection():
    """Conecta ao banco de dados PostgreSQL."""
    try:
        return psycopg2.connect(
            host='localhost',
            database='oferte_e_ganhe',
            user='postgres',
            password='KATYqueen111',
            port='5433' 
        )
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        raise e

def fetch_data(query):
    """Executa uma consulta no banco e retorna os dados."""
    conn = None  
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(query)
        data = cursor.fetchall()
        return data
    except Exception as e:
        print(f"Erro ao buscar dados: {e}")
        return []
    finally:
        if conn:  # Verifica se conn foi inicializada
            cursor.close()
            conn.close()
