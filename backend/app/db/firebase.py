from app.repositories.firestore import _get_db

def get_db():
    """Returns the Firestore client instance."""
    return _get_db()
