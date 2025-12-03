def test_get_active_shifts(client, manager_token, mocker):
    mock_db = mocker.patch("app.ShiftsDatabase")
    instance = mock_db.return_value
    instance.get_active_shifts.return_value = ["shift1"]
    instance.get_scheduled_shifts.return_value = ["shift2"]

    resp = client.get(
        "/api/shift_detail",
        headers={"Authorization": manager_token}
    )

    data = resp.get_json()
    assert resp.status_code == 200
    assert data["success"] is True
    assert data["active_shifts"] == ["shift1"]
    assert data["scheduled_shifts"] == ["shift2"]


def test_create_shift_unauthorized(client, employee_token):
    resp = client.post(
        "/api/create_shift",
        json={"start_time": "2025-01-01", "end_time": "2025-01-01", "staffs": [1]},
        headers={"Authorization": employee_token}
    )

    assert resp.status_code == 401


def test_create_shift_success(client, manager_token, mocker):
    mock_db = mocker.patch("app.ShiftsDatabase")
    instance = mock_db.return_value
    instance.insert_shift.return_value = 123

    resp = client.post(
        "/api/create_shift",
        json={
            "start_time": "2025-01-01",
            "end_time": "2025-01-02",
            "staffs": [1, 2]
        },
        headers={"Authorization": manager_token}
    )

    assert resp.status_code == 200
    assert resp.get_json()["shift_id"] == 123
