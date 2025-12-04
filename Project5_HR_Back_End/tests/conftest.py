import pytest
import jwt
import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import app, SECRET_KEY, ISSUER


@pytest.fixture
def client():
    """
    @brief Create Flask test client for API integration testing.
        Enable sending HTTP request to application endpoint without starting actual development server
    """
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


@pytest.fixture
def manager_token():
    """Create a valid manager JWT token"""
    payload = {
        "staff": {
            "staff_id": 1,
            "name": "Manager Test",
            "account": {"account_type": "manager"},
        },
        "iss": ISSUER,
    }
    return "Bearer " + jwt.encode(payload, SECRET_KEY, algorithm="HS256")


@pytest.fixture
def employee_token():
    """Create a normal employee JWT token"""
    payload = {
        "staff": {
            "staff_id": 2,
            "name": "Employee Test",
            "account": {"account_type": "employee"},
        },
        "iss": ISSUER,
    }
    return "Bearer " + jwt.encode(payload, SECRET_KEY, algorithm="HS256")
