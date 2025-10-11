#pragma once
#include <iostream>
#include <string>

using namespace std;

class Account
{
public:
	Account();
	~Account();

	bool setStaffId(int staffId);
	bool setPassword(string password);
	bool setAccountType(string accountType);

	int getStaffId();
	string getPassword();
	string getAccountType();

private:
	int staffID;
	string password;
	string accountType;
};