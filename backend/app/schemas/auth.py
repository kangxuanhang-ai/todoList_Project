from pydantic import BaseModel, Field


USERNAME_MIN = 2
USERNAME_MAX = 50
PASSWORD_MIN = 6
PASSWORD_MAX = 128


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=USERNAME_MIN, max_length=USERNAME_MAX)
    password: str = Field(..., min_length=PASSWORD_MIN, max_length=PASSWORD_MAX)


class LoginRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str

    model_config = {"from_attributes": True}
