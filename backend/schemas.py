from pydantic import BaseModel,computed_field
from datetime import date,datetime
from typing import Optional,List

class LogBase(BaseModel):
    content:str

class LogCreate(LogBase):
    pass

class LogResponse(LogBase):
    id:int
    project_id:int
    created_at: datetime
    class Config:
        from_attributes=True

class ProjectBase(BaseModel):
    title:str
    description:Optional[str]=None
    status:str="Idea"
    tech_stack:Optional[str]=None
    deadline:Optional[date]=None

class ProjectCreate(ProjectBase):
    pass 

class ProjectResponse(ProjectBase):
    id:int 
    created_at:datetime
    finished_at:Optional[datetime]=None
    owner_id:int
    logs:List[LogResponse]=[]
    class Config:
        from_attributes=True

class UserBase(BaseModel):
    username:str

class UserCreate(UserBase):
    password:str

class UserResponse(UserBase):
    id:int 
    total_xp: int 
    current_streak: int 
    last_active_date:Optional[date]=None
    class Config:
        from_attributes=True
    @computed_field
    def rank(self)->str:
        if self.total_xp<1000:
            return "Junior Developer"
        elif self.total_xp<5000:
            return "Mid Level Developer"
        else:
            return "Senior Developer"

