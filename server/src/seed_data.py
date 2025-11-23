import logging
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from src.database.core import SessionLocal
from src.entities.user import User, UserRole
from src.entities.trade import Trade, TradeStatus, TradeSide
from src.auth.service import get_password_hash

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_database():
    db = SessionLocal()
    try:
        logger.info("🌱 Starting Database Seeding...")

        # ---------------------------------------------------------
        # 1. CREATE USERS
        # ---------------------------------------------------------
        users_config = [
            {"name": "charlie", "email": "charlie@winner.com", "pass": "pass123"}, # Top Gainer
            {"name": "bob", "email": "bob@loser.com", "pass": "pass123"},          # Top Loser
            {"name": "alice", "email": "alice@trader.com", "pass": "pass123"},      # Active User
        ]

        created_users = {}

        for u in users_config:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                new_user = User(
                    id=uuid4(),
                    username=u["name"],
                    email=u["email"],
                    hashed_password=get_password_hash(u["pass"]),
                    role=UserRole.TRADER,
                    created_at=datetime.now(timezone.utc)
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                created_users[u["name"]] = new_user
                logger.info(f"✅ Created User: {u['name']}")
            else:
                created_users[u["name"]] = existing
                logger.info(f"ℹ️ User {u['name']} already exists.")

        # ---------------------------------------------------------
        # 2. CREATE TRADES (Only if user has no trades)
        # ---------------------------------------------------------
        
        trades_to_add = []
        now = datetime.now(timezone.utc)

        # --- CHARLIE (Winner) ---
        # 1. Big BTC Long Win
        trades_to_add.append(Trade(
            id=uuid4(),
            user_id=created_users["charlie"].id,
            symbol="BTC/USDT",
            side=TradeSide.LONG,
            quantity=2.0,
            entry_price=50000.0,
            exit_price=55000.0,
            status=TradeStatus.CLOSED,
            pnl=10000.0,  # (55k - 50k) * 2
            entry_date=now - timedelta(days=10),
            exit_date=now - timedelta(days=2)
        ))
        # 2. Small SOL Win
        trades_to_add.append(Trade(
            id=uuid4(),
            user_id=created_users["charlie"].id,
            symbol="SOL/USDT",
            side=TradeSide.LONG,
            quantity=100.0,
            entry_price=20.0,
            exit_price=25.0,
            status=TradeStatus.CLOSED,
            pnl=500.0,
            entry_date=now - timedelta(days=5),
            exit_date=now - timedelta(days=1)
        ))

        # --- BOB (Loser) ---
        # 1. Big ETH Short Loss
        trades_to_add.append(Trade(
            id=uuid4(),
            user_id=created_users["bob"].id,
            symbol="ETH/USDT",
            side=TradeSide.SHORT,
            quantity=10.0,
            entry_price=3000.0,
            exit_price=3200.0, # Price went up, Short loses
            status=TradeStatus.CLOSED,
            pnl=-2000.0, # (3000 - 3200) * 10
            entry_date=now - timedelta(days=8),
            exit_date=now - timedelta(days=3)
        ))

        # --- ALICE (Active / Mixed) ---
        # 1. Closed Win
        trades_to_add.append(Trade(
            id=uuid4(),
            user_id=created_users["alice"].id,
            symbol="BTC/USDT",
            side=TradeSide.LONG,
            quantity=0.5,
            entry_price=40000.0,
            exit_price=42000.0,
            status=TradeStatus.CLOSED,
            pnl=1000.0,
            entry_date=now - timedelta(days=20),
            exit_date=now - timedelta(days=15)
        ))
        # 2. OPEN Position (Currently in profit, but no PnL realized)
        trades_to_add.append(Trade(
            id=uuid4(),
            user_id=created_users["alice"].id,
            symbol="BTC/USDT",
            side=TradeSide.LONG,
            quantity=1.0,
            entry_price=58000.0,
            status=TradeStatus.OPEN,
            pnl=None, # Open trade
            entry_date=now - timedelta(hours=4),
            exit_date=None
        ))
        # 3. OPEN Position (Another Asset)
        trades_to_add.append(Trade(
            id=uuid4(),
            user_id=created_users["alice"].id,
            symbol="DOGE/USDT",
            side=TradeSide.LONG,
            quantity=1000.0,
            entry_price=0.10,
            status=TradeStatus.OPEN,
            pnl=None,
            entry_date=now - timedelta(days=1),
            exit_date=None
        ))

        # Bulk Insert (Only insert if user doesn't already have trades to avoid duplicates)
        count = 0
        for t in trades_to_add:
            # Check if this specific trade ID exists (unlikely) or just rely on fresh DB
            # Ideally, checks per user count, but for a seed script, appending is fine 
            # if we assume clean slate or just adding more.
            db.add(t)
            count += 1
        
        db.commit()
        logger.info(f"🚀 Successfully seeded {count} trades!")

    except Exception as e:
        logger.error(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()