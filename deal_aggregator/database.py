from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, BigInteger, UniqueConstraint
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import datetime

DATABASE_URL = "postgresql://user:password@localhost/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, index=True, nullable=False)
    title = Column(String, index=True)
    image = Column(String)
    price = Column(Float)
    original_price = Column(Float)
    discount = Column(Float)
    url = Column(String, unique=True)
    source = Column(String, index=True, nullable=False)
    category = Column(String, index=True)
    reddit_post_id = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    clicks = Column(BigInteger, default=0)

    __table_args__ = (UniqueConstraint('product_id', 'source', name='_product_source_uc'),)

def create_tables():
    Base.metadata.create_all(bind=engine)
