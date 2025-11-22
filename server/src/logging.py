
import logging
import sys
from enum import Enum

class LogLevel(str, Enum):
    INFO = "INFO"
    DEBUG = "DEBUG"
    WARNING = "WARNING"
    ERROR = "ERROR"

def configure_logging(level: LogLevel = LogLevel.INFO):
    """
    Configures the root logger to output structured logs to the console.
    """
    logging.basicConfig(
        level=level.value,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)]
    )
    
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)