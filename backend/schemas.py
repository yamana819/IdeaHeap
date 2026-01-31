from pydantic import BaseModel,computed_field
from datetime import date,datetime
from typing import Optional,List

class LogBase(BaseModel):
    title:str
    content:str

class LogCreate(LogBase):
    pass

class LogResponse(LogBase):
    id:int
    project_id:int
    created_at: datetime
    class Config:
        from_attributes=True

class LogUpdate(BaseModel):
    title: Optional[str]=None 
    content: Optional[str]=None

class ProjectBase(BaseModel):
    title:str
    description:Optional[str]=None
    status:str="Idea"
    tech_stack:Optional[List[str]]=[]
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

class ProjectUpdate(BaseModel):
    title:Optional[str]=None
    description:Optional[str]=None
    status:Optional[str]=None
    tech_stack:Optional[List[str]]=None
    deadline:Optional[date]=None 

class UserBase(BaseModel):
    username:str

class UserCreate(UserBase):
    password:str

class UserResponse(UserBase):
    id:int 
    total_xp: int 
    level: int 
    current_streak: int 
    last_active_date:Optional[date]=None
    class Config:
        from_attributes=True
    @computed_field
    def rank(self)->str:
        if self.level<10:
            return "Intern"
        elif self.level<25:
            return "Junior Developer"
        elif self.level<50:
            return "Mid Level Developer"
        else:
            return "Senior Developer"
    @computed_field
    def next_level_xp_limit(self)->int:
        return 50*(self.level**2)

class UserUpdate(BaseModel):
    username:Optional[str]=None
    password:Optional[str]=None
