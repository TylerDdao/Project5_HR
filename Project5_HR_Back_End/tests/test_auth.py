def test_login_success(client, mocker):
    mock_db = mocker.patch("app.StaffsDatabase")
    instance = mock_db.return_value
    instance.verify_login.return_value = {
        "staff_id": 10,
        "name": "Bob",
        "account": {"account_type": "employee"}
    }

    resp = client.post("/api/login", json={
        "staff_id": 10,
        "password": "pass"
    })

    assert resp.status_code == 200
    data = resp.get_json()
    assert data["success"] is True
    assert "token" in data


def test_login_fail(client, mocker):
    mock_db = mocker.patch("app.StaffsDatabase")
    instance = mock_db.return_value
    instance.verify_login.return_value = None

    resp = client.post("/api/login", json={
        "staff_id": 10,
        "password": "wrong"
    })

    assert resp.status_code == 401
    assert resp.get_json()["success"] is False
