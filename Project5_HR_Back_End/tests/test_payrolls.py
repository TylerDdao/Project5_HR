def test_get_my_payrolls(client, manager_token, mocker):
    mock_db = mocker.patch("app.PayrollDatabase")
    instance = mock_db.return_value
    instance.get_my_payroll.return_value = {
        "this_month": [{"id": 1}],
        "all": [{"id": 1}, {"id": 2}]
    }

    resp = client.get(
        "/api/my_payrolls?staff_id=1",
        headers={"Authorization": manager_token}
    )

    assert resp.status_code == 200
    data = resp.get_json()
    assert len(data["this_month_payrolls"]) == 1
    assert len(data["all_payrolls"]) == 2
