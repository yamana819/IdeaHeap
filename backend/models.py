from sqlalchemy import Column,Integer,String,DateTime,ForeignKey,Date
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base=declarative_base()

class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,index=True)
    username=Column(String,unique=True,index=True)
    password=Column(String)
    total_xp=Column(Integer,default=0)
    current_streak=Column(Integer,default=0)
    last_active_date=Column(Date,nullable=True)
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")

class Project(Base):
    __tablename__="projects"
    id=Column(Integer,primary_key=True,index=True)
    title=Column(String,index=True)
    description=Column(String,nullable=True)
    status=Column(String,default="Idea")
    tech_stack=Column(String,nullable=True)
    created_at=Column(DateTime,default=datetime.now)
    deadline=Column(Date,nullable=True)
    finished_at=Column(DateTime,nullable=True)
    owner_id=Column(Integer,ForeignKey("users.id"))
    owner=relationship("User",back_populates="projects")
    logs = relationship("ProjectLog", back_populates="project", cascade="all, delete-orphan")

class ProjectLog(Base):
    __tablename__="project_logs"
    id=Column(Integer,primary_key=True,index=True)
    project_id=Column(Integer,ForeignKey("projects.id"))
    content=Column(String)
    created_at=Column(DateTime,default=datetime.now)
    project=relationship("Project",back_populates="logs")
