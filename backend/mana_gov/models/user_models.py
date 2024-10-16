from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from util.database import Base  # Assuming Base is the declarative base

# User Model
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    near_wallet_address = Column(String, unique=True, nullable=False)  # NEAR Wallet Address
    near_account_id = Column(String, unique=True, nullable=False)  # NEAR Account ID

    # Governance-specific fields
    dao_role = Column(String, nullable=False, default="member")  # Role in Sputnik DAO (e.g., member, admin)
    nft_token_id = Column(String, unique=True, nullable=True)  # Immutable NFT token for governance

    # Authentication fields (optional for non-NEAR-based login)
    hashed_password = Column(String, nullable=True)  # Optional for non-NEAR-based login
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    # Automatically managed timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    role_assignments = relationship("UserRoleAssignment", back_populates="user")
    proposals = relationship("Proposal", back_populates="submitted_by")
    tasks = relationship("Task", back_populates="assigned_to")
    votes = relationship("Vote", back_populates="user")
    dao_votes = relationship("DaoVote", back_populates="user")


# UserRoleAssignment Model
class UserRoleAssignment(Base):
    __tablename__ = 'user_role_assignments'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    task_id = Column(Integer, ForeignKey('tasks.id'))
    role_name = Column(String, nullable=False)  # e.g., Blockchain Developer, Frontend Developer, etc.
    mana_hours = Column(Float, nullable=False)  # Number of mana hours allocated for this role

    # Relationships
    user = relationship("User", back_populates="role_assignments")
    task = relationship("Task", back_populates="role_assignments")
