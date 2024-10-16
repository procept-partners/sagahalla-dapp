from models.user import User, UserRoleAssignment
from util.database import SessionLocal
from sqlalchemy.orm import Session
from typing import Optional
from fastapi import HTTPException

class UserService:
    @staticmethod
    def get_db() -> Session:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    @staticmethod
    def register_user(username: str, near_id: str) -> User:
        """
        Registers a new user in the system.
        """
        db = next(UserService.get_db())
        # Check if user already exists
        user = db.query(User).filter(User.near_id == near_id).first()
        if user:
            raise HTTPException(status_code=400, detail="User with this NEAR ID already exists.")
        
        new_user = User(username=username, near_id=near_id)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def login_user(near_id: str) -> Optional[User]:
        """
        Logs in the user by verifying NEAR ID.
        """
        db = next(UserService.get_db())
        user = db.query(User).filter(User.near_id == near_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        
        # Token generation and authentication logic can be implemented here
        return user

    @staticmethod
    def assign_role(user_id: int, role: str) -> UserRoleAssignment:
        """
        Assigns a role to a user.
        """
        db = next(UserService.get_db())
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        
        role_assignment = UserRoleAssignment(user_id=user.id, role=role)
        db.add(role_assignment)
        db.commit()
        db.refresh(role_assignment)
        return role_assignment

    @staticmethod
    def get_user(user_id: int) -> Optional[User]:
        """
        Retrieves user information by user ID.
        """
        db = next(UserService.get_db())
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        
        return user

    @staticmethod
    def update_user(user_id: int, updated_data: dict) -> Optional[User]:
        """
        Updates user profile data.
        """
        db = next(UserService.get_db())
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        for key, value in updated_data.items():
            setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        return user
