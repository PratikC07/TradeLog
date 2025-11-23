import logging
from src.database.core import SessionLocal
from src.entities.user import User, UserRole
from src.auth.service import get_password_hash
# FIX: Import Trade so SQLAlchemy can resolve the relationship in User
from src.entities.trade import Trade 

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_initial_admin():
    db = SessionLocal()
    try:
        admin_email = "admin@gmail.com"
        admin_username = "admin"
        
        # Check if admin already exists to prevent duplicate errors
        existing_user = db.query(User).filter(User.email == admin_email).first()
        
        if existing_user:
            logger.info(f"Admin user {admin_email} already exists. Skipping.")
            return

        # Create new Admin User
        logger.info(f"Creating default admin user: {admin_email}")
        new_admin = User(
            username=admin_username,
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        
        db.add(new_admin)
        db.commit()
        logger.info("Admin user created successfully!")
        
    except Exception as e:
        logger.error(f"Error seeding admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_admin()