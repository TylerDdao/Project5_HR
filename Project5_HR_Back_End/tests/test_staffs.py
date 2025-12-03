def test_get_staff_success(client, manager_token, mocker):
    mock_db = mocker.patch("app.StaffsDatabase")
    instance = mock_db.return_value
    instance.get_staff_by_id.return_value = {"staff_id": 2, "name": "A"}

    resp = client.get(
        "/api/get_staff?staff_id=2",
        headers={"Authorization": manager_token}
    )

    assert resp.status_code == 200
    assert resp.get_json()["staff"]["name"] == "A"


def test_add_staff_success(client, manager_token, mocker):
    mock_db = mocker.patch("app.StaffsDatabase")
    instance = mock_db.return_value
    instance.insert_staff.return_value = 55

    resp = client.post(
        "/api/add_staff",
        json={
            "name": "John",
            "phone_number": "555",
            "wage_rate": 20,
            "position": "Cook",
            "hire_date": "2025-01-01",
            "password": "123",
            "account_type": "employee"
        },
        headers={"Authorization": manager_token}
    )

    data = resp.get_json()
    assert data["success"] is True
    assert data["staff_id"] == 55
