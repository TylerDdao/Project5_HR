def test_create_announcement_success(client, manager_token, mocker):
    mock_db = mocker.patch("app.CommunicationsDatabase")
    instance = mock_db.return_value
    instance.insert_communication.return_value = 99

    resp = client.post(
        "/api/create_communication",
        json={
            "type": "announcement",
            "sender_id": 1,
            "subject": "Hello",
            "body": "World",
            "sent_at": "2025-01-01"
        },
        headers={"Authorization": manager_token}
    )

    assert resp.status_code == 200
    assert resp.get_json()["communication_id"] == 99
