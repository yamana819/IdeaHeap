from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from models import User, Project, ProjectLog
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DEFAULT_XP=50
WEEK_CONSTANT=1.5
MONTH_CONSTANT=2.0 

SQLALCHEMY_DATABASE_URL = "sqlite:///./IdeaVault.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()
def update_user_progress(user):
    today=datetime.now().date()
    last_active=user.last_active_date
    if last_active==today:
        return
    if not last_active:
        user.current_streak=1
    elif (today-last_active).days==1:
        user.current_streak+=1
    elif (today-last_active).days!=1:
        user.current_streak=1
    xp=DEFAULT_XP
    if user.current_streak>30:
        xp=int(DEFAULT_XP*MONTH_CONSTANT)
    elif user.current_streak>7:
        xp=int(DEFAULT_XP*WEEK_CONSTANT)
    user.total_xp+=xp
    user.last_active_date=today

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user=db.query(User).filter(User.username==user.username).first()
    if db_user:
        raise HTTPException(status_code=400,detail="This username already exists")
    new_user=User(username=user.username,password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
    
@app.post("/users/{user_id}/projects/", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, user_id: int, db: Session = Depends(get_db)):
    db_user=db.query(User).filter(User.id==user_id).first()
    if not db_user:
        raise HTTPException(status_code=404,detail="User not found")
    new_project=Project(**project.dict(),owner_id=user_id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@app.post("/projects/{project_id}/logs",response_model=schemas.LogResponse)
def create_log(project_id:int,log:schemas.LogCreate,db:Session=Depends(get_db)):
    db_project=db.query(Project).filter(Project.id==project_id).first()
    if not db_project:
        raise HTTPException(status_code=404,detail="Project not found.")
    if db_project.status=="Completed":
        raise HTTPException(status_code=400,detail="Cannot add logs to a completed project")
    new_log=ProjectLog(**log.dict(),project_id=project_id)
    db.add(new_log)
    user=db_project.owner
    update_user_progress(user)
    db.commit()
    db.refresh(new_log)
    return new_log

@app.get("/users/{user_id}",response_model=schemas.UserResponse)
def read_user(user_id:int,db:Session=Depends(get_db)):
    db_user=db.query(User).filter(User.id==user_id).first()
    if not db_user:
        raise HTTPException(status_code=404,detail="User not found")
    return db_user

@app.get("/users/{user_id}/projects/", response_model=List[schemas.ProjectResponse])
def read_user_projects(user_id: int, db: Session = Depends(get_db)):
    projects=db.query(Project).filter(Project.owner_id==user_id).all()
    return projects

@app.get("/projects/{project_id}/logs",response_model=schemas.LogResponse)
def read_project_logs(project_id:int,db:Session=Depends(get_db)):
    logs=db.query(ProjectLog).filter(ProjectLog.project_id==project_id).all()
    return logs 

@app.put("/projects/{project_id}/complete",response_model=list[schemas.ProjectResponse])
def complete_project(project_id:int,db:Session=Depends(get_db)):
    db_project=db.query(Project).filter(Project.id==project_id).first()
    if not db_project:
        raise HTTPException(status_code=404,detail="Project not found.")
    if db_project.status=="Completed":
        raise HTTPException(status_code=400,detail="Project is already completed")
    db_project.status="Completed"
    db_project.finished_at=datetime.now()
    user=db_project.owner
    user.total_xp+=1000
    update_user_progress(user)
    db.commit()
    db.refresh(db_project)
    return db_project