from contextlib import contextmanager
from typing import Generator, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from mana_gov.models.user import User, UserRoleAssignment  # Correct path for user models
from mana_gov.util.database import SessionLocal  # Correct path for database session

class UserService:
    @staticmethod
    @contextmanager
    def get_db() -> Generator[Session, None, None]:
        """
        Provides a database session and ensures proper cleanup after use.
        """
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
        with UserService.get_db() as db:
            user = db.query(User).filter(User.near_id == near_id).first()
            if user:
                raise HTTPException(status_code=400, detail="User with this NEAR ID already exists.")

            new_user = User(username=username, near_id=near_id)
            try:
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                return new_user
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Failed to register user: {str(e)}")

    @staticmethod
    def login_user(near_id: str) -> Optional<User]:
        """
        Logs in the user by verifying NEAR ID.
        """
        with UserService.get_db() as db:
            user = db.query(User).filter(User.near_id == near_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found.")
            return user

    @staticmethod
    def assign_role(user_id: int, role: str) -> UserRoleAssignment:
        """
        Assigns a role to a user.
        """
        with UserService.get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found.")
            
            role_assignment = UserRoleAssignment(user_id=user.id, role=role)
            try:
                db.add(role_assignment)
                db.commit()
                db.refresh(role_assignment)
                return role_assignment
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Failed to assign role: {str(e)}")

    @staticmethod
    def get_user(user_id: int) -> Optional[User]:
        """
        Retrieves user information by user ID.
        """
        with UserService.get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found.")
            return user

    @staticmethod
    def update_user(user_id: int, updated_data: dict) -> Optional[User]:
        """
        Updates user profile data.
        """
        with UserService.get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found.")
            
            try:
                for key, value in updated_data.items():
                    setattr(user, key, value)

                db.commit()
                db.refresh(user)
                return user
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")
