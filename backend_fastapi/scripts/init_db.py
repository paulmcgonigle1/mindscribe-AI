import pymysql
import logging
from app.core.config import settings
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize the MySQL database and create all required tables."""
    try:
        # Connect to MySQL server
        logger.info(f"Connecting to MySQL server at {settings.MYSQL_HOST}:{settings.MYSQL_PORT}")
        conn = pymysql.connect(
            host=settings.MYSQL_HOST,
            port=settings.MYSQL_PORT,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD
        )
        
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        cursor.execute("CREATE DATABASE IF NOT EXISTS `Local Mindscribe MySQL`")
        cursor.execute("USE `Local Mindscribe MySQL`")
        
        # Create user table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `user` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `email` VARCHAR(255) NOT NULL UNIQUE,
            `username` VARCHAR(255) NOT NULL UNIQUE,
            `hashed_password` VARCHAR(255) NOT NULL,
            `first_name` VARCHAR(255),
            `last_name` VARCHAR(255),
            `is_active` BOOLEAN DEFAULT TRUE,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        """)
        
        # Create journal_entry table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `journal_entry` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `content` TEXT NOT NULL,
            `mood` VARCHAR(50),
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
        )
        """)
        
        # Create insight table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `insight` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `journal_entry_id` INT NOT NULL,
            `content` TEXT NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entry` (`id`) ON DELETE CASCADE
        )
        """)
        
        # Create user_improvement table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `user_improvement` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `description` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
        )
        """)
        
        # Create actionable_task table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `actionable_task` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `improvement_id` INT NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `description` TEXT,
            `is_completed` BOOLEAN DEFAULT FALSE,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`improvement_id`) REFERENCES `user_improvement` (`id`) ON DELETE CASCADE
        )
        """)
        
        # Create user_preferences table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS `user_preferences` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL UNIQUE,
            `theme` VARCHAR(50) DEFAULT 'light',
            `notifications_enabled` BOOLEAN DEFAULT TRUE,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
        )
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
        
        logger.info("All tables created successfully")
        
    except pymysql.Error as e:
        logger.error(f"MySQL Error: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise

if __name__ == "__main__":
    try:
        init_db()
        logger.info("Database initialization completed successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        sys.exit(1) 